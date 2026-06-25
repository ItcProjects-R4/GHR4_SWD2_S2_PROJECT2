import React from 'react'
import styles from './PaginationComponent.module.css'

export default function PaginationComponent({
  currentPage = 0,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 10,
  totalItems = 0,
}) {
  const handlePrevious = () => {
    if (currentPage > 0) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      onPageChange(currentPage + 1)
    }
  }

  const handlePageClick = (page) => {
    onPageChange(page)
  }

  // Generate page numbers to show
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      for (let i = 0; i < totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(0)

      if (currentPage > 2) {
        pages.push('...')
      }

      for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(totalPages - 2, currentPage + 1);
        i++
      ) {
        if (!pages.includes(i)) {
          pages.push(i)
        }
      }

      if (currentPage < totalPages - 3) {
        pages.push('...')
      }

      pages.push(totalPages - 1)
    }

    return pages
  }

  return (
    <div className={styles.pagination}>
      <button
        className={styles.btn}
        onClick={handlePrevious}
        disabled={currentPage === 0}
      >
        <i className="fas fa-chevron-left"></i> Previous
      </button>

      <div className={styles.pages}>
        {getPageNumbers().map((page, index) => (
          <button
            key={index}
            className={`${styles.pageBtn} ${
              page === currentPage ? styles.active : ''
            } ${page === '...' ? styles.dots : ''}`}
            onClick={() => page !== '...' && handlePageClick(page)}
            disabled={page === '...'}
          >
            {page === '...' ? '...' : page + 1}
          </button>
        ))}
      </div>

      <button
        className={styles.btn}
        onClick={handleNext}
        disabled={currentPage >= totalPages - 1}
      >
        Next <i className="fas fa-chevron-right"></i>
      </button>

      {totalItems > 0 && (
        <div className={styles.info}>
          Page {currentPage + 1} of {totalPages} ({totalItems} items)
        </div>
      )}
    </div>
  )
}
