export const formatDate = (date: Date | string) => {
  if (date instanceof Date) {
    return date.toISOString().split("T")[0];
  }

  if (typeof date === "string" && date.match(/^\d{4}-\d{1,2}-\d{1,2}$/)) {
    const [year, month, day] = date.split("-");
    return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  }

  return date;
};
