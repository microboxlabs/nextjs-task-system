import React, { useState } from "react";
import { Button, Select, Tooltip } from "flowbite-react";
import { FaSortUp, FaSortDown } from "react-icons/fa";

interface SortProps {
  onChangeSort: (sortBy: string) => void;
  onChangeDirection: (direction: "asc" | "desc") => void;
}

const Sort: React.FC<SortProps> = ({ onChangeSort, onChangeDirection }) => {
  const [sortBy, setSortBy] = useState("createdAt");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSort = e.target.value;
    setSortBy(newSort);
    onChangeSort(newSort);
  };

  const toggleDirection = () => {
    const newDirection = direction === "asc" ? "desc" : "asc";
    setDirection(newDirection);
    onChangeDirection(newDirection);
  };

  return (
    <div className="flex items-center">
      <p className="mr-3 dark:text-gray-300">Sort By</p>
      <Select
        value={sortBy}
        onChange={handleSortChange}
        className="w-40"
        style={{ borderEndEndRadius: 0, borderStartEndRadius: 0 }}
        aria-label="Sort by"
      >
        <option value="createdAt">Creation Date</option>
        <option value="dueDate">Due Date</option>
        <option value="priority">Priority</option>
      </Select>
      <Tooltip content={direction === "asc" ? "Ascending" : "Descending"}>
        <Button
          onClick={toggleDirection}
          className="rounded-s-none"
          aria-label={`Change direction to ${direction === "asc" ? "desc" : "asc"}`}
        >
          {direction === "asc" ? (
            <FaSortUp size={20} />
          ) : (
            <FaSortDown size={20} />
          )}
        </Button>
      </Tooltip>
    </div>
  );
};

export default Sort;
