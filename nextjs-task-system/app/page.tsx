import TaskBoard from "./components/TaskBoard";

export default function Home() {
  return (
    <main className="p-2">
      {/* <h1 className="text-2xl dark:text-white">Flowbite React + Next.js</h1>
      <DarkThemeToggle /> */}
      <div className="">
        <TaskBoard />
      </div>
    </main>
  );
}
