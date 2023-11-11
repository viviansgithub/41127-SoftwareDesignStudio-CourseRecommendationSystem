import { Courses } from '@/components/UserComponents/Courses/Courses';

const Course = ({ params }: { params: { user_id: string } }) => {
  return <Courses user_id={params.user_id} />;
};

export default Course;
