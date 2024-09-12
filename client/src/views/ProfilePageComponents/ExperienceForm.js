import React, { useRef } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useRecoilState } from "recoil";
import { experienceState } from "../../store/atoms/userProfileSate";
import { IconBriefcase } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { z } from "zod";

const experienceSchema = z.object({
  company: z.string()
    .min(1, "Company name is required")
    .regex(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,'-]+$/, "Company name must contain at least one letter and can include letters, numbers, spaces, and common punctuation"),
  position: z.string()
    .min(1, "Position is required")
    .regex(/^[a-zA-Z0-9\s.,'-]+$/, "Position should only contain letters, numbers, spaces, and common punctuation"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  description: z.string().optional(),
  currently_working: z.boolean(),
});

export default function ExperienceForm() {
  const [experiences, setExperiences] = useRecoilState(experienceState);
  const newCardRef = useRef(null);
  const [errors, setErrors] = React.useState({});

  const validateField = (field, value, experienceId) => {
    try {
      experienceSchema.shape[field].parse(value);
      setErrors(prev => ({...prev, [`${experienceId}-${field}`]: null}));
    } catch (error) {
      setErrors(prev => ({...prev, [`${experienceId}-${field}`]: error.errors[0].message}));
    }
  };

  const addExperience = () => {
    const newId = experiences.length > 0 ? Math.max(...experiences.map((e) => e.id)) + 1 : 1;
    const newExperience = {
      id: newId,
      company: "",
      position: "",
      start_date: "",
      end_date: "",
      description: "",
      currently_working: false,
    };
    setExperiences([...experiences, newExperience]);

    setTimeout(() => {
      newCardRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const removeExperience = (id) => {
    setExperiences(experiences.filter((experience) => experience.id !== id));
  };

  const handleInputChange = (id, field, value) => {
    setExperiences((prevExperiences) =>
      prevExperiences.map((experience) =>
        experience.id === id ? { ...experience, [field]: value } : experience
      )
    );
    validateField(field, value, id);

    // Additional validation for end date
    if (field === 'end_date') {
      const currentExperience = experiences.find(exp => exp.id === id);
      if (currentExperience && new Date(value) <= new Date(currentExperience.start_date)) {
        setErrors(prev => ({...prev, [`${id}-${field}`]: "End date must be after start date"}));
      }
    }
  };

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const validateEndDate = (startDate, endDate) => {
    return !startDate || !endDate || new Date(endDate) >= new Date(startDate);
  };

  const descriptionToBulletPoints = (description) => {
    if (!description || typeof description !== "string") {
      return [];
    }
    return description.split("\n").filter((point) => point.trim() !== "");
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <IconBriefcase className="p-2 bg-blue-200 rounded-full w-9 h-9 text-blue-600 text-lg" />
              <h2 className="text-lg font-semibold text-gray-800">
                Work Experience
              </h2>
            </div>
            <button
              onClick={addExperience}
              className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full"
              aria-label="Add experience"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
          <div className="space-y-6">
            {experiences.map((experience, index) => (
              <div
                key={experience.id}
                className="p-4 border border-gray-200 rounded-md relative"
                ref={index === experiences.length - 1 ? newCardRef : null}
              >
                <button
                  onClick={() => removeExperience(experience.id)}
                  className="absolute top-2 right-2 text-destructive hover:text-destructive/90  text-red-500 hover:text-red-700"
                  aria-label="Remove experience"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`company-${experience.id}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Company
                    </label>
                    <input
                      type="text"
                      id={`company-${experience.id}`}
                      value={experience.company}
                      onChange={(e) =>
                        handleInputChange(
                          experience.id,
                          "company",
                          e.target.value
                        )
                      }
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors[`${experience.id}-company`] ? "border-red-500" : ""
                      }`}
                    />
                    {errors[`${experience.id}-company`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${experience.id}-company`]}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`position-${experience.id}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Position
                    </label>
                    <input
                      type="text"
                      id={`position-${experience.id}`}
                      value={experience.position}
                      onChange={(e) =>
                        handleInputChange(
                          experience.id,
                          "position",
                          e.target.value
                        )
                      }
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors[`${experience.id}-position`] ? "border-red-500" : ""
                      }`}
                    />
                    {errors[`${experience.id}-position`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${experience.id}-position`]}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`startDate-${experience.id}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id={`startDate-${experience.id}`}
                      value={experience.start_date}
                      onChange={(e) => {
                        const newStartDate = e.target.value;
                        handleInputChange(
                          experience.id,
                          "start_date",
                          newStartDate
                        );
                        if (
                          !validateEndDate(newStartDate, experience.end_date)
                        ) {
                          handleInputChange(experience.id, "end_date", "");
                        }
                      }}
                      max={getCurrentDate()}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors[`${experience.id}-start_date`] ? "border-red-500" : ""
                      }`}
                    />
                    {errors[`${experience.id}-start_date`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${experience.id}-start_date`]}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`endDate-${experience.id}`}
                      className="block text-sm font-medium text-gray-700"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id={`endDate-${experience.id}`}
                      value={experience.end_date}
                      onChange={(e) => {
                        const newEndDate = e.target.value;
                        if (
                          validateEndDate(experience.start_date, newEndDate)
                        ) {
                          handleInputChange(
                            experience.id,
                            "end_date",
                            newEndDate
                          );
                        }
                      }}
                      min={experience.start_date}
                      max={getCurrentDate()}
                      disabled={experience.currently_working}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary ${
                        errors[`${experience.id}-end_date`] ? "border-red-500" : ""
                      }`}
                    />
                    {errors[`${experience.id}-end_date`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${experience.id}-end_date`]}</p>
                    )}
                  </div>
                  <div className="sm:col-span-2">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`currentlyWorking-${experience.id}`}
                        checked={experience.currently_working}
                        onChange={(e) => {
                          handleInputChange(
                            experience.id,
                            "currently_working",
                            e.target.checked
                          );
                          if (e.target.checked) {
                            handleInputChange(experience.id, "end_date", "");
                          }
                        }}
                        className="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                      />
                      <label
                        htmlFor={`currentlyWorking-${experience.id}`}
                        className="ml-2 block text-sm text-gray-900"
                      >
                        I currently work here
                      </label>
                    </div>
                  </div>
                  <div className="sm:col-span-2">
                    <label
                      htmlFor={`description-${experience.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Responsibilities/Achievements (one per line)
                    </label>
                    <textarea
                      id={`description-${experience.id}`}
                      value={experience.description || ""}
                      onChange={(e) =>
                        handleInputChange(
                          experience.id,
                          "description",
                          e.target.value
                        )
                      }
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                      placeholder="Enter responsibilities or achievements, one per line"
                    />
                  </div>
                  {experience.description && (
                    <div className="sm:col-span-2 mt-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Responsibilities/Achievements Preview:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {descriptionToBulletPoints(experience.description).map(
                          (point, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              {point}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
