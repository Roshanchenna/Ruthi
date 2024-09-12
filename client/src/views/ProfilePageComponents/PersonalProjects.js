"use client";

import { useState, useRef, useEffect } from "react";
import { useRecoilState } from "recoil";
import { personalProjectsState } from "../../store/atoms/userProfileSate";
import { Rocket, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";

const projectSchema = z.object({
  name: z.string()
    .min(1, "Project name is required")
    .regex(/^(?=.*[a-zA-Z])/, "Project name must contain at least one letter"),
  description: z.string().optional(),
  link: z.string().url("Invalid URL").or(z.literal("")),
  start_date: z.string().refine(
    (date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      return selectedDate <= today;
    },
    { message: "Start date cannot be in the future" }
  ),
  end_date: z.string().refine(
    (date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      return selectedDate <= today;
    },
    { message: "End date cannot be in the future" }
  ).optional(),
});

export default function PersonalProjects() {
  const [projects, setProjects] = useRecoilState(personalProjectsState);
  const newItemRef = useRef(null);
  const [errors, setErrors] = useState({});

  const getCurrentDate = () => {
    return new Date().toISOString().split("T")[0];
  };

  const validateField = (field, value, index) => {
    try {
      projectSchema.shape[field].parse(value);
      setErrors(prev => ({...prev, [`${index}-${field}`]: null}));
    } catch (error) {
      setErrors(prev => ({...prev, [`${index}-${field}`]: error.errors[0].message}));
    }
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: "",
      description: "",
      link: "",
      start_date: "",
      end_date: "",
    };
    setProjects([...projects, newProject]);
    setTimeout(() => scrollToNewItem(), 100);
  };

  const removeProject = (id) => {
    setProjects(projects.filter((project) => project.id !== id));
  };

  const scrollToNewItem = () => {
    newItemRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleInputChange = (index, field, value) => {
    const updatedProjects = projects.map((proj, i) =>
      i === index ? { ...proj, [field]: value } : proj
    );
    setProjects(updatedProjects);
    validateField(field, value, index);

    // Additional validation for end date
    if (field === 'end_date') {
      const currentProject = updatedProjects[index];
      if (currentProject.start_date && new Date(value) < new Date(currentProject.start_date)) {
        setErrors(prev => ({...prev, [`${index}-${field}`]: "End date must be after start date"}));
      }
    }
  };

  const descriptionToBulletPoints = (description) => {
    if (!description || typeof description !== 'string') {
      return [];
    }
    return description.split('\n').filter(point => point.trim() !== '');
  };

  return (
    <div className="container mx-auto p-2 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-white shadow-md rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <Rocket className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Personal Projects</h2>
            </div>
            <button
              onClick={addProject}
              className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full"
              aria-label="Add project"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {projects.map((project, index) => (
              <div
                key={project.id}
                ref={index === projects.length - 1 ? newItemRef : null}
                className="p-4 border border-gray-200 rounded-md relative"
              >
                <button
                  onClick={() => removeProject(project.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  aria-label="Remove project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`project-name-${project.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Project Name
                    </label>
                    <input
                      type="text"
                      id={`project-name-${project.id}`}
                      value={project.name}
                      onChange={(e) => handleInputChange(index, "name", e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`${index}-name`] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[`${index}-name`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${index}-name`]}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`project-link-${project.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Project Link
                    </label>
                    <input
                      type="url"
                      id={`project-link-${project.id}`}
                      value={project.link}
                      onChange={(e) => handleInputChange(index, "link", e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`${index}-link`] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[`${index}-link`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${index}-link`]}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`start-date-${project.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Start Date
                    </label>
                    <input
                      type="date"
                      id={`start-date-${project.id}`}
                      value={project.start_date}
                      max={getCurrentDate()}
                      onChange={(e) => handleInputChange(index, "start_date", e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`${index}-start_date`] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[`${index}-start_date`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${index}-start_date`]}</p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor={`end-date-${project.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      End Date
                    </label>
                    <input
                      type="date"
                      id={`end-date-${project.id}`}
                      value={project.end_date}
                      min={project.start_date}
                      max={getCurrentDate()}
                      onChange={(e) => handleInputChange(index, "end_date", e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`${index}-end_date`] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[`${index}-end_date`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${index}-end_date`]}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor={`description-${project.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Project Details/Achievements (one per line)
                    </label>
                    <textarea
                      id={`description-${project.id}`}
                      value={project.description || ''}
                      onChange={(e) => handleInputChange(index, "description", e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter project details or achievements, one per line"
                    />
                  </div>
                  {project.description && (
                    <div className="md:col-span-2 mt-2">
                      <h4 className="text-sm font-medium text-gray-700 mb-2">
                        Project Details/Achievements Preview:
                      </h4>
                      <ul className="list-disc pl-5 space-y-1">
                        {descriptionToBulletPoints(project.description).map((item, idx) => (
                          <li key={idx} className="text-sm text-gray-600">
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {projects.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No projects added. Click the plus button to add a project.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
