// CourseTable.js
import React from 'react';
import { Spinner } from '@/components/Spinner/Spinner';
import styles from './CourseTable.module.scss';
import { Course } from '../../Interfaces';

interface CourseTableProps {
  isLoading: boolean;
  currentCourses: Course[];
}

const CourseTable: React.FC<CourseTableProps> = ({ isLoading, currentCourses }) => {
  const handleRowClick = (url: string) => {
    window.open(url, '_blank');
  };
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Course Name</th>
          <th>University</th>
          <th>Difficulty</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={8} style={{ textAlign: 'center' }}>
              <Spinner />
            </td>
          </tr>
        ) : (
          currentCourses.map((course) => (
            <tr key={course.course_id} onClick={() => handleRowClick(course.url)}>
              <td>{course.name}</td>
              <td>{course.university}</td>
              <td>{course.difficulty.replace(/^Difficulty\./, '')}</td>
            </tr>
          ))
        )}
      </tbody>
    </table>
  );
};

export default CourseTable;
