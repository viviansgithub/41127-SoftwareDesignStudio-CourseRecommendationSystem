import React from 'react';
import styles from './AdminSearchBar.module.scss';

interface AdminSearchBarProps {
  searchTerm: string;
  isLoading: boolean;
  setSearchTerm: (term: string) => void;
}

export const AdminSearchBar: React.FC<AdminSearchBarProps> = ({ searchTerm, isLoading, setSearchTerm }) => {
  return (
    <div className={styles.searchBar}>
      <input
        type="text"
        placeholder="Search for a course..."
        className={styles.searchInput}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        disabled={isLoading}
      />
    </div>
  );
};
