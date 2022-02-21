from django.http import response
from core.permissions import IsEnrolledInOfferingOrIsStaff
from django.utils.translation import gettext as _
from django.conf import settings
from django.core import mail
from django.test import TestCase
from core.models import Course, Enrollment, Instructor, Offering, Student, Teaches, Exercise, Answer, User, UserAnswerSummary
from unittest.mock import MagicMock
from rest_framework.test import APIRequestFactory, APITestCase, force_authenticate
from rest_framework.authtoken.models import Token

from .views import AnswerViewSet, ExerciseViewSet, activate_exercise, deactivate_exercise, get_enrolled_students, list_students_that_tried_exercise ,list_summaries, get_latest_answer_by_student

# Include tests from blackboard_utils
from .blackboard_utils.tests import *

class AnswerSignalTestCase(TestCase):
    def setUp(self):
        self.student = Student.objects.create_user(username="john.doe", password="1234")
        self.instructor = Instructor.objects.create_user(
            username="bill.doors", password="4567"
        )
        self.course = Course.objects.create(name="Walls OS")
        self.offering = Offering.objects.create(
            course=self.course, description="Introduction to Walls OS"
        )
        self.enrollment = Enrollment.objects.create(
            student=self.student, offering=self.offering
        )
        self.teaches = Teaches.objects.create(
            instructor=self.instructor, offering=self.offering
        )
        self.exercise1 = Exercise.objects.create(
            offering=self.offering,
            slug="walls-exercise-1",
            url="bill.doors.com/walls/",
            type=Exercise.ExerciseType.CODE,
        )
        self.exercise2 = Exercise.objects.create(
            offering=self.offering,
            slug="walls-exercise-2",
            url="bill.doors.com/walls/",
            type=Exercise.ExerciseType.CODE,
        )

    def create_answer(self, exercise, points):
        return Answer.objects.create(
            user=self.student,
            exercise=exercise,
            points=points,
            test_results="{}",
            student_input="{}",
        )

    def assert_sumary(self, exercise, max_points, count, latest_id):
        summary = UserAnswerSummary.objects.get(user=self.student, exercise=exercise)
        self.assertAlmostEqual(summary.max_points, max_points)
        self.assertEqual(summary.answer_count, count)
        if summary.latest:
            self.assertEqual(summary.latest.id, latest_id)
        else:
            self.assertIsNone(summary.latest)

    def test_should_send_signal_when_created(self):
        answers1 = []
        answers2 = []

        # Create answer for exercise 1
        answers1.append(self.create_answer(self.exercise1, 0.5))
        self.assert_sumary(self.exercise1, 0.5, 1, answers1[-1].id)

        # Create answer for exercise 2
        answers2.append(self.create_answer(self.exercise2, 0.8))
        self.assert_sumary(self.exercise1, 0.5, 1, answers1[-1].id)
        self.assert_sumary(self.exercise2, 0.8, 1, answers2[-1].id)

        # Create answer for exercise 1 with more points
        answers1.append(self.create_answer(self.exercise1, 0.6))
        self.assert_sumary(self.exercise1, 0.6, 2, answers1[-1].id)
        self.assert_sumary(self.exercise2, 0.8, 1, answers2[-1].id)

        # Create answer for exercise 1 with less points
        answers1.append(self.create_answer(self.exercise1, 0.3))
        self.assert_sumary(self.exercise1, 0.6, 3, answers1[-1].id)
        self.assert_sumary(self.exercise2, 0.8, 1, answers2[-1].id)

        # Delete second answer for exercise 1
        answer = answers1.pop(1)
        answer.delete()
        self.assert_sumary(self.exercise1, 0.5, 2, answers1[-1].id)
        self.assert_sumary(self.exercise2, 0.8, 1, answers2[-1].id)

        # Delete last answer for exercise 1
        answer = answers1.pop()
        answer.delete()
        self.assert_sumary(self.exercise1, 0.5, 1, answers1[-1].id)
        self.assert_sumary(self.exercise2, 0.8, 1, answers2[-1].id)

        # Delete last answer for exercise 1
        answer = answers1.pop()
        answer.delete()
        self.assert_sumary(self.exercise1, 0, 0, None)
        self.assert_sumary(self.exercise2, 0.8, 1, answers2[-1].id)


