from db_handler.db_handler import DBHandler
from db_handler.password import PasswordHandler
from models import Course, Student
from tests.mock_data import COURSE, STUDENT


def compare_students(
    password_handler: PasswordHandler,
    student_1: Student,
    student_2: Student,
):
    assert student_1.student_id == student_2.student_id
    assert student_1.features == student_2.features
    assert student_1.email == student_2.email
    assert password_handler.hash_password(student_2.password) == student_1.password
    assert student_1 is not student_2


def test_create_student(
    working_db_handler: DBHandler,
    working_password_handler: PasswordHandler,
):
    working_db_handler.create_student(STUDENT)
    res = working_db_handler.get_student(STUDENT.student_id)
    compare_students(working_password_handler, res, STUDENT)


def test_find_student_fail(working_db_handler: DBHandler):
    res = working_db_handler.find_student(email="test_email", password="test_password")
    assert res is None


def compare_courses(
    course_1: Course,
    course_2: Course,
):
    assert course_1 == course_2
    assert course_1 is not course_2


def test_create_course(working_db_handler: DBHandler):
    working_db_handler.create_course(COURSE)
    res = working_db_handler.get_course(COURSE.course_id)
    compare_courses(res, COURSE)
