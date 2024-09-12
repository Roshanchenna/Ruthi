import React from "react";

export default function LandingNavbar() {
  return (
    <nav className="ml-auto flex gap-4 sm:gap-6">
      <a
        className="text-sm font-medium hover:underline underline-offset-4"
        href="#"
      >
        Features
      </a>
      <a
        className="text-sm font-medium hover:underline underline-offset-4"
        href="#"
      >
        Pricing
      </a>
      <a
        className="text-sm font-medium hover:underline underline-offset-4"
        href="#"
      >
        About
      </a>
      <a
        className="text-sm font-medium hover:underline underline-offset-4"
        href="#"
      >
        Contact
      </a>
    </nav>
  );
}
