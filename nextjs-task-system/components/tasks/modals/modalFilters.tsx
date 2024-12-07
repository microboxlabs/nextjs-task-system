import { useTaskContext } from "@/context/TaskContext";
import { Filters, ResponseSelectAssigned } from "@/types/tasks-types";
import { Button, Modal, Select, Checkbox, Label } from "flowbite-react";
import { useEffect, useState } from "react";

interface Props {
  filtersOpen: boolean;
  setFiltersOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAdmin: boolean;
}

export default function ModalFilters({
  filtersOpen,
  setFiltersOpen,
  isAdmin,
}: Props) {
  const { filters, setFilters } = useTaskContext();

  const [dataAssigned, setDataAssigned] =
    useState<ResponseSelectAssigned | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!filtersOpen) return;

      try {
        const url = process.env.NEXT_PUBLIC_URL_PAGE + "/api/tasks/getselects";
        const response = await fetch(url, {
          method: "GET",
          credentials: "include",
        });
        const data: ResponseSelectAssigned = await response.json();
        setDataAssigned(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [filtersOpen]);

  // Estado temporal para los filtros, sin afectar el estado global
  const [formData, setFormData] = useState<Filters>({
    status: filters.status || [],
    priority: filters.priority || "",
    assignedUserOrGroup: filters.assignedUserOrGroup || "",
    sortBy: filters.sortBy || "dueDate",
    sortOrder: filters.sortOrder || "asc",
    typeOfAssigned: "",
  });

  const handleStatusChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    status: string,
  ) => {
    const newStatus = e.target.checked
      ? [...formData.status, status]
      : formData.status.filter((item: string) => item !== status);
    setFormData({ ...formData, status: newStatus });
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, priority: e.target.value });
  };
  const handleTypeOfAssigned = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({
      ...formData,
      typeOfAssigned: e.target.value,
      assignedUserOrGroup: "",
    });
  };
  const handleAssignedUserOrGroupChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
  ) => {
    setFormData({ ...formData, assignedUserOrGroup: e.target.value });
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, sortBy: e.target.value });
  };

  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, sortOrder: e.target.value as "asc" | "desc" });
  };

  const clearFilters = () => {
    setFormData({
      status: [],
      priority: "",
      assignedUserOrGroup: "",
      sortBy: "dueDate",
      sortOrder: "asc",
      typeOfAssigned: "person",
    });
    setFilters({
      status: [],
      priority: "",
      assignedUserOrGroup: "",
      sortBy: "dueDate",
      sortOrder: "asc",
      typeOfAssigned: "person",
    });
  };

  const applyFilters = () => {
    setFilters({
      assignedUserOrGroup: formData.assignedUserOrGroup,
      priority: formData.priority,
      sortBy: formData.sortBy,
      sortOrder: formData.sortOrder,
      status: formData.status,
      typeOfAssigned: formData.typeOfAssigned,
    });
    setFiltersOpen(false);
  };

  useEffect(() => {
    if (filtersOpen) {
      setFormData({
        typeOfAssigned: filters.typeOfAssigned,
        assignedUserOrGroup: filters.assignedUserOrGroup,
        priority: filters.priority,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        status: filters.status,
      });
    }
  }, [
    filtersOpen,
    filters.typeOfAssigned,
    filters.priority,
    filters.assignedUserOrGroup,
    filters.sortBy,
    filters.sortOrder,
    filters.status,
  ]);

  return (
    <Modal
      show={filtersOpen}
      size="md"
      onClose={() => setFiltersOpen(false)}
      popup
    >
      <Modal.Header>Filters</Modal.Header>
      <Modal.Body>
        <div className="space-y-4">
          <div>
            <label
              htmlFor="status"
              className="block text-sm font-medium text-gray-700"
            >
              Status
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                <Checkbox
                  id="status-active"
                  checked={formData.status.includes("1")}
                  onChange={(e) => handleStatusChange(e, "1")}
                />
                <label
                  htmlFor="status-active"
                  className="ml-2 text-sm text-gray-700"
                >
                  Pending
                </label>
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="status-in-progress"
                  checked={formData.status.includes("2")}
                  onChange={(e) => handleStatusChange(e, "2")}
                />
                <label
                  htmlFor="status-in-progress"
                  className="ml-2 text-sm text-gray-700"
                >
                  In progress
                </label>
              </div>

              <div className="flex items-center">
                <Checkbox
                  id="status-completed"
                  checked={formData.status.includes("3")}
                  onChange={(e) => handleStatusChange(e, "3")}
                />
                <label
                  htmlFor="status-completed"
                  className="ml-2 text-sm text-gray-700"
                >
                  Completed
                </label>
              </div>
            </div>
          </div>

          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700"
            >
              Priority
            </label>
            <Select
              id="priority"
              value={formData.priority}
              onChange={handlePriorityChange}
            >
              <option value="">Select priority</option>
              <option value={"3"}>High</option>
              <option value={"2"}>Medium</option>
              <option value={"1"}>Low</option>
            </Select>
          </div>

          <div>
            <div className="mb-2 ">
              <Label
                htmlFor="typeOfAssigned"
                value="Select the assigned type"
              />
            </div>
            <Select
              onChange={handleTypeOfAssigned}
              value={formData.typeOfAssigned}
              name="typeOfAssigned"
              id="typeOfAssigned"
              required
            >
              <option value="">Select a value</option>

              <option value={"person"}>Per Person</option>
              <option value={"group"}>Per Group</option>
            </Select>
          </div>
          {formData.typeOfAssigned != "" && (
            <div>
              <div className="mb-2 ">
                <Label
                  htmlFor={
                    formData.typeOfAssigned == "person"
                      ? `perPerson`
                      : `perGroup`
                  }
                  value={
                    formData.typeOfAssigned == "person"
                      ? `Person assigned`
                      : `Group assigned`
                  }
                />
              </div>
              <Select
                id={
                  formData.typeOfAssigned == "person" ? `perPerson` : `perGroup`
                }
                name="Assigned"
                value={formData.assignedUserOrGroup}
                required
                onChange={handleAssignedUserOrGroupChange}
              >
                {formData.typeOfAssigned == "person" ? (
                  <>
                    <option value="">Select a value</option>
                    {dataAssigned?.data?.users.map((person, index) => (
                      <option key={index} value={person.id}>
                        {person.name}{" "}
                      </option>
                    ))}
                  </>
                ) : (
                  <>
                    <option value="">Select a value</option>
                    {dataAssigned?.data?.groups.map((group, index) => (
                      <option key={index} value={group.id}>
                        {group.name}{" "}
                      </option>
                    ))}
                  </>
                )}
              </Select>
            </div>
          )}

          {isAdmin && (
            <>
              <div>
                <label
                  htmlFor="sortBy"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sort By
                </label>
                <Select
                  id="sortBy"
                  value={formData.sortBy}
                  onChange={handleSortChange}
                >
                  <option value="dueDate">Due Date</option>

                  <option value="creationDate">Creation Date</option>
                </Select>
              </div>

              <div>
                <label
                  htmlFor="sortOrder"
                  className="block text-sm font-medium text-gray-700"
                >
                  Sort Order
                </label>
                <Select
                  id="sortOrder"
                  value={formData.sortOrder}
                  onChange={handleSortOrderChange}
                >
                  <option value="asc">Ascending</option>
                  <option value="desc">Descending</option>
                </Select>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2">
            <Button color="gray" onClick={() => setFiltersOpen(false)}>
              Close
            </Button>
            <Button color="gray" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button onClick={applyFilters}>Apply</Button>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}
