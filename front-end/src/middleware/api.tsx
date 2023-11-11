const baseUrl = 'http://localhost:5000';
import { Course } from '@/components/AdminComponents/Interfaces';
import { UUID } from 'crypto';

//Student

export const addStudent = async (email: string, password: string) => {
  return await fetch(`${baseUrl}/student/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
};

export const updateStudent = async (id: string, email: string, password: string, features: Array<string>) => {
  return await fetch(`${baseUrl}/student/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password, features }),
  });
};

export const getStudent = async (id: string) => {
  return await fetch(`${baseUrl}/student/${id}`).then((response) => response.json());
};

//Auth

export const login = async (email: string, password: string) => {
  return await fetch(`${baseUrl}/log-in?email=${email}&password=${password}`)
    .catch((error) => alert('No user with those details found.'))
    .then((response) => {
      if (response?.status === 200) {
        return response.json();
      }
      return null;
    });
};

export const signUp = async (email: string, password: string) => {
  return await fetch(`${baseUrl}/student/add`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })
    .catch((error) => alert('An unexpected error occurred.'))
    .then((response) => {
      if (response?.status === 200) {
        return response.json();
      }
      return null;
    });
};

//Course

export const deleteCourse = async (course_id: any) => {
  try {
    const response = await fetch(`${baseUrl}/course/${course_id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || `Failed to delete course with code: ${course_id}`;
      throw new Error(errorMessage);
    }

    return responseData;
  } catch (error) {
    console.error('Failed to delete course:', error);
    throw error;
  }
};

export const addCourse = async (courseData: Course) => {
  try {
    const response = await fetch(`${baseUrl}/course/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        course_name: courseData.name,
        university: courseData.university,
        difficulty: courseData.difficulty,
        url: courseData.url,
        features: courseData.features,
      }),
    });

    if (response.status !== 200) {
      const data = await response.json();
      throw new Error(data.message);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const updateCourse = async (course_id: string, updatedData: Course) => {
  try {
    const response = await fetch(`${baseUrl}/course/${course_id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        course_id: updatedData.course_id,
        name: updatedData.name,
        university: updatedData.university,
        difficulty: updatedData.difficulty,
        url: updatedData.url,
        features: updatedData.features,
      }),
    });

    if (response.status === 200) {
      return response.json();
    } else {
      const data = await response.json();
      throw new Error(data.message);
    }
  } catch (error) {
    throw error;
  }
};

//Courses

export const getCourses = async (): Promise<any> => {
  try {
    const response = await fetch(`${baseUrl}/course/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      const data = await response.json();
      throw new Error(data.message || 'Error fetching courses');
    }

    const courses: Course[] = await response.json();
    return courses;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred while fetching courses.');
  }
};

export const getRecommendedCourses = async (id: string): Promise<any> => {
  try {
    const response = await fetch(`${baseUrl}/student/${id}/recommend`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      const data = await response.json();
      throw new Error(data.message || 'Error fetching recommended courses');
    }

    const data: { course: Course; score: number }[] = await response.json();
    const courses = data.map((value) => value.course);
    return courses;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred while fetching recommended courses.');
  }
};

//Enrollment

export const enrollCourse = async (courseCode: string, id: string) => {
  try {
    const response = await fetch(`${baseUrl}/course/enroll/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        course_code: courseCode,
      }),
    });

    if (response.status !== 200) {
      const data = await response.json();
      throw new Error(data.message);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

export const unenrollCourse = async (courseCode: string, id: string) => {
  try {
    const response = await fetch(`${baseUrl}/course/unenroll/${id}/${courseCode}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      const data = await response.json();
      throw new Error(data.message);
    }
    return response;
  } catch (error) {
    throw error;
  }
};

//Features
export const getInterests = async (): Promise<{ feature_id: UUID; name: string }[]> => {
  try {
    const response = await fetch(`${baseUrl}/feature`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      const data = await response.json();
      throw new Error(data.message || 'Error fetching interests');
    }

    const interests: { data: { feature_id: UUID; name: string }[] } = await response.json();
    return interests.data;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred while fetching interests.');
  }
};

//Student Features

export const addInterest = async (studentId: UUID, featureName: string) => {
  try {
    const response = await fetch(`${baseUrl}/student/${studentId}/add/${featureName}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      const data = await response.json();
      throw new Error(data.message || 'Error updating interests');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred while updating interests.');
  }
};

export const removeInterest = async (studentId: UUID, featureName: string) => {
  try {
    const response = await fetch(`${baseUrl}/student/${studentId}/remove/${featureName}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status !== 200) {
      const data = await response.json();
      throw new Error(data.message || 'Error updating interests');
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error('An unknown error occurred while updating interests.');
  }
};
