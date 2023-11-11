'use client';
import React, { FC, useEffect, useState } from 'react';
import styles from './Profile.module.scss';
import { UserHeader } from '../UserHeader/UserHeader';
import Interests from './Interests/Interests';
import Info from './Info/Info';
import { getStudent } from '@/middleware/api';
import { UUID } from 'crypto';
import ConfettiExplosion from 'react-confetti-explosion';
import { Spinner } from '@/components/Spinner/Spinner';

interface Props {
  user_id: string;
}

interface StudentType {
  studentId: string;
  email: string;
  interests: string[];
}

export const Profile: FC<Props> = ({ user_id }) => {
  const [student, setStudent] = useState<StudentType | null>(null);
  const [isExploding, setIsExploding] = React.useState(false);

  const updatedInterests = (newInterests: string[]) => {
    if (student) {
      setStudent({ ...student, interests: newInterests });
    }
  };

  useEffect(() => {
    const fetchStudentData = async () => {
      try {
        setIsExploding(true);

        const data = await getStudent(user_id);
        const studentData: StudentType = {
          studentId: data.student_id,
          email: data.email,
          interests: data.features.map((feature: { feature_id: UUID; name: string }) => feature.name),
        };
        setStudent(studentData);
      } catch (error) {
        console.error('Failed to fetch student data:', error);
      }
    };

    fetchStudentData();
  }, [user_id]);

  if (!student) return <Spinner />;

  return (
    <>
      <UserHeader
        title="Profile"
        buttons={[
          { href: `/courses/${user_id}`, label: 'Courses' },
          { href: '/', label: 'Log Out' },
        ]}
      />
      <div className="component-wrapper">{isExploding && <ConfettiExplosion style={{ marginLeft: '50%' }} />}</div>

      <div className={styles.profileContainer}>
        {/* <div className={styles.topRow}> */}
        <section className={styles.profileInfo}>
          <Info student={student} />
        </section>

        <section className={styles.profileInterests}>
          <Interests user_id={user_id} interests={student.interests} setInterests={updatedInterests} />
        </section>
      </div>
      {/* </div> */}
    </>
  );
};
