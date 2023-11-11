'use client';
import { AdminHeader } from '../AdminHeader/AdminHeader';
import { Button } from '@/components/Button/Button';
import styles from './AdminPage.module.scss';
import Image from 'next/image';
import studentIcon from '../../../assets/images/student_icon.png';
import bookIcon from '../../../assets/images/book_icon.png';

export const AdminPage = () => {
  return (
    <div>
      <AdminHeader title="Admin Page" buttons={[{ href: '/', label: 'Log Out' }]} />
      <div className={styles.container}>
        <h1 className={styles.header}> Welcome to the Admin Page!</h1>
        <div className={styles.buttonsContainer}>
          <Button className={styles.button} href="/edit-courses">
            <p className={styles.label}>Edit Courses</p>
            <Image src={bookIcon} alt="book icon"></Image>
          </Button>
          {/* <Button className={styles.button} href="/edit-students">
            <p className={styles.label}>Edit Students</p>
            <Image src={studentIcon} alt="student icon"></Image>
          </Button> */}
        </div>
      </div>
    </div>
  );
};
