"use client";
import React, { useState, useEffect } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "../ui/sidebar";
import {
  IconArrowLeft,
  IconUserBolt,
  IconPlus,
  IconBook,
  IconDeviceDesktop,
  IconBriefcase,
  IconChevronLeft,
  IconChevronRight,
  IconNotebook,
  IconRocket,
  IconAward,
  IconUserCheck,
  IconFlag,
  IconBallFootball,
  IconTrash,
  IconLayoutDashboard,
} from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "../ui/lib/utils";
import Ruthi_Logo1 from "../assets/Ruthi_Logo1.svg";
import BasicInformationForm from "./ProfilePageComponents/BasicInformationForm";
import Education from "./ProfilePageComponents/Education";
import ExperienceForm from "./ProfilePageComponents/ExperienceForm";
import TechnicalSkills from "./ProfilePageComponents/TechnicalSkills";
import AddSectionModal from "./ProfilePageComponents/AddSectionModal";
import Publications from "./ProfilePageComponents/Publications";
import PersonalProjects from "./ProfilePageComponents/PersonalProjects";
import AwardsAndAchievements from "./ProfilePageComponents/AwardsAndAchievements";
import PositionsOfResponsibility from "./ProfilePageComponents/PositionsOfResponsibility";
import Competitions from "./ProfilePageComponents/Competitions";
import ExtraCurricularActivities from "./ProfilePageComponents/ExtraCurricularActivities";
import OverviewPage from "./ProfilePageComponents/OverviewPage";
import { useRecoilValue } from "recoil";
import { personalInformationState, educationState } from "../store/atoms/userProfileSate";
import { Toaster, toast } from 'react-hot-toast';

const sectionIcons = {
  Publications: IconNotebook,
  "Personal Projects": IconRocket,
  "Awards and Achievements": IconAward,
  "Positions of Responsibility": IconUserBolt,
  "Competitions": IconFlag,
  "Extra-curricular Activities": IconBallFootball,
};

const availableSections = [
  "Publications",
  "Personal Projects",
  "Awards and Achievements",
  "Positions of Responsibility",
  "Competitions",
  "Extra-curricular Activities",
];