class TokenCreationTest(TestCase):
    def test_token_creation_for_student(self):
        st = Student.objects.create_user(username='df', password='asd')
        assert Token.objects.get(user=st)

    def test_token_creation_for_instructor(self):
        st = Instructor.objects.create_user(username='df', password='asd')
        assert Token.objects.get(user=st)


class IsEnrolledPermisson(TestCase):
    def setUp(self):
        self.permission = IsEnrolledInOfferingOrIsStaff()

        self.prof1 = Instructor.objects.create_user(
            username='prof1',
            password='12'
        )

        self.student1 = Student.objects.create_user(
            username='student1',
            password='12'
        )

        self.student2 = Student.objects.create_user(
            username='student2',
            password='12'
        )

        self.course = Course.objects.create(
            name='TestCourse'
        )

        self.offering = Offering.objects.create(
            course=self.course,
            description='bla'
        )

        Enrollment.objects.create(
            student=self.student1,
            offering=self.offering
        )

    def test_deny_access_to_student_not_enrolled(self):
        request = MagicMock(user=self.student2)
        view = MagicMock(kwargs={'off_pk': self.offering.pk})
        assert self.permission.has_permission(request, view) == False

    def test_allow_access_to_enrolled_student(self):
        request = MagicMock(user=self.student1)
        view = MagicMock(kwargs={'off_pk': self.offering.pk})
        assert self.permission.has_permission(request, view) == True

    def test_allow_access_to_instructors(self):
        request = MagicMock(user=self.prof1)
        view = MagicMock(kwargs={'off_pk': self.offering.pk})
        assert self.permission.has_permission(request, view) == True

    def test_student_list_create_exercises_in_offering(self):
        fac = APIRequestFactory()
        req_list = fac.get(f'offerings/{self.offering.pk}/exercises/')
        force_authenticate(req_list, self.student1)
        viewset = ExerciseViewSet.as_view({'get': 'list', 'post': 'create'})
        resp = viewset(req_list, off_pk=self.offering.pk)
        assert resp.status_code == 200, 'Student should list all exercises'


        req_create = fac.post(f'offerings/{self.offering.pk}/exercises/', data={
                'url': '/abc/',
                'type': 'code',
                'topic': 'while',
                'group': 'gg',
                'slug': 'a-b-c'
            })
        force_authenticate(req_create, self.student1)
        resp = viewset(req_create, off_pk=self.offering.pk)
        assert resp.status_code == 403, 'Student should not be able to create exercises'

    def test_instructor_list_create_exercises_in_offering(self):
        fac = APIRequestFactory()
        req_list = fac.get(f'offerings/{self.offering.pk}/exercises/')
        force_authenticate(req_list, self.prof1)
        viewset = ExerciseViewSet.as_view({'get': 'list', 'post': 'create'})
        resp = viewset(req_list, off_pk=self.offering.pk)
        assert resp.status_code == 200, f'Instructor should be able to list all exercises. Got {resp.status_code}'

        req_create = fac.post(f'offerings/{self.offering.pk}/exercises/', data={
                'url': '/abc/',
                'type': 'code',
                'topic': 'while',
                'group': 'gg',
                'slug': 'a-b-c'
            })
        force_authenticate(req_create, self.prof1)
        resp = viewset(req_create, off_pk=self.offering.pk)
        assert resp.status_code == 201, 'Instructor should be able to create exercises'

    def test_student_list_summaries_enrolled(self):
        fac = APIRequestFactory()
        req_list = fac.get(f'offerings/{self.offering.pk}/summaries/')
        force_authenticate(req_list, self.student1)

        resp = list_summaries(req_list, off_pk=self.offering.pk)
        assert resp.status_code == 200

    def test_student_list_summaries_not_enrolled(self):
        fac = APIRequestFactory()
        req_list = fac.get(f'offerings/5/summaries/')
        force_authenticate(req_list, self.student1)

        resp = list_summaries(req_list, off_pk=5)
        assert resp.status_code != 200


