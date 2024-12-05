import { useTheme } from '@/store';
import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void; // Función para cambiar de página
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const { t } = useTheme();

  const goToPage = (page: number) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const pagesToShow: number[] = [];
  if (currentPage > 1) pagesToShow.push(currentPage - 1);
  pagesToShow.push(currentPage);
  if (currentPage < totalPages) pagesToShow.push(currentPage + 1);

  return (
    <nav aria-label="Pagination">
      <ul className="inline-flex w-full items-center justify-center space-x-2">
        <li>
          <button
            disabled={currentPage === 1}
            onClick={() => goToPage(currentPage - 1)}
            className="px-4 py-2 bg-[var(--bg-color1)] rounded hover:bg-[var(--bg-color3)] disabled:cursor-not-allowed"
          >
            {t.previous}
          </button>
        </li>

        {pagesToShow.map((page) => (
          <li key={page}>
            <button
              onClick={() => goToPage(page)}
              className={`px-4 py-2 rounded ${
                currentPage === page
                  ? 'bg-[var(--bg-color3)]'
                  : 'bg-[var(--bg-color1)] hover:bg-[var(--bg-color3)]'
              }`}
            >
              {page}
            </button>
          </li>
        ))}

        <li>
          <button
            disabled={currentPage === totalPages}
            onClick={() => goToPage(currentPage + 1)}
            className="px-4 py-2 bg-[var(--bg-color1)] rounded hover:bg-[var(--bg-color3)] disabled:cursor-not-allowed"
          >
            {t.next}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
