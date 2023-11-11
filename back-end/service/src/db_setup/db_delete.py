from pathlib import Path


def delete():
    print("deleting existing database...")
    try:
        Path("CourseRecommendation.db").unlink()
    except Exception as e:
        print(e)


if __name__ == "__main__":
    delete()