class StudentAndInstructorTests(TestCase):
    def test_instructor_always_staff(self):
        self.prof1 = Instructor.objects.create_user(
            username='prof12',
            password='12'
        )
        assert self.prof1.is_staff == True


class PasswordResetEmailTestCase(APITestCase):
    def setUp(self):
        self.course = Course.objects.create(name='Engineer Life')
        self.offering_url = 'https://engineer.life.com/'
        self.offering_with_url = Offering.objects.create(
            course=self.course,
            description='Offering with url',
            url=self.offering_url,
        )
        self.offering_without_url = Offering.objects.create(
            course=self.course,
            description='Offering without url',
        )
        self.another_url = 'https://engineer.life.com/2030/'
        self.another_offering_with_url = Offering.objects.create(
            course=self.course,
            description='Another offering with url',
            url=self.another_url,
        )

    def enroll(self, student, offering):
        Enrollment.objects.create(student=student, offering=offering)

    def create_student(self, with_email=True):
        kwargs = {
            "first_name": "Leeroy",
            "last_name": "Jenkins",
            "username": "leeroyj",
            "password": User.objects.make_random_password(),
        }
        if with_email:
            kwargs["email"] = "leeroyj@al.insper.edu.br"
        return Student.objects.create_user(**kwargs)

    def assert_reset_email(self, email, expected_subject, client_url, user, first_time):
        self.assertEqual(email.subject, expected_subject)
        self.assertEqual(email.from_email, settings.DEFAULT_FROM_EMAIL)
        self.assertListEqual(email.to, [user.email])
        self.assertIn(f"{client_url}password-reset", email.body)
        if first_time:
            self.assertIn("&first=true", email.body)
        else:
            self.assertNotIn("&first=true", email.body)

    def test_send_password_reset_email_api_endpoint(self):
        user = self.create_student()
        mail.outbox = []  # Creating a user triggers a password reset email

        response = self.client.post(
            f"/api/auth/password/reset/?offering={self.offering_with_url.id}&first_time=true",
            {"email": user.email},
            format="json",
        )
        self.assertEqual(response.status_code, 200)

        response = self.client.post(f"/api/auth/password/reset/?offering={self.offering_with_url.id}", {"email": user.email})
        self.assertEqual(response.status_code, 200)

        self.assertEqual(len(mail.outbox), 2)

        expected_emails = [
            (_("[DevLife] Set password"), True),
            (_("[DevLife] Password reset"), False),
        ]
        for (expected_subject, first_time), email in zip(expected_emails, mail.outbox):
            self.assert_reset_email(
                email,
                expected_subject,
                self.offering_url,
                user,
                first_time,
            )

    def test_send_password_reset_email_when_user_is_enrolled_in_offering_with_url(self):
        user = self.create_student()
        self.enroll(user, self.offering_with_url)
        self.enroll(user, self.another_offering_with_url)

        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]
        self.assert_reset_email(
            email,
            _("[DevLife] Set password"),
            self.offering_url,
            user,
            True,
        )

    def test_doesnt_send_password_reset_email_when_already_sent_before(self):
        user = self.create_student()
        user.password_email_sent = True
        user.save()
        self.enroll(user, self.offering_with_url)

        self.assertEqual(len(mail.outbox), 0)

    def test_doesnt_send_password_reset_email_when_user_is_enrolled_in_offering_without_url(self):
        user = self.create_student()
        self.enroll(user, self.offering_without_url)

        user.password_email_sent = True
        user.save()
        self.enroll(user, self.offering_with_url)

        self.assertEqual(len(mail.outbox), 0)

    def test_send_password_reset_email_when_user_adds_email_and_is_enrolled_again(self):
        user = self.create_student(with_email=False)
        self.enroll(user, self.offering_with_url)
        self.assertEqual(len(mail.outbox), 0)

        user.email = "leeroyj@al.insper.edu.br"
        user.save()
        self.enroll(user, self.another_offering_with_url)

        self.assertEqual(len(mail.outbox), 1)
        email = mail.outbox[0]
        self.assert_reset_email(
            email,
            _("[DevLife] Set password"),
            self.another_url,
            user,
            True,
        )


