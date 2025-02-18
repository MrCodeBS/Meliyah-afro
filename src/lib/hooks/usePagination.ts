import { useState } from 'react';

interface UsePaginationProps {
  total: number;
  initialPage?: number;
  pageSize?: number;
}

export function usePagination({ 
  total, 
  initialPage = 1, 
  pageSize = 10 
}: UsePaginationProps) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = Math.ceil(total / pageSize);
  const offset = (currentPage - 1) * pageSize;

  const nextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const prevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const goToPage = (page: number) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  };

  return {
    currentPage,
    totalPages,
    pageSize,
    offset,
    nextPage,
    prevPage,
    goToPage,
  };
}