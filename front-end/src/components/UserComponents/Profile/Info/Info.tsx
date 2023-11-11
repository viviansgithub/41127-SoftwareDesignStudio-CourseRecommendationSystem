import React from 'react';
import styles from './Info.module.scss';

interface StudentInfoProps {
  student: {
    email: string;
  };
}

const Info: React.FC<StudentInfoProps> = ({ student }) => {
  return (
    <div>
      <h2>Personal Information</h2>
      <p className={styles.profileParagraph}>Email: {student.email}</p>
    </div>
  );
};

export default Info;