class AnswerViewSetTestCase(TestCase):
    def setUp(self) -> None:
        self.student1 = Student.objects.create_user(username="john.doe", password="1234")
        self.student2 = Student.objects.create_user(username="john.dois", password="1234")
        self.instructor = Instructor.objects.create_user(
            username="bill.doors", password="4567"
        )

        self.course = Course.objects.create(name="Walls OS")
        self.offering = Offering.objects.create(
            course=self.course, description="Introduction to Walls OS"
        )
        Enrollment.objects.create(
            student=self.student1, offering=self.offering
        )
        Enrollment.objects.create(
            student=self.student2, offering=self.offering
        )
        self.teaches = Teaches.objects.create(
            instructor=self.instructor, offering=self.offering
        )
        self.exercise1 = Exercise.objects.create(
            offering=self.offering,
            slug="walls-exercise-1",
            url="bill.doors.com/walls/",
            type=Exercise.ExerciseType.CODE,
        )

        self.exercise2 = Exercise.objects.create(
            offering=self.offering,
            slug="walls-exercise-2",
            url="bill.doors.com/walls/",
            type=Exercise.ExerciseType.CODE,
        )

        self.answer_s1 = Answer.objects.create(
            exercise=self.exercise1,
            user=self.student1,
            points=1,
            test_results={},
            student_input={}
        )
        self.answer_s2 = Answer.objects.create(
            exercise=self.exercise1,
            user=self.student2,
            points=1,
            test_results={},
            student_input={}
        )

    def test_student_submits_answer(self):
        fac = APIRequestFactory()
        req_list = fac.post(f'offerings/{self.offering.pk}/exercises/{self.exercise1.slug}/answers', data={
            'test_results': '\"sdflkjsdflsd\"',
            'student_input': '\"sdfhjsk\"',
            'points':  1.0
        })
        force_authenticate(req_list, self.student1)

        view = AnswerViewSet.as_view({'post': 'create'})
        resp = view(req_list, off_pk = self.offering.pk, ex_slug=self.exercise2.slug)
        assert resp.status_code == 201
        assert len(Answer.objects.filter(user=self.student1, exercise=self.exercise2)) == 1

    def test_student_submits_answer_submission_not_allowed(self):
        fac = APIRequestFactory()
        req_list = fac.post(f'offerings/{self.offering.pk}/exercises/{self.exercise1.slug}/answers', data={
            'test_results': '\"sdflkjsdflsd\"',
            'student_input': '\"sdfhjsk\"',
            'points':  1.0
        })
        force_authenticate(req_list, self.student1)

        self.exercise2.allow_submissions = False
        self.exercise2.save()

        view = AnswerViewSet.as_view({'post': 'create'})
        resp = view(req_list, off_pk = self.offering.pk, ex_slug=self.exercise2.slug)
        assert resp.status_code == 403
        assert len(Answer.objects.filter(user=self.student1, exercise=self.exercise2)) == 0

    def test_student_lists_their_own_answers(self):
        fac = APIRequestFactory()
        req_list = fac.get(f'offerings/{self.offering.pk}/exercises/{self.exercise1.slug}/answers')
        force_authenticate(req_list, self.student1)

        view = AnswerViewSet.as_view({'get': 'list'})
        resp = view(req_list, off_pk=self.offering.pk, ex_slug=self.exercise1.slug)
        assert resp.status_code == 200
        assert all([el['user'] == self.student1.pk for el in resp.data]), 'Results include answers from a different student.'

    def test_student_gets_401_if_asking_for_other_student_answers(self):
        fac = APIRequestFactory()
        req_list = fac.get(f'offerings/{self.offering.pk}/exercises/{self.exercise1.slug}/answers/students/2/')
        force_authenticate(req_list, self.student1)

        view = AnswerViewSet.as_view({'get': 'list_answers_by_student'})
        resp = view(req_list, off_pk=self.offering.pk, ex_slug=self.exercise1.slug, student_pk=2)
        assert resp.status_code == 403

    def test_instructor_lists_all_answers(self):
        fac = APIRequestFactory()
        req_list = fac.get(f'offerings/{self.offering.pk}/exercises/{self.exercise1.slug}/answers')
        force_authenticate(req_list, self.instructor)

        view = AnswerViewSet.as_view({'get': 'list'})
        resp = view(req_list, off_pk=self.offering.pk, ex_slug=self.exercise1.slug)
        assert resp.status_code == 200
        assert len(resp.data) == 2, 'Less than 2 answers were returned.'
        assert all([el['user'] == self.student1.pk or
                    el['user'] == self.student2.pk for el in resp.data]), \
                    'Results does not contain answers for all students'

    def test_instructor_lists_all_answers_from_student(self):
        fac = APIRequestFactory()
        req_list = fac.get(f'offerings/{self.offering.pk}/exercises/{self.exercise1.slug}/answers/students/2')
        force_authenticate(req_list, self.instructor)

        view = AnswerViewSet.as_view({'get': 'list_answers_by_student'})
        resp = view(req_list, off_pk=self.offering.pk, ex_slug=self.exercise1.slug, student_pk=2)
        assert resp.status_code == 200
        assert all([el['pk'] == self.student2.pk for el in resp.data]), \
                    "Answers from a student different than student2 were returned."



