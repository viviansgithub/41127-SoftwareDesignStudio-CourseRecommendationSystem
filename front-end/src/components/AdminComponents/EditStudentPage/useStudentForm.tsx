// useCourseForm.js
import { useState } from 'react';
import { FormField, Student } from '../Interfaces';

interface UseStudentForm extends Partial<Student> {}

export const useStudentForm = (initialData: UseStudentForm) => {
  const [studentName, setStudentName] = useState(initialData.studentName || '');
  const [studentNumber, setStudentNumber] = useState(initialData.studentNumber || '');
  const [major, setMajor] = useState(initialData.major || '');
  const [year, setYear] = useState(initialData.year || '');
  const [gpa, setGpa] = useState(initialData.gpa || '');

  const studentData = {
    studentName,
    studentNumber,
    major,
    year,
    gpa,
  };

  const formFields: FormField[] = [
    {
      label: 'Student Name',
      type: 'text',
      state: studentName,
      setState: setStudentName,
      componentType: 'input',
    },
    {
      label: 'Student Number',
      type: 'text',
      state: studentNumber,
      setState: setStudentNumber,
      componentType: 'input',
    },
    {
      label: 'Major',
      type: 'text',
      state: major,
      setState: setMajor,
      componentType: 'select',
      options: ['Software', 'Mechanical', 'Electrical', 'Aerospace', 'Civil', 'Computer'],
    },
    {
      label: 'Year',
      type: 'text',
      state: year,
      setState: setYear,
      componentType: 'select',
      options: ['1st', '2nd', '3rd', '4th', '5th', 'Graduate'],
    },
    {
      label: 'GPA',
      type: 'number',
      state: gpa,
      setState: setGpa,
      componentType: 'input',
    },
  ];

  return {
    formFields,
    studentData,
  };
};
