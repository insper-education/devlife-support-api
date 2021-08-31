from pathlib import Path
from django.http import Http404
from django.test import TestCase
from core.models import Course, Enrollment, Instructor, Offering, Student, Teaches, Exercise, Answer, UserAnswerSummary


class AnswerSignalTestCase(TestCase):
    def setUp(self):
        self.student = Student.objects.create_user(
            username='john.doe',
            password='1234'
        )
        self.instructor = Instructor.objects.create_user(
            username='bill.doors',
            password='4567'
        )
        self.course = Course.objects.create(name='Walls OS')
        self.offering = Offering.objects.create(
            course=self.course,
            description='Introduction to Walls OS'
        )
        self.enrollment = Enrollment.objects.create(
            student=self.student,
            offering=self.offering
        )
        self.teaches = Teaches.objects.create(
            instructor=self.instructor,
            offering=self.offering
        )
        self.exercise1 = Exercise.objects.create(
            offering=self.offering,
            slug='walls-exercise-1',
            url='bill.doors.com/walls/',
            type=Exercise.ExerciseType.CODE
        )
        self.exercise2 = Exercise.objects.create(
            offering=self.offering,
            slug='walls-exercise-2',
            url='bill.doors.com/walls/',
            type=Exercise.ExerciseType.CODE
        )

    def create_answer(self, exercise, points):
        return Answer.objects.create(
            user=self.student,
            exercise=exercise,
            points=points,
            summary='{}',
            long_answer='{}',
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
