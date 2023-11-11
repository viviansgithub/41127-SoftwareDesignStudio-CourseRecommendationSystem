'use client';

import React, { useState, useEffect } from 'react';

import { Button } from '@/components/Button/Button';
import { AdminHeader } from '../AdminHeader/AdminHeader';
import { CourseRow } from './CourseRow/CourseRow';
import { CourseAddModal } from './CourseAddModal/CourseAddModal';
import { CourseEditModal } from './CourseEditModal/CourseEditModal';
import { Spinner } from '@/components/Spinner/Spinner';

import { Course } from '../Interfaces';

import styles from './EditCoursePage.module.scss';

import { deleteCourse, getCourses } from '@/middleware/api';
import { Pagination } from '@/components/Pagination/Pagination';
import { UUID } from 'crypto';
import { AdminSearchBar } from './AdminSearchBar/AdminSearchBar';

export const EditCoursePage = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  const [searchTerm, setSearchTerm] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchCourseData();
  }, []);

  const fetchCourseData = async () => {
    try {
      setIsLoading(true);
      const response = await getCourses();
      const data = response.data;

      const courseData: Course[] = data.map((courseItem: any) => ({
        course_id: courseItem.course_id,
        name: courseItem.name,
        university: courseItem.university,
        difficulty: courseItem.difficulty,
        url: courseItem.url,
        features: courseItem.features.map((feature: any) => feature.name),
      }));

      setCourses(courseData);
    } catch (error) {
      console.error('Failed to fetch course data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const openEditModal = (course: Course) => {
    setSelectedCourse(course);
    setEditModalVisible(true);
  };

  const handleUpdateCourse = () => {
    fetchCourseData();
  };

  const filteredCourses = courses.filter((course) =>
    Object.values(course).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const currentCourses = filteredCourses.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);
  const totalPages = Math.ceil(filteredCourses.length / rowsPerPage);

  return (
    <div className={styles.root}>
      <AdminHeader
        title="Edit Courses"
        buttons={[
          { href: '/admin', label: 'Admin Dashboard' },
          { href: '/', label: 'Log Out' },
        ]}
      />
      <div className={styles.editCourseContainer}>
        <AdminSearchBar searchTerm={searchTerm} isLoading={isLoading} setSearchTerm={setSearchTerm} />

        <table className={styles.courseTable}>
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
                <td colSpan={3} style={{ textAlign: 'center' }}>
                  {' '}
                  {/* Updated colSpan to 3 since there are 3 columns */}
                  <Spinner />
                </td>
              </tr>
            ) : (
              currentCourses.map((course) => (
                <CourseRow key={course.course_id} course={course} onView={() => openEditModal(course)} />
              ))
            )}
          </tbody>
        </table>

        <Button className={styles.addCourseButton} onClick={() => setModalOpen(true)}>
          Add New Course
        </Button>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        {isModalOpen && <CourseAddModal onUpdateCourse={handleUpdateCourse} onClose={() => setModalOpen(false)} />}
        {isEditModalVisible && selectedCourse && (
          <CourseEditModal
            onUpdateCourse={handleUpdateCourse}
            initialCourseData={selectedCourse}
            onClose={() => setEditModalVisible(false)}
          />
        )}
      </div>
    </div>
  );
};
