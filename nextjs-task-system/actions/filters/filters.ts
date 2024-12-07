import { Filters } from "@/types/tasks-types";
//generates a query param by the filter that finds
export const generateQueryParams = (filters: Filters) => {
  const params = new URLSearchParams();

  if (filters.status.length > 0) {
    filters.status.forEach((status) => params.append("status", status));
  }
  if (filters.typeOfAssigned)
    params.append("typeOfAssigned", filters.typeOfAssigned);
  if (filters.priority) params.append("priority", filters.priority);
  if (filters.assignedUserOrGroup)
    params.append("assignedUserOrGroup", filters.assignedUserOrGroup);
  if (filters.sortBy) params.append("sortBy", filters.sortBy);
  if (filters.sortOrder) params.append("sortOrder", filters.sortOrder);

  return params.toString();
};
