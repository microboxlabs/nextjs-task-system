"use client";

import { Pagination } from "flowbite-react";

export function PaginationTask({ currentPage, totalPages, onPageChange }: { currentPage: number; totalPages: number; onPageChange: (page: number) => void }) {
  return (
    <div className="flex overflow-x-auto sm:justify-center">
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
