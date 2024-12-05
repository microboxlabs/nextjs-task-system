import { Sidenav } from "./Sidenav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen md:flex-row">
      {/* Sidebar */}
      <aside className="w-full bg-gray-50 dark:bg-gray-800 md:w-64">
        <Sidenav />
      </aside>

      {/* Main Content */}
      <main className="flex-1 bg-gray-100 p-4 dark:bg-gray-900">
        {children}
      </main>
    </div>
  );
}
