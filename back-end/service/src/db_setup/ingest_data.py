import json
from enum import Enum
from pathlib import Path
from uuid import UUID, uuid4

from db_connect import eng
from db_model import Course, CourseFeatures, Feature
from pydantic import BaseModel, Field
from sqlalchemy.orm import Session


class Difficulty(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class RawCourseData(BaseModel):
    name: str = Field(alias="Course Name")
    university: str = Field(alias="University")
    difficulty: str = Field(alias="Difficulty Level")
    url: str = Field(alias="Course URL")
    skills: str = Field(alias="Skills")


class CourseData(BaseModel):
    uuid: UUID = Field(default_factory=uuid4)
    name: str
    university: str
    difficulty: Difficulty
    url: str
    features: list[str]


def ingest_data():
    path = Path("service/src/db_setup/data.json")
    with path.open("r") as f:
        data = json.load(f)

    def generate_course_data(data: dict[str, str]):
        raw_data = RawCourseData.model_validate(data)
        skills = [s.strip() for s in raw_data.skills.split(",")]
        features = skills[:-1]
        last_skill = skills[-1].split(" ")
        last_feature = []
        found = False
        for word in last_skill:
            if "-" not in word and found is not True:
                last_feature.append(word)
                continue

            features.append(word.replace("-", " "))
            found == True

        features.append(" ".join(last_feature))
        features = list(set(features))

        return CourseData(
            name=raw_data.name,
            university=raw_data.university,
            difficulty=Difficulty(raw_data.difficulty),
            url=raw_data.url,
            features=features,
        )

    return [generate_course_data(course) for course in data]


def extract_features(courses: list[CourseData]) -> dict[str, UUID]:
    features = []
    for course in courses:
        features.extend(course.features)

    return {k: uuid4() for k in list(filter(lambda x: bool(x), list(set(features))))}


def populate_courses(courses: list[CourseData]):
    print(f"adding {len(courses)} courses to the database...")
    stmts = [
        Course(
            course_id=str(course.uuid),
            name=course.name,
            university=course.university,
            difficulty=str(course.difficulty),
            url=course.url,
        )
        for course in courses
    ]
    with Session(eng) as session:
        session.add_all(stmts)
        session.commit()


def populate_features(features: dict[str, UUID]):
    print(f"adding {len(features)} features to the database...")
    stmts = [
        Feature(
            feature_id=str(feature_id),
            name=name,
        )
        for name, feature_id in features.items()
    ]
    with Session(eng) as session:
        session.add_all(stmts)
        session.commit()


def populate_relation(courses: list[CourseData], features: dict[str, UUID]):
    stmts = []
    for course in courses:
        for feature in course.features:
            if feature in features:
                stmts.append(
                    CourseFeatures(
                        course_id=str(course.uuid),
                        feature_id=str(features[feature]),
                    )
                )

    with Session(eng) as session:
        session.add_all(stmts)
        session.commit()


def ingest():
    print("ingesting data...")
    courses = ingest_data()
    features = extract_features(courses)

    populate_courses(courses)
    populate_features(features)
    populate_relation(courses, features)

    return courses, features


if __name__ == "__main__":
    courses, features = ingest()
    with open("courses.json", "w") as f:
        f.write(json.dumps([c.model_dump() for c in courses]))

    with open("features.json", "w") as f:
        f.write(json.dumps(features))