class CodeExerciseBackend(TestCase):
    def setUp(self) -> None:
        self.student1 = Student.objects.create_user(username="john.um", password="1234")
        self.student2 = Student.objects.create_user(username="john.doe", password="1234")
        self.student3 = Student.objects.create_user(username="john.tres", password="1234")

        self.instructor = Instructor.objects.create_user(
            username="bill.doors", password="4567"
        )

        self.course = Course.objects.create(name="Walls OS")
        self.offering = Offering.objects.create(
            course=self.course, description="Introduction to Walls OS"
        )
        Enrollment.objects.create(
            student=self.student1, offering=self.offering
        )
        Enrollment.objects.create(
            student=
            self.student2, offering=self.offering
        )
        Enrollment.objects.create(
            student=self.student3, offering=self.offering
        )
        self.teaches = Teaches.objects.create(
            instructor=self.instructor, offering=self.offering
        )
        self.exercise1 = Exercise.objects.create(
            offering=self.offering,
            slug="walls-exercise-1",
            url="bill.doors.com/walls/",
            type=Exercise.ExerciseType.CODE,
        )

        self.answer_s1 = Answer.objects.create(
            exercise=self.exercise1,
            user=self.student1,
            points=1,
            test_results={},
            student_input={}
        )
        self.answer_s2 = Answer.objects.create(
            exercise=self.exercise1,
            user=self.student2,
            points=1,
            test_results={},
            student_input={}
        )

    def test_list_students_that_tried_exercise(self):
        fac = APIRequestFactory()
        req_list = fac.get(f'offerings/{self.offering.pk}/exercises/{self.exercise1.slug}/answers/students')
        force_authenticate(req_list, self.instructor)

        resp = list_students_that_tried_exercise(req_list, off_pk=self.offering.pk, ex_slug=self.exercise1.slug)
        assert resp.status_code == 200
        response_student_pk = [st['pk'] for st in resp.data]
        assert self.student1.pk in response_student_pk, 'Student1 não está na resposta, mas submeteu exercícios para o exercício!'
        assert self.student2.pk in response_student_pk, 'Student2 não está na resposta, mas submeteu exercícios para o exercício!'
        assert not self.student3.pk in response_student_pk, 'Student3 está na resposta, mas não submeteu exercícios para o exercício!'



