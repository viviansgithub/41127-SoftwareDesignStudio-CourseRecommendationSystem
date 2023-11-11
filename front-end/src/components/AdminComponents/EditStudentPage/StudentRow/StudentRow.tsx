'use client';
import React from 'react';
import styles from './StudentRow.module.scss';
import { Student } from '../../Interfaces';

interface StudentRowProps {
  student: Student;
  onView: () => void;
}

export const StudentRow: React.FC<StudentRowProps> = ({ student, onView }) => {
  return (
    <>
      <tr className={styles.studentTableRow} onClick={onView}>
        <td>{student.studentName}</td>
        <td>{student.studentNumber}</td>
        <td>{student.major}</td>
        <td>{student.year}</td>
        <td>{student.gpa}</td>
      </tr>
    </>
  );
};
