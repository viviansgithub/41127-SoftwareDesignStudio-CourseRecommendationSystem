import sqlite3

import sqlalchemy as db

sqlite_conn = sqlite3.connect("CourseRecommendation.db")
db_URI = "sqlite:///CourseRecommendation.db"

eng = db.create_engine(db_URI)
sqlalchemy_conn = eng.connect()
