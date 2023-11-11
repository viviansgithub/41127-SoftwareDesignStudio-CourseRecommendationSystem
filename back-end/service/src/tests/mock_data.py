from uuid import uuid4

from models import Course, Student

GUID = uuid4()
EMAIL = "mock_email"
PASSWORD = "mock_password"
STUDENT = Student(
    student_id=GUID,
    email=EMAIL,
    password=PASSWORD,
    features=[],
)


COURSE_NAME = "mock_name"
UNIVERSITY = "mock_university"
DIFFICULTY = "mock_difficulty"
URL = "mock_url"
COURSE = Course(
    course_id=GUID,
    name=COURSE_NAME,
    university=UNIVERSITY,
    difficulty=DIFFICULTY,
    url=URL,
    features=[],
)
