interface FilterProps {
  setFilterState: React.Dispatch<React.SetStateAction<string>>;
  filterState: string;
  setFilterPriority: React.Dispatch<React.SetStateAction<string>>;
  filterPriority: string;
  setFilterUser: React.Dispatch<React.SetStateAction<string>>;
  filterUser: string;
  setSortOrder: React.Dispatch<React.SetStateAction<string>>; // Nuevo prop para el ordenamiento
  sortOrder: string; // Nuevo estado para el ordenamiento
}

export default function Filtrado({
  filterState,
  filterPriority,
  filterUser,
  setFilterPriority,
  setFilterUser,
  setFilterState,
  sortOrder, // Nuevo prop para el ordenamiento
  setSortOrder, // Nuevo setter para el ordenamiento
}: FilterProps) {
  return (
    <>
      {/* Filtros */}
      <div className="mb-4 flex flex-col gap-4 rounded-lg bg-white p-4 shadow-md dark:bg-gray-800 sm:flex-row">
        {/* Filtro por estado */}
        <div className="flex flex-col">
          <label
            htmlFor="filterState"
            className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Filtrar por Estado:
          </label>
          <select
            id="filterState"
            className="rounded-md border border-gray-300 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Pendiente">Pendiente</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Completada">Completada</option>
          </select>
        </div>

        {/* Filtro por prioridad */}
        <div className="flex flex-col">
          <label
            htmlFor="filterPriority"
            className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Filtrar por Prioridad:
          </label>
          <select
            id="filterPriority"
            className="rounded-md border border-gray-300 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
          >
            <option value="Todos">Todos</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>

        {/* Filtro por usuario */}
        <div className="flex flex-grow flex-col">
          <label
            htmlFor="filterUser"
            className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Filtrar por Usuario o Grupo:
          </label>
          <input
            id="filterUser"
            type="text"
            className="rounded-md border border-gray-300 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            placeholder="Nombre del usuario o grupo"
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
          />
        </div>

        {/* Filtro por ordenamiento */}
        <div className="flex flex-col">
          <label
            htmlFor="sortOrder"
            className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-300"
          >
            Ordenar por:
          </label>
          <select
            id="sortOrder"
            className="rounded-md border border-gray-300 bg-gray-50 p-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="due_date">Fecha de Vencimiento</option>
            <option value="created_date">Fecha de Creación</option>
            <option value="priority">Prioridad</option>
          </select>
        </div>
      </div>
    </>
  );
}
