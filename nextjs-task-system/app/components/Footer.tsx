
"use client";

import { Footer } from "flowbite-react";

export function FooterComponet() {
    return (
        <Footer container className="bg-slate-400 text-white dark:bg-gray-800 dark:text-gray-200" >
            <div className="w-full text-center">
                <div className="w-full justify-between sm:flex sm:items-center sm:justify-between">
                    <Footer.Brand
                        href="https://flowbite.com"
                        src="https://flowbite.com/docs/images/logo.svg"
                        alt="Flowbite Logo"
                        name="Flowbite"
                    />

                    <Footer.LinkGroup>
                        <Footer.Link href="#">Joshua Granados</Footer.Link>
                        <Footer.Link href="https://flowbite.com/docs">Docs</Footer.Link>
                        <Footer.Link href="https://flowbite.com/docs">Pricing</Footer.Link>
                        <Footer.Link href="https://flowbite.com/docs">Blog</Footer.Link>


                    </Footer.LinkGroup>
                </div>
                <Footer.Divider />
                <Footer.Copyright href="#" by="Flowbite™" year={2022} />
            </div>
        </Footer>
    );
}
