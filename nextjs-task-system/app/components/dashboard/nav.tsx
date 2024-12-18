import Link from "next/link";
import NavDropdown from "./nav-dropdown";

export default function Navbar() {
  return (
    <nav className="bg-gray-800 p-4 text-white">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/dashboard" className="text-xl font-bold">
          Task Manager
        </Link>
        <NavDropdown />
      </div>
    </nav>
  );
}
