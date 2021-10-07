from .blackboard_utils.loader import EMAIL, LAST_NAME, NAME, USERNAME, load_blackboard_students
from .models import Enrollment, Student, User


def get_or_create_student_list(blackboard_file):
    students_df = load_blackboard_students(blackboard_file)
    students = []
    for _, student_data in students_df.iterrows():
        username = student_data[USERNAME]
        try:
            student = Student.objects.get(username=username)
        except User.DoesNotExist:
            # We can't use bulk_create because it doesn't trigger post_save
            student = Student.objects.create_user(
                first_name=student_data[NAME],
                last_name=student_data[LAST_NAME],
                username=username,
                email=student_data[EMAIL],
                password=Student.objects.make_random_password()
            )
        students.append(student)
    return students


def enroll_students(students, offering):
    new_enrollments = []
    for student in students:
        if not Enrollment.objects.filter(student=student).exists():
            new_enrollments.append(Enrollment(student=student, offering=offering))
    Enrollment.objects.bulk_create(new_enrollments)
