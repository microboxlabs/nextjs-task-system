"use client";
import React, { useEffect, useState } from "react";
import { TaskTable } from "./tasks/task-table";
import { useTaskContext } from "@/contexts/TaskContext";
import { SkeletonTable } from "./tasks/task-table-skeleton";
export default function Dashboard() {
  const { getTasks } = useTaskContext();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setLoading(true);
    getTasks().finally(() => setLoading(false));
  }, []);
  return <div>{loading ? <SkeletonTable /> : <TaskTable />}</div>;
}
