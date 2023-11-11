// useCourseForm.js
import { useState } from 'react';
import { Course, FormField } from '../Interfaces';

interface UseCourseFormProps extends Partial<Course> {}

export const useCourseForm = (initialData: UseCourseFormProps) => {
  const [name, setName] = useState(initialData.name || '');
  const [difficulty, setDifficulty] = useState(initialData.difficulty || '');
  const [university, setUniversity] = useState(initialData.university || '');
  const [url, setUrl] = useState(initialData.url || '');
  const [features, setFeatures] = useState(initialData.features || []);

  const courseData = {
    name,
    difficulty,
    university,
    url,
  };

  const formFields: FormField[] = [
    {
      label: 'Course Name',
      type: 'text',
      state: name,
      setState: setName,
      componentType: 'input',
    },
    {
      label: 'University  ',
      type: 'text',
      state: university,
      setState: setUniversity,
      componentType: 'input',
    },
    {
      label: 'Course Difficulty',
      type: 'text',
      state: difficulty,
      setState: setDifficulty,
      componentType: 'select',
      options: ['Difficulty.BEGINNER', 'Difficulty.INTERMEDIATE', 'Difficulty.ADVANCED'],
    },
    {
      label: 'Course URL',
      type: 'text',
      state: url,
      setState: setUrl,
      componentType: 'input',
    },
    {
      label: 'Course Features',
      state: features,
      setState: setFeatures,
      componentType: 'tags',
    },
  ];

  return {
    formFields,
    courseData,
  };
};
