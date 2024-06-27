import { useState } from "react";
const useProductPagination = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  return {
    page,
    pageSize,
    totalPages,
    currentPage,
    setPage,
    setPageSize,
    setTotalPages,
    setCurrentPage,
  };
};

export default useProductPagination;
