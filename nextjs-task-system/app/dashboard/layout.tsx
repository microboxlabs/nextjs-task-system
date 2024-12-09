import { Sidenav } from "./Sidenav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex max-w-full overflow-y-hidden">
      <aside className="w-20 bg-gray-50 dark:bg-gray-800 md:w-64">
        <Sidenav />
      </aside>

      <main className="h-auto w-full grow rounded-lg bg-white p-7 shadow-sm">
        {children}
      </main>
    </div>
  );
}
