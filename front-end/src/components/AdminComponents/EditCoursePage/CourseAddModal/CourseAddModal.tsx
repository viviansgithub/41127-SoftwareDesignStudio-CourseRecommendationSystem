'use client';
import React from 'react';
import { AdminModal } from '@/components/AdminComponents/AdminModal/AdminModal';
import { Course } from '../../Interfaces';
import { useCourseForm } from '../useCourseForm';
import { addCourse } from '@/middleware/api';

interface CourseAddModalProps {
  onClose: () => void;
  onUpdateCourse: () => void;
}

export const CourseAddModal: React.FC<CourseAddModalProps> = ({ onClose, onUpdateCourse }) => {
  const { formFields, courseData } = useCourseForm({});

  const handleSubmit = async () => {};

  return <AdminModal formFields={formFields} onSubmit={handleSubmit} title="Add New Course" onClose={onClose} />;
};
