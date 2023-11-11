'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/Button/Button';
import { AdminHeader } from '../AdminHeader/AdminHeader';
import styles from './EditStudentPage.module.scss';
import { StudentRow } from './StudentRow/StudentRow';
import { StudentAddModal } from './StudentAddModal/StudentAddModal';
import { StudentEditModal } from './StudentEditModal/StudentEditModal';
import { Student, fetchStudents } from '../Interfaces';
import { Pagination } from '@/components/Pagination/Pagination';

export const EditStudentPage = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalVisible, setEditModalVisible] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(6);

  useEffect(() => {
    const studentsData = fetchStudents();
    setStudents(studentsData);
  }, []);

  const openEditModal = (student: Student) => {
    setSelectedStudent(student);
    setEditModalVisible(true);
  };

  const handleAddStudent = (newStudent: Student) => {
    setStudents([...students, newStudent]);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prevStudents) => {
      return prevStudents.map((student) => {
        if (student.studentNumber === updatedStudent.studentNumber) {
          return updatedStudent;
        }
        return student;
      });
    });
  };

  const deleteStudent = (studentNumber: number) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this student?');
    if (!confirmDelete) {
      return;
    }
    try {
      // await deleteStudentFromServer(studentNumber)
      setStudents((prevStudents) => prevStudents.filter((student) => student.studentNumber !== studentNumber));
    } catch (error) {
      console.error('Failed to delete course:', error);
    }
  };

  const currentStudents = students.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  const totalPages = Math.ceil(students.length / rowsPerPage);

  return (
    <div className={styles.root}>
      <AdminHeader
        title="Edit Students"
        buttons={[
          { href: '/admin', label: 'Admin Dashboard' },
          { href: '/edit-courses', label: 'Edit Courses' },
          { href: '/', label: 'Log Out' },
        ]}
      />
      <div className={styles.editStudentContainer}>
        <table className={styles.studentTable}>
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Student Number</th>
              <th>Major</th>
              <th>Year</th>
              <th>GPA</th>
            </tr>
          </thead>
          <tbody>
            {currentStudents.map((student) => (
              <StudentRow key={student.studentNumber} student={student} onView={() => openEditModal(student)} />
            ))}
          </tbody>
        </table>
        <Button className={styles.addStudentButton} onClick={() => setModalOpen(true)}>
          Add New Student
        </Button>
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        {isModalOpen && <StudentAddModal onClose={() => setModalOpen(false)} onAddStudent={handleAddStudent} />}
        {isEditModalVisible && selectedStudent && (
          <StudentEditModal
            onUpdateStudent={handleUpdateStudent}
            initialStudentData={selectedStudent}
            onClose={() => setEditModalVisible(false)}
          />
        )}
      </div>
    </div>
  );
};
