import React from "react";

interface PaginationProps {
  hasMore: boolean;
  loading: boolean;
  onLoadMore: () => void;
}

const Pagination: React.FC<PaginationProps> = ({ hasMore, loading, onLoadMore }) => {
  return (
    <>
      {hasMore && !loading && (
        <button onClick={onLoadMore}>Load More</button>
      )}
    </>
  );
};

export default Pagination;