class TestLatestAnswerByStudent(TestCase):
    def setUp(self) -> None:
        self.student = Student.objects.create_user(username="john.doe", password="1234")
        self.course = Course.objects.create(name="Walls OS")
        self.offering = Offering.objects.create(
            course=self.course, description="Introduction to Walls OS"
        )
        Enrollment.objects.create(
            student=self.student, offering=self.offering
        )

        self.exercise1 = Exercise.objects.create(
            offering=self.offering,
            slug="walls-exercise-1",
            url="bill.doors.com/walls/",
            type=Exercise.ExerciseType.CODE,
        )

        self.exercise2 = Exercise.objects.create(
            offering=self.offering,
            slug="walls-exercise-2",
            url="bill.doors.com/walls/2",
            type=Exercise.ExerciseType.CODE,
        )
        Answer.objects.create(
            exercise=self.exercise2,
            user=self.student,
            points=1,
            test_results={},
            student_input={'text': 'answer 1'}
        )

        self.exercise3 = Exercise.objects.create(
            offering=self.offering,
            slug="walls-exercise-3",
            url="bill.doors.com/walls/3",
            type=Exercise.ExerciseType.CODE,
        )
        for i in range(3):
            Answer.objects.create(
                exercise=self.exercise3,
                user=self.student,
                points=1,
                test_results={},
                student_input={'text': f'answer {i+1}'}
            )

    def test_student_did_not_answer_exercise(self):
        fac = APIRequestFactory()
        req = fac.get(f'offerings/{self.offering.pk}/exercises/{self.exercise1.slug}/answers/latest/{self.student.pk}')
        force_authenticate(req, self.student)

        resp = get_latest_answer_by_student(req, off_pk=self.offering.pk, ex_slug=self.exercise1.slug, student_pk=self.student.pk)
        assert resp.status_code == 404, 'Estudante nunca enviou resposta mas status é diferente de 404'

    def test_student_answered_one(self):
        fac = APIRequestFactory()
        req = fac.get(f'offerings/{self.offering.pk}/exercises/{self.exercise2.slug}/answers/latest/{self.student.pk}')
        force_authenticate(req, self.student)

        resp = get_latest_answer_by_student(req, off_pk=self.offering.pk, ex_slug=self.exercise2.slug, student_pk=self.student.pk)
        assert resp.status_code == 200, 'Estudante enviou resposta mas status é diferente de 200'
        assert resp.data['student_input']['text'] == 'answer 1'

    def test_student_answered_3_times(self):
        fac = APIRequestFactory()
        req = fac.get(f'offerings/{self.offering.pk}/exercises/{self.exercise3.slug}/answers/latest/{self.student.pk}')
        force_authenticate(req, self.student)

        resp = get_latest_answer_by_student(req, off_pk=self.offering.pk, ex_slug=self.exercise3.slug, student_pk=self.student.pk)
        assert resp.status_code == 200, 'Estudante enviou resposta mas status é diferente de 200'
        assert resp.data['student_input']['text'] == 'answer 3'


class TestActivateDeactivateExercise(TestCase):
    def setUp(self):
        self.student = Student.objects.create_user(username="john.doe", password="1234")
        self.instructor = Instructor.objects.create_user(
            username="bill.doors", password="4567"
        )
        self.course = Course.objects.create(name="Walls OS")
        self.offering = Offering.objects.create(
            course=self.course, description="Introduction to Walls OS"
        )
        self.enrollment = Enrollment.objects.create(
            student=self.student, offering=self.offering
        )
        self.teaches = Teaches.objects.create(
            instructor=self.instructor, offering=self.offering
        )
        self.exercise1 = Exercise.objects.create(
            offering=self.offering,
            slug="walls-exercise-1",
            url="bill.doors.com/walls/",
            type=Exercise.ExerciseType.CODE,
        )

        self.exercise2 = Exercise.objects.create(
            offering=self.offering,
            slug="walls-exercise-2",
            url="bill.doors.com/walls/",
            type=Exercise.ExerciseType.CODE,
            allow_submissions=False
        )

    def test_activate_already_activated_exercise(self):
        fac = APIRequestFactory()
        req = fac.get(f'offerings/{self.offering.pk}/exercises/{self.exercise1.slug}/activate/')
        force_authenticate(req, self.instructor)

        resp = activate_exercise(req, off_pk=self.offering.pk, ex_slug=self.exercise1.slug)
        assert resp.status_code == 200
        ex =  Exercise.objects.get(id=self.exercise1.pk)
        assert ex.allow_submissions == True

    def test_deactivate_already_deactivated_exercise(self):
        fac = APIRequestFactory()
        req = fac.get(f'offerings/{self.offering.pk}/exercises/{self.exercise2.slug}/activate/')
        force_authenticate(req, self.instructor)

        resp = deactivate_exercise(req, off_pk=self.offering.pk, ex_slug=self.exercise2.slug)
        assert resp.status_code == 200
        ex =  Exercise.objects.get(id=self.exercise2.pk)
        assert ex.allow_submissions == False

    def test_activate_exercise(self):
        fac = APIRequestFactory()
        req = fac.get(f'offerings/{self.offering.pk}/exercises/{self.exercise2.slug}/activate/')
        force_authenticate(req, self.instructor)

        resp = activate_exercise(req, off_pk=self.offering.pk, ex_slug=self.exercise2.slug)
        assert resp.status_code == 200
        ex =  Exercise.objects.get(id=self.exercise2.pk)
        assert ex.allow_submissions == True

    def test_deactivate_exercise(self):
        fac = APIRequestFactory()
        req = fac.get(f'offerings/{self.offering.pk}/exercises/{self.exercise1.slug}/deactivate/')
        force_authenticate(req, self.instructor)

        resp = deactivate_exercise(req, off_pk=self.offering.pk, ex_slug=self.exercise1.slug)
        assert resp.status_code == 200
        ex =  Exercise.objects.get(id=self.exercise1.pk)
        assert ex.allow_submissions == False

    def test_student_does_not_activate_exercise(self):
        fac = APIRequestFactory()
        req = fac.get(f'offerings/{self.offering.pk}/exercises/{self.exercise1.slug}/deactivate/')
        force_authenticate(req, self.student)

        resp = deactivate_exercise(req, off_pk=self.offering.pk, ex_slug=self.exercise1.slug)
        assert resp.status_code == 403

        resp = activate_exercise(req, off_pk=self.offering.pk, ex_slug=self.exercise1.slug)
        assert resp.status_code == 403


