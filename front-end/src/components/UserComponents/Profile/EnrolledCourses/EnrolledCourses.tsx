import React from 'react';
import styles from './EnrolledCourses.module.scss';
import { Course } from '../../Interfaces';
import { CourseRow } from '@/components/AdminComponents/EditCoursePage/CourseRow/CourseRow';

interface EnrolledCoursesProps {
  enrolledCourses: Course[];
}

const EnrolledCourses: React.FC<EnrolledCoursesProps> = ({ enrolledCourses }) => {
  return (
    <div>
      <h2>Enrolled Courses</h2>
      {enrolledCourses.length === 0 ? (
        <div className={styles.noCourses}>Currently No Enrolled Courses</div>
      ) : (
        <table className={styles.courseTable}>
          <thead>
            <tr>
              <th>Course Name</th>
              <th>Course Code</th>
              <th>Department</th>
              <th>Instructor</th>
              <th>Credits</th>
              <th>Term</th>
              <th>Capacity</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {enrolledCourses.map((course) => (
              <CourseRow
                key={course.courseCode}
                course={course}
                onView={() => console.log(`Viewing course: ${course.courseName}`)}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default EnrolledCourses;
