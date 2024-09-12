import React, { useEffect } from "react";

import { useAuth } from "../context/AuthContext.js";

import LandingFooter from "../components/landing/LandingFooter.js";
import LandingThirdSection from "../components/landing/LandingThirdSection.js";
import LandingSecondSection from "../components/landing/LandingSecondSection.js";
import LanndingFirstSection from "../components/landing/LanndingFirstSection.js";
import LandingNavbar from "../components/landing/LandingNavbar.js";

export default function NewLandingPage() {
  var { authToken, setToken } = useAuth();

  useEffect(() => {
    // If there is no authToken in the context, retrieve it from localStorage
    console.log("inside use effect");
    if (!authToken) {
      const storedAuthToken = localStorage.getItem("authToken");
      if (storedAuthToken) {
        setToken(storedAuthToken);
      } else {
        return;
      }
    }
  }); // add dependency array for authToken and setToken if required

  return (
    <>
      <div className="flex flex-col min-h-[100dvh]">
        <header className="px-4 lg:px-6 h-14 flex items-center">
          <a className="flex items-center justify-center" href="#">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="h-6 w-6"
            >
              <path d="m8 3 4 8 5-5 5 15H2L8 3z"></path>
            </svg>
            <span className="sr-only">JobX</span>
          </a>
          <LandingNavbar />
        </header>
        <main className="flex-1">
          <LanndingFirstSection />
          <LandingSecondSection />
          <LandingThirdSection />
        </main>
        <LandingFooter />
      </div>
    </>
  );
}