export default function SidebarDemo() {
  const [open, setOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("Basic Information");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [additionalSections, setAdditionalSections] = useState([]);
  const [errors, setErrors] = useState({});
  const personalInformation = useRecoilValue(personalInformationState);
  const educations = useRecoilValue(educationState);

  const initialLinks = [
    { label: "Basic Information", icon: <IconUserCheck />, href: "#" },
    { label: "Education", icon: <IconBook />, href: "#" },
    { label: "Experience", icon: <IconBriefcase />, href: "#" },
    { label: "Skills", icon: <IconDeviceDesktop />, href: "#" },
    {
      label: "Add more",
      icon: <IconPlus />,
      href: "#",
      onClick: () => setIsModalOpen(true),
    },
    {
      label: "Logout",
      icon: <IconArrowLeft />,
      href: "http://localhost:3000/",
    },
  ];

  const [links, setLinks] = useState(initialLinks);

  const handleAddSection = (newSection) => {
    if (!additionalSections.includes(newSection)) {
      setAdditionalSections([...additionalSections, newSection]);
      const IconComponent = sectionIcons[newSection] || IconPlus;
      setLinks([
        ...links.slice(0, -2),
        {
          label: newSection,
          icon: <IconComponent />,
          href: "#",
          deletable: true,
        },
        ...links.slice(-2),
      ]);
      setSelectedSection(newSection); // Open the new section immediately
    }
  };

  const handleDeleteSection = (sectionToDelete) => {
    setAdditionalSections(
      additionalSections.filter((section) => section !== sectionToDelete)
    );
    setLinks(links.filter((link) => link.label !== sectionToDelete));
    if (selectedSection === sectionToDelete) {
      setSelectedSection("Basic Information");
    }
  };

  // Update the links state when additionalSections change
  useEffect(() => {
    const updatedLinks = [
      ...initialLinks.slice(0, -2),
      ...additionalSections.map(section => ({
        label: section,
        icon: sectionIcons[section] ? React.createElement(sectionIcons[section]) : <IconPlus />,
        href: "#",
        deletable: true,
      })),
    ];

    // Only add the "Add more" button if there are still sections available to add
    if (additionalSections.length < availableSections.length) {
      updatedLinks.push({
        label: "Add more",
        icon: <IconPlus />,
        href: "#",
        onClick: () => setIsModalOpen(true),
      });
    }

    updatedLinks.push(initialLinks[initialLinks.length - 1]); // Add the "Logout" link
    setLinks(updatedLinks);
  }, [additionalSections]);

  const sections = [
    "Basic Information",
    "Education",
    "Experience",
    "Skills",
    ...additionalSections,
  ];
  const currentIndex = sections.indexOf(selectedSection);

  const validateBasicInfo = () => {
    const newErrors = {};
    if (!personalInformation.first_name) newErrors.first_name = "First name is required";
    if (!personalInformation.last_name) newErrors.last_name = "Last name is required";
    
    // Phone number validation
    if (!personalInformation.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(personalInformation.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    
    // Expected salary validation
    if (!personalInformation.expected_salary) {
      newErrors.expected_salary = "Expected salary is required";
    } else {
      const salary = Number(personalInformation.expected_salary);
      if (isNaN(salary) || salary < 1 || salary > 99) {
        newErrors.expected_salary = "Expected salary must be between 1 and 99";
      }
    }
    
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Dismiss any existing toasts
      toast.dismiss();

      // Display error toast
      toast.error(
        <div>
          <strong>Please fix the following errors:</strong>
          <ul className="mt-2 list-disc list-inside">
            {Object.entries(newErrors).map(([field, error]) => (
              <li key={field}>{error}</li>
            ))}
          </ul>
        </div>,
        {
          duration: 5000,
          position: 'top-right',
        }
      );
      return false;
    }
    return true;
  };

  const validateEducation = () => {
    if (educations.length === 0) {
      toast.error("Please add at least one education entry");
      return false;
    }

    const firstEducation = educations[0];
    const requiredFields = ['institution', 'degree', 'start_date', 'cgpa_or_percentage'];
    const missingFields = requiredFields.filter(field => !firstEducation[field]);

    if (missingFields.length > 0) {
      toast.error(
        <div>
          <strong>Please fill in all required fields for education:</strong>
          <ul className="mt-2 list-disc list-inside">
            {missingFields.map(field => (
              <li key={field}>{field.replace('_', ' ')}</li>
            ))}
          </ul>
        </div>,
        {
          duration: 5000,
          position: 'top-right',
        }
      );
      return false;
    }

    return true;
  };

  const handleNavigation = (direction) => {
    if (direction === "next") {
      switch (selectedSection) {
        case "Basic Information":
          if (!validateBasicInfo()) return;
          break;
        case "Education":
          if (!validateEducation()) return;
          break;
        // Add more cases for other sections if needed
      }
    }

    const newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
    if (newIndex >= 0 && newIndex < sections.length) {
      setSelectedSection(sections[newIndex]);
    } else if (newIndex === sections.length) {
      setIsModalOpen(true);
    }
  };

  const handleOverview = () => {
    setSelectedSection("Overview");
    setIsModalOpen(false);
  };

  const handleStartAddingDetails = () => {
    setSelectedSection("Basic Information");
    setIsModalOpen(false);
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden">
      <Toaster 
        toastOptions={{
          // Prevent duplicate toasts
          id: 'unique-toast',
          // Custom styles to position the toast
          style: {
            background: '#363636',
            color: '#fff',
            zIndex: 9999,
          },
        }}
      />
      <Sidebar open={open} setOpen={setOpen} className="flex-shrink-0">
        <SidebarBody className="justify-between py-2"> {/* Reduced padding */}
          <div className="flex flex-col flex-1">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-4 flex flex-col gap-1.5"> {/* Reduced gap and top margin */}
              {links.map((link, idx) => (
                <div key={idx} className="group relative flex items-center">
                  <SidebarLink
                    link={link}
                    onClick={() => {
                      if (link.onClick) {
                        link.onClick();
                      } else {
                        setSelectedSection(link.label);
                      }
                    }}
                    isActive={selectedSection === link.label}
                    className="w-full py-1 text-sm"
                  />
                  {link.deletable && (
                    <button
                      onClick={() => handleDeleteSection(link.label)}
                      className="absolute right-2 p-0.5 text-red-500 hover:text-red-700 focus:outline-none opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IconTrash size={12} /> {/* Reduced icon size */}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
          <SidebarLink
            link={{
              label: "Overview",
              icon: <IconLayoutDashboard />,
              href: "#",
            }}
            onClick={() => setSelectedSection("Overview")}
            isActive={selectedSection === "Overview"}
            className="mt-2 py-1 text-sm" 
          />
        </SidebarBody>
      </Sidebar>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-4">
          <Dashboard
            selectedSection={selectedSection}
            additionalSections={additionalSections}
            errors={errors}
          />
        </main>
        {selectedSection !== "Overview" && (
          <div className="p-4 bg-transparent z-10">
            <div className="max-w-4xl mx-auto w-full flex justify-between">
              <button
                onClick={() => handleNavigation("prev")}
                disabled={currentIndex === 0}
                className="px-4 py-2 bg-orange-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <IconChevronLeft className="w-5 h-5 inline-block mr-1" />
                Previous
              </button>
              <button
                onClick={() => handleNavigation("next")}
                className="px-4 py-2 bg-orange-600 text-white rounded"
              >
                Next
                <IconChevronRight className="w-5 h-5 inline-block ml-1" />
              </button>
            </div>
          </div>
        )}
      </div>
      <AddSectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddSection={handleAddSection}
        selectedSections={additionalSections}
        setSelectedSection={setSelectedSection}
      />
    </div>
  );
}

const Dashboard = ({ selectedSection, additionalSections, errors }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto w-full">
          {(() => {
            switch (selectedSection) {
              case "Basic Information":
                return <BasicInformationForm errors={errors} />;
              case "Education":
                return <Education />;
              case "Experience":
                return <ExperienceForm />;
              case "Skills":
                return <TechnicalSkills />;
              case "Publications":
                return <Publications />;
              case "Personal Projects":
                return <PersonalProjects />;
              case "Awards and Achievements":
                return <AwardsAndAchievements />;
              case "Positions of Responsibility":
                return <PositionsOfResponsibility />;
              case "Competitions":
                return <Competitions />;
              case "Extra-curricular Activities":
                return <ExtraCurricularActivities />;
              case "Overview":
                return <Overview />;
              default:
                return <div>Hehe</div>;
            }
          })()}
        </div>
      </div>
    </div>
  );
};

export const Logo = () => {
  return (
    <Link
      to="#"
      className="flex items-center justify-center relative z-20 py-1" 
    >
      <img
        src={Ruthi_Logo1}
        alt="Ruthi Logo"
        className="h-9 w-13 object-contain"
      />
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="#"
      className="flex items-center justify-center relative z-20 py-0.5" 
    >
      <img
        src={Ruthi_Logo1}
        alt="Ruthi Logo"
        className="h-8 w-8 object-contain"
      />
    </Link>
  );
};

const Overview = () => {
  return (
    <div className="h-full overflow-y-auto">
      <h2 className="text-2xl font-bold text-black">Overview</h2>
      <OverviewPage />
    </div>
  );
};
