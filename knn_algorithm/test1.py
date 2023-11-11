import math
from sklearn.feature_extraction.text import TfidfVectorizer
import re
from collections import Counter
from pydantic import BaseModel
import numpy as np


class UniversityCourse(BaseModel):
        name: str
        features: list[str]


# Get user interests input
def get_interests():
    interests = set(input("Enter your interest: ").lower().split(" "))
    return interests

# Calculate cosine similarity
def calculate_cosine(vect1, vect2):
    dot_product = sum(x * y for x, y in zip(vect1, vect2))
    user_magnitude = math.sqrt(sum(x**2 for x in vect1))
    course_magnitude = math.sqrt(sum(x**2 for x in vect2))
    if user_magnitude == 0 or course_magnitude == 0:
            return 0  # avoid division by zero
    cosine_score = dot_product / (user_magnitude * course_magnitude)
    return cosine_score

# Calculate cosine similarities for all courses
def recommend_course(interests, courses, k):
    course_similarity_pairs = []

    for course in courses:
        interests_vals = Counter(interest.lower() for interest in interests)
        course_vals = Counter(feature.lower() for feature in course.features)
        union = (interests_vals.keys() | course_vals.keys())
        interests_vect = [interests_vals.get(word, 0) for word in union]
        course_vect = [course_vals.get(word, 0) for word in union]
        cosine_similarity = calculate_cosine(interests_vect, course_vect)
        course_similarity_pairs.append((course.name, cosine_similarity))

    sorted_courses = sorted(course_similarity_pairs, key=lambda x: x[1], reverse=True)

    top_courses = sorted_courses[:k]

    print("Top courses: ", top_courses)

    return top_courses


# # Sort descending order and print courses
# def print_sorted_courses(cosine_similarities):
#     sorted_courses = sorted(cosine_similarities.items(), key=lambda x: x[1], reverse=True)
#     print("\nCosine Similarity Scores:")
#     for course, similarity in sorted_courses:
#         print(f"Course: {course}, Similarity: {similarity:.4f}")
    
if __name__ == "__main__":
     courses = [
    UniversityCourse(name="Course A", features=["Math", "Physics", "Programming", "Statistics", "Algebra"]),
    UniversityCourse(name="Course B", features=["Physics", "Chemistry", "Biology", "Statistics", "Calculus"]),
    UniversityCourse(name="Course C", features=["Programming", "Statistics", "Data Analysis", "Machine Learning", "Python"]),
    UniversityCourse(name="Course D", features=["History", "Literature", "Philosophy", "Art", "Music"]),
    UniversityCourse(name="Course E", features=["Math", "Physics", "Programming", "Statistics", "Calculus"])
]

user_interest = get_interests()

recommend_courses = recommend_course(user_interest, courses, 3)

print("Recommended Courses: ")
for course_name, cosine_similarity in recommend_courses:
     print(f"Course: {course_name}, Similarity: {cosine_similarity:.4f}")