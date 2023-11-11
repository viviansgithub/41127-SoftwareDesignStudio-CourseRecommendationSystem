'use client';
import styles from './Courses.module.scss';
import { FC, useEffect, useState } from 'react';
import { Course } from '../Interfaces';
import { UserHeader } from '../UserHeader/UserHeader';
import { Pagination } from '@/components/Pagination/Pagination';
import SearchBar from './SearchBar/SearchBar';
import CourseTable from './CourseTable/CourseTable';
import { getCourses, getRecommendedCourses } from '@/middleware/api';

interface Props {
  user_id?: string;
}

export const Courses: FC<Props> = ({ user_id }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [originalCourses, setOriginalCourses] = useState<Course[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [isRecommendActive, setIsRecommendActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const rowsPerPage = 10;

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
      setOriginalCourses(courseData);
    } catch (error) {
      console.error('Failed to fetch course data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, []);

  const handleRecommend = async () => {
    setIsRecommendActive(!isRecommendActive);
    setIsLoading(true);
    if (!isRecommendActive) {
      const recommendedCourses = await getRecommendedCourses(user_id!);

      setCourses(recommendedCourses);
    } else {
      setCourses(originalCourses);
      setIsRecommendActive(!isRecommendActive);
    }
    setIsLoading(false);
    setCurrentPage(1);
  };

  const filteredCourses = courses.filter((course) =>
    Object.values(course).some((value) => value.toString().toLowerCase().includes(searchTerm.toLowerCase())),
  );

  const totalPages = Math.ceil(filteredCourses.length / rowsPerPage);
  const currentCourses = filteredCourses.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  return (
    <>
      <UserHeader
        title="Courses"
        buttons={[
          { href: `/profile/${user_id}`, label: 'Profile' },
          { href: '/', label: 'Log Out' },
        ]}
      />
      <div className={styles.root}>
        {user_id}

        <div className={styles.container}>
          <SearchBar
            searchTerm={searchTerm}
            isRecommendActive={isRecommendActive}
            isLoading={isLoading}
            handleRecommend={handleRecommend}
            setSearchTerm={setSearchTerm}
          />
          <CourseTable isLoading={isLoading} currentCourses={currentCourses} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
      </div>
    </>
  );
};
