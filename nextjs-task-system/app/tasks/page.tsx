import NavbarTasks from "@/components/tasks/navbarTasks";
import { Task } from "@/types/tasks-types";
import { InferGetServerSidePropsType } from "next";

export default function Home() {
  return (
    <>
      <NavbarTasks />
    </>
  );
}
