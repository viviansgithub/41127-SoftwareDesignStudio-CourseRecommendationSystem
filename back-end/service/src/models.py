from uuid import UUID

from pydantic import BaseModel


class Feature(BaseModel):
    feature_id: UUID
    name: str


class ResponseStudent(BaseModel):
    student_id: UUID
    email: str
    features: list[Feature] = []


class Student(ResponseStudent):
    password: str


class Course(BaseModel):
    course_id: UUID
    name: str
    university: str
    difficulty: str
    url: str
    features: list[Feature] = []
