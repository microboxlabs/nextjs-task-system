import { Dashboard } from "../components/dashboard";
import { FooterPage } from "../components/footer";
import { NavBar } from "../components/navBar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <NavBar />
      <div className="flex flex-col md:flex-row">
 
        <div className="w-full md:max-w-xs md:w-auto ">
          <Dashboard />
        </div>
        

        <main className="flex-1 p-4">
          {children}
        </main>

      </div>
       
       <FooterPage />
    </>
  );
}
