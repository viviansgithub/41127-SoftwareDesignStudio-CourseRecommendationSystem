'use client';
import React from 'react';
import { AdminModal } from '@/components/AdminComponents/AdminModal/AdminModal';
import { Course } from '../../Interfaces'; // Adjust path as needed
import { useCourseForm } from '../useCourseForm';
import { deleteCourse, updateCourse } from '@/middleware/api';

interface CourseEditModalProps {
  initialCourseData: Course;
  onClose: () => void;
  onUpdateCourse: () => void;
  onDelete?: (id?: any) => Promise<void>;
}

export const CourseEditModal: React.FC<CourseEditModalProps> = ({ initialCourseData, onClose, onUpdateCourse }) => {
  const { formFields, courseData } = useCourseForm(initialCourseData);

  const handleSubmit = async () => {
    try {
      const updatedCourse: Course = {
        course_id: initialCourseData.course_id,
        name: courseData.name,
        university: courseData.university,
        difficulty: courseData.difficulty,
        url: courseData.url,
        features: [],
      };
      await updateCourse(initialCourseData.course_id, updatedCourse);
      onClose();
      alert('Course successfully updated!');
      onUpdateCourse();
    } catch (error: unknown) {
      // Specify type here
      if (error instanceof Error) {
        alert(`An error occurred: ${error.message}`);
      } else {
        alert(`An unexpected error occurred: ${String(error)}`);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCourse(initialCourseData.course_id);
      onClose();
      alert('Course successfully deleted!');
      onUpdateCourse();
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(`An error occurred: ${error.message}`);
      } else {
        alert(`An unexpected error occurred: ${String(error)}`);
      }
    }
  };

  return (
    <AdminModal
      formFields={formFields}
      onSubmit={handleSubmit}
      title="Edit Course"
      onClose={onClose}
      onDelete={() => handleDelete()}
      course_id={initialCourseData.course_id}
      initialFormData={{
        'Course Name': courseData.name,
        University: courseData.university,
        'Course Difficulty': courseData.difficulty,
        'Course URL': courseData.url,
      }}
    />
  );
};
