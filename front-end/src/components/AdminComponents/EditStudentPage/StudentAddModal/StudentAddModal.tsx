'use client';
import { AdminModal } from '@/components/AdminComponents/AdminModal/AdminModal';
import { Student } from '../../Interfaces';
import { useStudentForm } from '../useStudentForm';

interface StudentAddModalProps {
  onClose: () => void;
  onAddStudent: (newStudent: Student) => void;
}

export const StudentAddModal: React.FC<StudentAddModalProps> = ({ onClose, onAddStudent }) => {
  const { formFields, studentData } = useStudentForm({});
  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:5000/student/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          student_name: studentData.studentName,
          student_number: Number(studentData.studentNumber),
          major: studentData.major,
          year: studentData.year,
          gpa: Number(studentData.gpa),
        }),
      });

      if (response.status === 200) {
        const newStudent: Student = {
          studentName: studentData.studentName,
          studentNumber: Number(studentData.studentNumber),
          major: studentData.major,
          year: studentData.year,
          gpa: Number(studentData.gpa),
        };
        // onAddStudent(newStudent)
        onClose();
        alert('Student successfully added!');
      } else {
        const data = await response.json();
        alert(`An error occurred: ${data.message}`);
      }
    } catch (error) {
      alert('An error occurred while creating the student');
    }
  };

  return <AdminModal formFields={formFields} onSubmit={handleSubmit} title="Add New Student" onClose={onClose} />;
};
