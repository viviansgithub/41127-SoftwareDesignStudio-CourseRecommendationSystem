from uuid import UUID, uuid4

from fastapi import APIRouter
from models import Course, ResponseStudent, Student
from orchestrator.orchestrator import (
    add_course,
    add_feature,
    add_student,
    check_student,
    fetch_courses,
    fetch_features,
    fetch_student,
    get_course,
    get_recommendations,
    remove_feature,
    update_course,
    update_student,
    delete_existing_course,
)
from router.requests import CourseBody, StudentBody
from router.router_utils import parse

router = APIRouter()


@router.post("/student/add", name="add-new-student")
@parse
def student(student: StudentBody):
    internal_student = Student(
        student_id=uuid4(),
        email=student.email,
        password=student.password,
    )
    return add_student(student=internal_student)


@router.patch("/student/{student_id}", name="update-existing-student")
@parse
def student(student_id: UUID, student: StudentBody):
    internal_student = Student(
        student_id=student_id,
        email=student.email,
        password=student.password,
    )
    return update_student(student=internal_student)


@router.get(
    "/student/{student_id}",
    name="fetch student data",
    response_model=ResponseStudent,
)
@parse
def student(student_id: UUID):
    return fetch_student(student_id)


@router.patch("/student/{student_id}/add/{feature_name}", name="update student data")
@parse
def student(student_id: UUID, feature_name: str):
    return add_feature(student_id, feature_name)


@router.patch("/student/{student_id}/remove/{feature_name}")
@parse
def student(student_id: UUID, feature_name: str):
    return remove_feature(student_id, feature_name)


@router.get("/log-in", name="log-in")
@parse
def log_in(email: str, password: str):
    return check_student(email, password)


@router.post("/course", name="add-new-course")
@parse
def add_new_course(course: CourseBody):
    internal_course = Course(
        course_id=uuid4(),
        name=course.name,
        university=course.university,
        difficulty=course.difficulty,
        url=course.url,
    )
    return add_course(course=internal_course)

@router.delete("/course/{course_id}", name="delete-existing-course")
@parse
def delete_course(course_id: UUID):
    return delete_existing_course(course_id=course_id)

@router.get("/course/{course_id}", name="get-course")
@parse
def get_existing_course(course_id: UUID):
    return get_course(course_id=course_id)


@router.patch("/course/{course_id}", name="update-existing-course")
@parse
def update_existing_course(course_id: str, course: CourseBody):
    internal_course = Course(**course.model_dump())
    return update_course(course_id=course_id, updated_course=internal_course)


@router.get("/feature", name="Fetch a list of features from the database")
@parse
def get_features_list():
    return fetch_features()


@router.get("/course", name="get-all-courses")
@parse
def get_all_courses():
    return fetch_courses()


@router.get("/student/{student_id}/recommend")
@parse
def get_course_recommendations(student_id: UUID):
    return get_recommendations(student_id)
