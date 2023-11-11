from copy import deepcopy
from typing import Callable, ParamSpec, TypeVar
from uuid import UUID

import sqlalchemy as db
from db_handler.password import PasswordHandler
from db_setup.db_model import Course as DBCourse
from db_setup.db_model import CourseFeatures as DBCourseFeatures
from db_setup.db_model import Feature as DBFeature
from db_setup.db_model import Student as DBStudent
from db_setup.db_model import StudentFeatures as DBStudentFeatures
from models import Course, Feature, Student
from sqlalchemy import delete, select, update
from sqlalchemy.orm import Session

P = ParamSpec("P")
T = TypeVar("T")

DB_URI = "sqlite:///CourseRecommendation.db"


def use_session(method: Callable[P, T]) -> Callable[P, T]:
    def decorator(self, *args, **kwargs) -> T:
        with Session(self.db) as session:
            return method(self, session, *args, **kwargs)

    return decorator


class DBHandler:
    def __init__(self, password_handler: PasswordHandler) -> None:
        self.db = db.create_engine(DB_URI)
        self.password_handler = password_handler

    def student_exists(self, session: Session, student_id: UUID) -> bool:
        stmt = select(DBStudent.email, DBStudent.password).where(
            DBStudent.student_id == str(student_id)
        )
        return session.execute(stmt).one_or_none() is not None

    @use_session
    def get_student(self, session: Session, student_id: UUID) -> Student:
        stmt = select(DBStudent.email, DBStudent.password).where(
            DBStudent.student_id == str(student_id)
        )
        student = session.execute(stmt).one_or_none()
        if student == None:
            return

        stmt = (
            select(DBStudentFeatures.feature_id, DBFeature.name)
            .where(DBStudentFeatures.student_id == str(student_id))
            .join(DBFeature, DBStudentFeatures.feature_id == DBFeature.feature_id)
        )
        features = session.execute(stmt).all()

        return Student(
            student_id=student_id,
            email=student[0],
            password=student[1],
            features=[Feature(feature_id=f[0], name=f[1]) for f in features],
        )

    @use_session
    def create_student(self, session: Session, student: Student):
        new_student = deepcopy(student)
        password = self.password_handler.hash_password(new_student.password)
        stmt = select(DBStudent).where(DBStudent.student_id == student.student_id)
        res = session.execute(stmt).one_or_none()

        if res:
            return

        session.add(
            DBStudent(
                student_id=str(student.student_id),
                email=student.email,
                password=password,
            )
        )
        session.commit()
        return student.student_id

    @use_session
    def update_student(self, session: Session, student: Student):
        student_exists = self.student_exists(session, student)
        if student_exists == None:
            return

        password = self.password_handler.hash_password(student.password)
        stmt = (
            update(DBStudent)
            .where(DBStudent.student_id == str(student.student_id))
            .values(
                email=student.email,
                password=password,
            )
        )
        session.execute(stmt)
        session.commit()
        return student.student_id

    def feature_relation_exists(
        self,
        session: Session,
        student_id: UUID,
        feature_id: UUID,
    ) -> bool:
        stmt = select(DBStudentFeatures).where(
            DBStudentFeatures.student_id == str(student_id),
            DBStudentFeatures.feature_id == str(feature_id),
        )
        return session.execute(stmt).one_or_none() is not None

    def get_feature_id_from_name(self, session: Session, name: str) -> str:
        stmt = select(DBFeature.feature_id).where(DBFeature.name == name)
        feature_id = session.execute(stmt).one_or_none()
        if feature_id == None:
            return

        return feature_id[0]

    @use_session
    def add_feature_to_student(
        self,
        session: Session,
        student_id: UUID,
        feature_name: str,
    ):
        feature_id = self.get_feature_id_from_name(session, feature_name)
        relation_exists = self.feature_relation_exists(
            session, student_id, feature_name
        )
        if relation_exists:
            return

        session.add(
            DBStudentFeatures(
                student_id=str(student_id),
                feature_id=feature_id,
            )
        )
        session.commit()

    @use_session
    def remove_feature_from_student(
        self,
        session: Session,
        student_id: UUID,
        feature_name: str,
    ):
        feature_id = self.get_feature_id_from_name(session, feature_name)
        if not feature_id:
            return

        relation_exists = self.feature_relation_exists(session, student_id, feature_id)
        if not relation_exists:
            return

        stmt = delete(DBStudentFeatures).where(
            DBStudentFeatures.student_id == str(student_id),
            DBStudentFeatures.feature_id == str(feature_id),
        )
        session.execute(stmt)
        session.commit()

    @use_session
    def find_student(self, session: Session, email: str, password: str):
        hashed_password = self.password_handler.hash_password(password)
        stmt = select(DBStudent.student_id).where(
            DBStudent.email == email,
            DBStudent.password == hashed_password,
        )
        student_id = session.execute(stmt).one_or_none()
        if student_id is None:
            return

        return student_id[0]

    def course_exists(self, session: Session, course_id: UUID):
        stmt = select(DBCourse).where(DBCourse.course_id == str(course_id))
        return session.execute(stmt).one_or_none() is not None

    @use_session
    def get_course(self, session: Session, course_id: UUID) -> Course:
        stmt = select(DBCourse.course_id, DBCourse.name).where(
            DBCourse.course_id == str(course_id)
        )
        course = session.execute(stmt).one_or_none()
        if stmt is None:
            return

        return Course(
            course_id=course[0],
            name=course[1],
        )

    @use_session
    def create_course(self, session: Session, course: Course):
        course_exists = self.course_exists(session, str(course.course_id))
        if course_exists:
            return

        session.add(
            DBCourse(
                course_id=str(course.course_id),
                name=course.name,
                university=course.university,
                difficulty=course.difficulty,
                url=course.url,
            )
        )
        session.commit()
        return course.course_id

    @use_session
    def update_course(self, session: Session, course_id: str, course: Course):
        course_exists = self.course_exists(session, str(course.course_id))
        if not course_exists:
            return

        stmt = (
            update(DBCourse)
            .where(DBCourse.course_id == str(course_id))
            .values(
                name=course.name,
                university=course.university,
                difficulty=course.difficulty,
                url=course.url,
            )
        )
        session.execute(stmt)
        session.commit()

    @use_session
    def delete_course(self, session: Session, course_id: UUID):
        course_exists = self.course_exists(session, course_id)
        if not course_exists:
            return False
        stmt = delete(DBCourse).where(DBCourse.course_id == str(course_id))
        session.execute(stmt)
        session.commit()
        return True

    @use_session
    def get_features(self, session: Session):
        stmt = select(DBFeature.feature_id, DBFeature.name)
        features = session.execute(stmt).all()
        return [Feature(feature_id=feature[0], name=feature[1]) for feature in features]

    @use_session
    def get_courses(self, session: Session):
        stmt = (
            select(
                DBCourse.course_id,
                DBCourse.difficulty,
                DBCourse.name,
                DBCourse.university,
                DBCourse.url,
                DBFeature.feature_id,
                DBFeature.name,
            )
            .join(DBCourseFeatures, DBCourseFeatures.course_id == DBCourse.course_id)
            .join(DBFeature, DBFeature.feature_id == DBCourseFeatures.feature_id)
        )
        results = session.execute(stmt).all()

        compiled: dict[str, Course] = {}
        for (
            course_id,
            difficulty,
            course,
            university,
            url,
            feature_id,
            feature,
        ) in results:
            if course_id in compiled:
                compiled[course_id].features.append(
                    Feature(
                        feature_id=feature_id,
                        name=feature,
                    )
                )

            else:
                compiled[course_id] = Course(
                    course_id=course_id,
                    name=course,
                    university=university,
                    difficulty=difficulty,
                    url=url,
                )

        return list(compiled.values())
