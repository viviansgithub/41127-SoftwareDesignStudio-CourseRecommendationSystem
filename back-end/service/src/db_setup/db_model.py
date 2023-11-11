import sqlalchemy as db
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm.decl_api import DeclarativeMeta

Base: DeclarativeMeta = declarative_base()


class Student(Base):
    __tablename__ = "student"
    student_id = db.Column(db.VARCHAR(36), primary_key=True)
    email = db.Column(db.VARCHAR(255), nullable=False)
    password = db.Column(db.VARCHAR(64), nullable=False)


class Course(Base):
    __tablename__ = "course"
    course_id = db.Column(db.VARCHAR(225), primary_key=True)
    name = db.Column(db.VARCHAR(255), nullable=False)
    university = db.Column(db.VARCHAR(255), nullable=True)
    difficulty = db.Column(db.VARCHAR(255), nullable=False)
    url = db.Column(db.VARCHAR(255), nullable=False)


class Feature(Base):
    __tablename__ = "features"
    feature_id = db.Column(db.VARCHAR(255), primary_key=True)
    name = db.Column(db.VARCHAR(255), nullable=False)


class CourseFeatures(Base):
    __tablename__ = "course_features"
    course_features_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    course_id = db.Column(db.ForeignKey(Course.course_id))
    feature_id = db.Column(db.ForeignKey(Feature.feature_id))


class StudentFeatures(Base):
    __tablename__ = "student_features"
    student_features_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    student_id = db.Column(db.ForeignKey(Student.student_id), nullable=False)
    feature_id = db.Column(db.ForeignKey(Feature.feature_id), nullable=False)
