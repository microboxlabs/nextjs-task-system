import { NavbarUsers } from "../ui/Nav/Navbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen flex-col">
      <header className="w-full bg-gray-50 shadow-md dark:bg-gray-800">
        <NavbarUsers />
      </header>

      <main className="size-full grow overflow-y-auto bg-white p-7 shadow-sm">
        {children}
      </main>
    </div>
  );
}
