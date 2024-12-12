
"use client";

import { Footer } from "flowbite-react";

export function FooterPage() {
  return (
    <Footer container>
      <div className="w-full text-center">
        <Footer.Copyright href="#" by="Task Management System™" year={2024} />
      </div>
    </Footer>
  );
}
