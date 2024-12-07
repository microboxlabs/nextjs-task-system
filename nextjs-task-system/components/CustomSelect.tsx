interface SelectProps {
  state: string;
  setState: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  values: string[];
  keyValues: string[];
}

export default function CustomSelect({
  state,
  setState,
  label,
  values,
  keyValues,
}: SelectProps) {
  return (
    <div className="mb-4">
      <label
        htmlFor="priority"
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <select
        id={state}
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {values.map((value, index) => (
          <option key={keyValues[index]} value={keyValues[index]}>
            {value}
          </option>
        ))}
      </select>
    </div>
  );
}
