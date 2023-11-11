import json
from pathlib import Path

import numpy as np
from models import Course, Student
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.neighbors import KNeighborsClassifier


def binary(feature_list: list[str], all_features: list[str]) -> list[int]:
    binaryList = []
    for feature in all_features:
        if feature in feature_list:
            binaryList.append(1)
        else:
            binaryList.append(0)
    return binaryList


def parse_courses(courses: list[dict]) -> list[Course]:
    return [Course.model_validate(course) for course in courses]


def load_courses_from_json(file_path):
    course_file = json.load(Path("courses.json").open())
    courses = parse_courses(course_file)
    return courses


def create_feature_matrix(courses: list[Course], all_features: list[str]):
    feature_matrix = []
    for course in courses:
        feature_matrix.append(binary([f.name for f in course.features], all_features))
    return np.array(feature_matrix)


def recommend_courses(
    selected_features: list[str],
    all_features: list[str],
    courses: list[Course],
    feature_matrix,
    y,
    num_recommendations: int,
):
    recommended_list = []
    selected_features_bin = binary(selected_features, all_features)
    selected_features_bin = np.array(selected_features_bin).reshape(1, -1)

    knn = KNeighborsClassifier(n_neighbors=len(courses))
    knn.fit(feature_matrix, y)

    nearest_neighbors = knn.kneighbors(
        selected_features_bin, n_neighbors=len(courses), return_distance=False
    )

    for neighbor in nearest_neighbors[0]:
        similarity_score = cosine_similarity(
            selected_features_bin, feature_matrix[neighbor].reshape(1, -1)
        )
        recommended_list.append(
            {
                "course": courses[neighbor],
                "score": similarity_score[0][0],
            }
        )

    recommended_list = sorted(recommended_list, key=lambda x: x["score"], reverse=True)

    return recommended_list[:num_recommendations]


def create_unique_features(courses: list[Course]):
    all_features = []
    for course in courses:
        for feature in course["features"]:
            if feature["name"] not in all_features:
                all_features.append(feature["name"])
    return all_features


def find_courses(
    student: Student,
    courses: list[Course],
    all_features: list[str],
    count: int,
):
    feature_matrix = create_feature_matrix(courses, all_features)
    y = np.array(range(len(courses)))

    recommended_list = recommend_courses(
        [s.name for s in student.features],
        all_features,
        courses,
        feature_matrix,
        y,
        count,
    )
    return recommended_list[:count]
