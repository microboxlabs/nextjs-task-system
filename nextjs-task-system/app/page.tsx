import Dashboard from "./dashboard/page";
import DashboardWrapper from "./DashboardWrapper";

export default function Home() {
  

  return (
    <DashboardWrapper>
      <main className="flex items-center justify-center gap-2 m-4 rounded-lg bg-gray-100 h-full">
        <Dashboard />
      </main>
    </DashboardWrapper>
  );
}
