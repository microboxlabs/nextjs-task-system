import {
  Footer,
  FooterCopyright,
  FooterLink,
  FooterLinkGroup,
} from "flowbite-react";

export const FooterComponent = () => {
  return (
    <Footer
      container
      className="w-full border-t-2 border-gray-600 bg-gray-100 p-4 sm:p-6 md:flex md:items-center md:justify-between"
    >
      {/* Copyright */}
      <FooterCopyright
        href="#"
        by="Diego Cabré"
        year={2024}
        className="text-center md:text-left"
      />

      {/* Link Group */}
      <FooterLinkGroup className="mt-4 flex flex-wrap justify-center gap-4 md:mt-0 md:justify-end">
        <FooterLink href="#">About</FooterLink>
        <FooterLink href="#">Privacy Policy</FooterLink>
        <FooterLink href="#">Licensing</FooterLink>
        <FooterLink href="#">Contact</FooterLink>
      </FooterLinkGroup>
    </Footer>
  );
};
