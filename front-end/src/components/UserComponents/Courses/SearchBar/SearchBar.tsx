import React from 'react';
import { Button } from '@/components/Button/Button';
import styles from './SearchBar.module.scss';

interface SearchBarProps {
  searchTerm: string;
  isRecommendActive: boolean;
  isLoading: boolean;
  handleRecommend: () => void;
  setSearchTerm: (term: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({
  searchTerm,
  isRecommendActive,
  isLoading,
  handleRecommend,
  setSearchTerm,
}) => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search for a course..."
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={isRecommendActive || isLoading}
      />
      <Button
        className={`${styles.recommendButton} ${isRecommendActive ? styles.activeRecommendButton : ''}`}
        onClick={handleRecommend}
        disabled={isLoading}
      >
        {isRecommendActive ? 'Show All Courses' : 'Recommend Courses'}
      </Button>
    </div>
  );
};

export default SearchBar;