class EnrollmentTests(TestCase):
    def setUp(self):
        self.instructor = Instructor.objects.create_user(
            username='Mr.Jin',
            password='271828'
        )
        self.student_enrolled = Student.objects.create_user(
            username="john.doe",
            password="182845"
        )
        self.student_not_enrolled = Student.objects.create_user(
            username="mark.pollo",
            password="904523"
        )
        self.student_enrolled_in_other_offering = Student.objects.create_user(
            username="steven.works",
            password="536028"
        )
        self.student_enrolled_in_both = Student.objects.create_user(
            username="steve.oz",
            password="747135"
        )

        self.course = Course.objects.create(name="Walls OS")
        self.old_offering = Offering.objects.create(
            course=self.course, description="Introduction to Walls OS (old)"
        )
        self.offering = Offering.objects.create(
            course=self.course, description="Introduction to Walls OS"
        )

        Enrollment.objects.create(
            student=self.student_enrolled, offering=self.offering
        )
        Enrollment.objects.create(
            student=self.student_enrolled_in_other_offering, offering=self.old_offering
        )
        Enrollment.objects.create(
            student=self.student_enrolled_in_both, offering=self.offering
        )
        Enrollment.objects.create(
            student=self.student_enrolled_in_both, offering=self.old_offering
        )

    def test_list_enrolled_students_by_student(self):
        fac = APIRequestFactory()
        req = fac.get(f'offerings/{self.offering.pk}/students/')
        force_authenticate(req, self.student_enrolled)

        resp = get_enrolled_students(req, off_pk=self.offering.pk)
        assert resp.status_code == 403, "Student shouldn't have access to enrolled students list"

    def test_list_enrolled_students_by_instructor(self):
        fac = APIRequestFactory()
        req = fac.get(f'offerings/{self.offering.pk}/students/')
        force_authenticate(req, self.instructor)

        resp = get_enrolled_students(req, off_pk=self.offering.pk)
        assert resp.status_code == 200, "Instructor doesn't have access to enrolled students list"

        enrolled_students = resp.data
        assert len(enrolled_students) == 2, "There should be exactly 2 students enrolled"

        enrolled_usernames = [s['username'] for s in enrolled_students]
        expected_usernames = [
            self.student_enrolled.username,
            self.student_enrolled_in_both.username,
        ]
        for expected in expected_usernames:
            assert expected in enrolled_usernames, f"{expected} should be enrolled"
