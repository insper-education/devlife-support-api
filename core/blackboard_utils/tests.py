from pathlib import Path
from io import FileIO
from django.core.files.base import File
from django.test import TestCase

from .loader import EMAIL, LAST_NAME, NAME, USERNAME, load_blackboard_students


DATA_DIR = Path(__file__).parent / 'testdata'
STUDENTS_COMMA = DATA_DIR / 'students_comma.csv'
STUDENTS_TAB = DATA_DIR / 'students_tab.xls'
UNKNOWN_EXT = DATA_DIR / 'students_unknown.txt'
STUDENT_DATA = {
    'Leeroy': {
        NAME: 'Leeroy',
        LAST_NAME: 'Jenkins',
        USERNAME: 'leeroyj',
        EMAIL: 'leeroyj@al.insper.edu.br'
    },
    'Harry': {
        NAME: 'Harry',
        LAST_NAME: 'Potter',
        USERNAME: 'harryp2',
        EMAIL: 'harryp2@al.insper.edu.br'
    },
    'Bruce': {
        NAME: 'Bruce',
        LAST_NAME: 'Banner',
        USERNAME: 'bruceb4',
        EMAIL: 'bruceb4@al.insper.edu.br'
    },
}


def as_django_file(filename):
    return File(file=FileIO(filename), name=filename)


class BlackboardUtilsTestCase(TestCase):
    def assert_student_data(self, students):
        self.assertEqual(len(students), 3)
        for _, row in students.iterrows():
            self.assertIn(row[NAME], STUDENT_DATA)
            data = STUDENT_DATA[row[NAME]]
            for k, v in data.items():
                self.assertEqual(row[k], v)

    def test_load_blackboard_student_data_with_tabs(self):
        students = load_blackboard_students(STUDENTS_TAB)
        self.assert_student_data(students)

    def test_load_blackboard_student_data_with_tabs_str_filename(self):
        students = load_blackboard_students(str(STUDENTS_TAB))
        self.assert_student_data(students)

    def test_load_blackboard_student_data_with_tabs_django_file(self):
        students = load_blackboard_students(as_django_file(STUDENTS_TAB))
        self.assert_student_data(students)

    def test_load_blackboard_student_data_with_comma(self):
        students = load_blackboard_students(STUDENTS_COMMA)
        self.assert_student_data(students)


    def test_load_blackboard_student_data_with_comma_str_filename(self):
        students = load_blackboard_students(str(STUDENTS_COMMA))
        self.assert_student_data(students)

    def test_load_blackboard_student_data_fails_with_unknown_extension(self):
        with self.assertRaises(RuntimeError):
            load_blackboard_students(UNKNOWN_EXT)
