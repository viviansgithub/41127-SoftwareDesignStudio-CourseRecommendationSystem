import json
from pathlib import Path
from pprint import pprint
from random import randint, shuffle
from collections import Counter
import math

from pydantic import BaseModel
import os 
import numpy as np
from sklearn.neighbors import NearestNeighbors

class Course(BaseModel):
    name: str
    features: list[str]
    score: float = 0


def parse_courses(courses: list[dict]) -> list[Course]:
    return [Course.model_validate(course) for course in courses]


def select_features(features: list[str]) -> list[str]:
    number_of_courses = randint(2, 5)
    shuffle(features)
    print("no. ", number_of_courses)
    return features[:number_of_courses]


def get_interests():
    # interests = set(input("Enter your interest: ").lower().split(","))
    interests = set(input("Enter your interest: ").split(","))
    print()
    return interests

def recommend_courses(interests, courses, k):
    X = []
    for course in courses:
        interest_vals = Counter(interest.lower() for interest in interests)
        course_vals = Counter(feature.lower() for feature in course.features)
        union = list(set(interest_vals.keys()) | set(course_vals.keys()))
        interests_vect = [interest_vals.get(word, 0) for word in union]
        course_vect = [course_vals.get(word, 0) for word in union]
        X.append(interests_vect)
    
    X = np.array(X)

    neigh = NearestNeighbors(n_neighbors=k, metri='cosine')
    neigh.fit(X)
    distances, indices = neigh.kneighbors([interests_vect])

    recommend_courses = [(courses[idx].name, distances[0][i]) for i, idx in enumerate(indices[0])]
    print("Recommended Courses:")
    for course_name, similarity_score in recommend_courses:
        print(f"{course_name}: {similarity_score}")

    return recommend_courses


def algorithm(features: list[str]):
    def calculate(course: Course):
        course_similarity_pairs = []

        for course_feature in course.features:
            interests_vals = Counter(feature for feature in features)
            print(interests_vals)
            course_vals = Counter(course_feature)
            union = (interests_vals.keys() | course_vals.keys())
            interests_vect = [interests_vals.get(word, 0) for word in union]
            course_vect = [course_vals.get(word, 0) for word in union]
            cosine_similarity = calculate_cosine(interests_vect, course_vect)
            course_similarity_pairs.append((course.name, cosine_similarity))
            print(cosine_similarity)

            return course_similarity_pairs
            
    return calculate

def calculate_cosine(vect1, vect2):
    dot_product = sum(x * y for x, y in zip(vect1, vect2))
    user_magnitude = math.sqrt(sum(x**2 for x in vect1))
    course_magnitude = math.sqrt(sum(x**2 for x in vect2))
    if user_magnitude == 0 or course_magnitude == 0:
            return 0  # avoid division by zero
    cosine_score = dot_product / (user_magnitude * course_magnitude)
    return cosine_score


def process_courses(courses: list[Course], features: list[str]):
    process = algorithm(features)
    return [process(course) for course in courses]


def merge_results(courses: list[Course], scores: list[float]):
    def modify(course: Course, score: float):
        course.score = score

    [modify(course, score) for course, score in zip(courses, scores)]
x
# def recommend_course(interests, courses, k):
#     course_similarity_pairs = []

#     for course in courses:
#         interests_vals = Counter(interest.lower() for interest in interests)
#         course_vals = Counter(feature.lower() for feature in course.features)
#         union = (interests_vals.keys() | course_vals.keys())
#         interests_vect = [interests_vals.get(word, 0) for word in union]
#         course_vect = [course_vals.get(word, 0) for word in union]
#         cosine_similarity = calculate_cosine(interests_vect, course_vect)
#         course_similarity_pairs.append((course.name, cosine_similarity))

#     sorted_courses = sorted(course_similarity_pairs, key=lambda x: x[1], reverse=True)

#     top_courses = sorted_courses[:k]

#     print("Top courses: ", top_courses)

#     return top_courses

def main():
    courses = parse_courses(json.load(Path("courses.json").open()))
    features = json.load(Path("features.json").open())
    test_features = select_features(features)
    # test_features = select_features(features)
    res = process_courses(courses, test_features)
    merge_results(courses, res)
    courses.sort(key=lambda x: x.score)
    print(test_features)
    pprint([course for course in courses if course.score > 0])

    ###
    interests = get_interests()
    k=5
    recommend_courses = recommend_courses(interests, courses, k)
    print("Recommended Courses:")
    for course_name, similarity_score in recommend_courses:
        print(f"{course_name}: {similarity_score}")

    # # Call the recommend_course function with user's interests and k
    # interests = get_interests()
    # k = 5  # Adjust the value of k as needed
    # recommended_courses = recommend_course(interests, courses, k)
    # print("Recommended Courses:")
    # for course_name, similarity_score in recommended_courses:
    #     print(f"{course_name}: {similarity_score}")


if __name__ == "__main__":
    main()
