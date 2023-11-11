import React, { FC } from 'react';
import styles from './CourseRow.module.scss';
import { Course } from '../../Interfaces';

interface CourseRowProps {
  course: Course;
  onView: () => void;
}

export const CourseRow: FC<CourseRowProps> = ({ course, onView }) => {
  return (
    <>
      <tr className={styles.courseTableRow} onClick={onView}>
        <td>{course.name}</td>
        <td>{course.university}</td>
        <td>{course.difficulty}</td>
      </tr>
    </>
  );
};
