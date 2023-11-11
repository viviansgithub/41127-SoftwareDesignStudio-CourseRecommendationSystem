from uuid import UUID

from pydantic import BaseModel


class StudentBody(BaseModel):
    email: str
    password: str


class FeatureBody(BaseModel):
    feature_id: UUID
    name: str


class CourseBody(BaseModel):
    course_id: UUID
    name: str
    university: str
    difficulty: str
    url: str
    features: list[str] = []
