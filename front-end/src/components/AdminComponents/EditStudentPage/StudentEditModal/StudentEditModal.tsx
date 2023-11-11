'use client';
import { AdminModal } from '@/components/AdminComponents/AdminModal/AdminModal';
import { Student } from '../../Interfaces';
import { useStudentForm } from '../useStudentForm';

interface StudentEditModalProps {
  initialStudentData: Student;
  onClose: () => void;
  onUpdateStudent: (updatedCourse: Student) => void;
}

export const StudentEditModal: React.FC<StudentEditModalProps> = ({ initialStudentData, onClose, onUpdateStudent }) => {
  const { formFields, studentData } = useStudentForm(initialStudentData);
  const handleSubmit = async () => {
    try {
      const studentNumber = initialStudentData.studentNumber;
      const response = await fetch(`http://localhost:5000/student/update/${studentNumber}`, {
        method: 'PATCH',
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
        // const updatedStudent: Student = {
        //   studentName: studentData.studentName,
        //   studentNumber: Number(studentData.studentNumber),
        //   major: studentData.major,
        //   year: studentData.year,
        //   gpa: Number(studentData.gpa),
        // };
        onClose();
        // onUpdateStudent(Student)
        alert('Student successfully updated!');
      } else {
        const data = await response.json();
        alert(`An error occurred: ${data.message}`);
      }
    } catch (error) {
      alert('An error occurred while updating the student');
    }
  };

  return (
    <AdminModal
      formFields={formFields}
      onSubmit={handleSubmit}
      title="Edit Student"
      onClose={onClose}
      initialFormData={{
        'Student Name': studentData.studentName,
        'Student Number': studentData.studentNumber,
        Major: studentData.major,
        Year: studentData.year,
        GPA: studentData.gpa,
      }}
    />
  );
};
