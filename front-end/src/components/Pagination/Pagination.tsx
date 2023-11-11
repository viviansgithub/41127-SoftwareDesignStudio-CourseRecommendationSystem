import React from 'react';
import styles from './Pagination.module.scss';
import { Button } from '@/components/Button/Button';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const maxButtons = 3; // Maximum number of buttons to show (e.g., 4 buttons)

  const renderPaginationButtons = () => {
    const buttons = [];
    let startPage = Math.max(currentPage - Math.floor(maxButtons / 2), 1);
    let endPage = Math.min(startPage + maxButtons - 1, totalPages);

    if (endPage === totalPages) {
      startPage = Math.max(totalPages - maxButtons + 1, 1);
    }

    if (startPage > 1) {
      buttons.push(
        <Button key={1} onClick={() => onPageChange(1)}>
          1
        </Button>,
      );

      if (startPage > 2) {
        buttons.push(<span key="ellipsis-start">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <Button key={i} onClick={() => onPageChange(i)} className={currentPage === i ? styles.active : ''}>
          {currentPage === i ? i : i}
        </Button>,
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        buttons.push(<span key="ellipsis-end">...</span>);
      }

      buttons.push(
        <Button key={totalPages} onClick={() => onPageChange(totalPages)}>
          {totalPages}
        </Button>,
      );
    }

    return buttons;
  };

  return (
    <div className={styles.pagination}>
      <Button onClick={() => onPageChange(Math.max(currentPage - 1, 1))} disabled={currentPage === 1}>
        &lt;
      </Button>
      {renderPaginationButtons()}
      <Button onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))} disabled={currentPage === totalPages}>
        &gt;
      </Button>
    </div>
  );
};
