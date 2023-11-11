from random import randint
from uuid import UUID

from analytics.service import find_courses
from container import Container
from db_handler.db_handler import DBHandler
from dependency_injector.wiring import Provide, inject
from main_utils import Error, Ok
from models import Course, Feature, Student
from orchestrator.orchestrator_utils import safe


@safe
@inject
def add_student(
    student: Student,
    db_handler: DBHandler = Provide[Container.db_handler],
) -> Ok[UUID]:
    db_handler.create_student(student)
    return Ok({"id": student.student_id})


@safe
@inject
def add_feature(
    student_id: UUID,
    feature_name: str,
    db_handler: DBHandler = Provide[Container.db_handler],
):
    db_handler.add_feature_to_student(student_id, feature_name)
    return Ok({})


@safe
@inject
def remove_feature(
    student_id: UUID,
    feature_name: str,
    db_handler: DBHandler = Provide[Container.db_handler],
):
    db_handler.remove_feature_from_student(student_id, feature_name)
    return Ok({})


@safe
@inject
def update_student(
    student: Student,
    db_handler: DBHandler = Provide[Container.db_handler],
) -> Ok[UUID]:
    db_handler.update_student(student)
    return Ok(student.student_id)


@safe
@inject
def fetch_student(
    student_id: UUID,
    db_handler: DBHandler = Provide[Container.db_handler],
) -> Ok[Student]:
    student = db_handler.get_student(student_id)
    if not student:
        return Error(404, "student not found")

    return Ok(student)


@safe
@inject
def check_student(
    email: str,
    password: str,
    db_handler: DBHandler = Provide[Container.db_handler],
) -> Ok[str]:
    student_id = db_handler.find_student(email, password)
    if student_id is not None:
        return Ok({"id": student_id})

    return Error(404, "account with those details not found")


@safe
@inject
def add_course(
    course: Course,
    db_handler: DBHandler = Provide[Container.db_handler],
) -> Ok[UUID]:
    db_handler.create_course(course)
    return Ok({"id": course.course_id})


@safe
@inject
def delete_existing_course(
    course_id: UUID,
    db_handler: DBHandler = Provide[Container.db_handler],
) -> Ok[str]:
    result = db_handler.delete_course(course_id)
    if not result:
        return Error(404, "course not found")
    return Ok("Course deleted successfully")


@safe
@inject
@safe
@inject
def update_course(
    course_id: UUID,
    updated_course: Course,
    db_handler: DBHandler = Provide[Container.db_handler],
) -> Ok[Course]:
    db_handler.update_course(course_id, updated_course)
    return Ok(updated_course)


@safe
@inject
def get_course(
    course_id: UUID,
    db_handler: DBHandler = Provide[Container.db_handler],
) -> Ok[Course]:
    course = db_handler.get_course(course_id)
    return Ok(course)


@safe
@inject
def fetch_features(db_handler: DBHandler = Provide[Container.db_handler]):
    features: list[Feature] = db_handler.get_features()
    features.sort(key=lambda x: x.name)
    return Ok({"data": features})


@safe
@inject
def fetch_courses(db_handler: DBHandler = Provide[Container.db_handler]):
    courses: list[Course] = db_handler.get_courses()
    converted_courses = [course.model_dump() for course in courses]
    return Ok({"data": converted_courses})


@safe
@inject
def get_recommendations(
    student_id: UUID,
    db_handler: DBHandler = Provide[Container.db_handler],
):
    student = db_handler.get_student(student_id)
    features: list[Feature] = db_handler.get_features()
    courses: list[Course] = db_handler.get_courses()
    response = find_courses(student, courses, [f.name for f in features], randint(4, 8))
    return Ok(response)
