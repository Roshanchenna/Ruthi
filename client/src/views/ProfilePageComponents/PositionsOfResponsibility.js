"use client";

import { useState, useRef, useEffect } from "react";
import { useRecoilState } from "recoil";
import { positionsOfResponsibilityState } from "../../store/atoms/userProfileSate";
import {
  Briefcase,
  Plus,
  Trash2,
  ChevronDown,
  ChevronUp,
  Building,
  Calendar,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";

const positionSchema = z.object({
  title: z.string()
    .min(1, "Title is required")
    .regex(/^(?=.*[a-zA-Z])/, "Title must contain at least one letter"),
  organization: z.string()
    .min(1, "Organization is required")
    .regex(/^(?=.*[a-zA-Z])/, "Organization must contain at least one letter"),
  start_date: z.string().min(1, "Start date is required"),
  end_date: z.string().optional(),
  description: z.string().optional(),
});

export default function PositionsOfResponsibility() {
  const [positions, setPositions] = useRecoilState(
    positionsOfResponsibilityState
  );
  const [expandedId, setExpandedId] = useState(null);
  const newItemRef = useRef(null);
  const [errors, setErrors] = useState({});

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const validateField = (field, value, index) => {
    try {
      positionSchema.shape[field].parse(value);
      setErrors(prev => ({...prev, [`${index}-${field}`]: null}));
    } catch (error) {
      setErrors(prev => ({...prev, [`${index}-${field}`]: error.errors[0].message}));
    }
  };

  const addPosition = () => {
    const newPosition = {
      id: Date.now(),
      title: "",
      organization: "",
      start_date: "",
      end_date: "",
      description: "",
    };
    setPositions([...positions, newPosition]);
    setTimeout(() => scrollToNewItem(), 100);
  };

  const removePosition = (id) => {
    setPositions(positions.filter((position) => position.id !== id));
  };

  const scrollToNewItem = () => {
    newItemRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleInputChange = (index, field, value) => {
    const updatedPositions = positions.map((pos, i) =>
      i === index ? { ...pos, [field]: value } : pos
    );
    setPositions(updatedPositions);
    validateField(field, value, index);

    // Additional validation for end date
    if (field === 'end_date') {
      const currentPosition = updatedPositions[index];
      if (currentPosition.start_date && new Date(value) < new Date(currentPosition.start_date)) {
        setErrors(prev => ({...prev, [`${index}-${field}`]: "End date must be after start date"}));
      }
    }
  };

  const descriptionToBulletPoints = (description) => {
    if (typeof description !== "string") return [];
    return description.split("\n").filter((point) => point.trim() !== "");
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
              <Briefcase className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">
                Positions of Responsibility
              </h2>
            </div>
            <button
              onClick={addPosition}
              className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full"
              aria-label="Add position"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {positions.map((position, index) => (
              <div
                key={position.id}
                ref={index === positions.length - 1 ? newItemRef : null}
                className="border border-gray-200 rounded-md overflow-hidden"
              >
                <div className="p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={() => toggleExpand(position.id)}
                      className="flex items-center space-x-2 text-left focus:outline-none"
                      aria-expanded={expandedId === position.id}
                    >
                      {expandedId === position.id ? (
                        <ChevronUp className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-500" />
                      )}
                      <span className="font-medium">
                        {position.title || "Untitled Position"}
                      </span>
                    </button>
                    <button
                      onClick={() => removePosition(position.id)}
                      className="text-red-500 hover:text-red-700"
                      aria-label="Remove position"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <AnimatePresence>
                  {expandedId === position.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="p-4 border-t border-gray-200">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor={`position-title-${position.id}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Title
                            </label>
                            <input
                              type="text"
                              id={`position-title-${position.id}`}
                              value={position.title}
                              onChange={(e) => handleInputChange(index, "title", e.target.value)}
                              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors[`${index}-title`] ? "border-red-500" : "border-gray-300"
                              }`}
                            />
                            {errors[`${index}-title`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`${index}-title`]}</p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor={`position-organization-${position.id}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Organization
                            </label>
                            <input
                              type="text"
                              id={`position-organization-${position.id}`}
                              value={position.organization}
                              onChange={(e) => handleInputChange(index, "organization", e.target.value)}
                              className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                                errors[`${index}-organization`] ? "border-red-500" : "border-gray-300"
                              }`}
                            />
                            {errors[`${index}-organization`] && (
                              <p className="text-red-500 text-xs mt-1">{errors[`${index}-organization`]}</p>
                            )}
                          </div>
                          <div>
                            <label
                              htmlFor={`position-start-date-${position.id}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Start Date
                            </label>
                            <input
                              type="date"
                              id={`position-start-date-${position.id}`}
                              value={position.start_date}
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
                              htmlFor={`position-end-date-${position.id}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              End Date
                            </label>
                            <input
                              type="date"
                              id={`position-end-date-${position.id}`}
                              value={position.end_date}
                              min={position.start_date}
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
                              htmlFor={`position-description-${position.id}`}
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Responsibilities (one per line)
                            </label>
                            <textarea
                              id={`position-description-${position.id}`}
                              value={position.description}
                              onChange={(e) => handleInputChange(index, "description", e.target.value)}
                              rows={3}
                              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              placeholder="Enter responsibilities, one per line"
                            />
                          </div>
                          {position.description && (
                            <div className="md:col-span-2">
                              <h4 className="text-sm font-medium text-gray-700 mb-2">
                                Responsibilities Preview:
                              </h4>
                              <ul className="list-disc pl-5 space-y-1">
                                {descriptionToBulletPoints(
                                  position.description
                                ).map((point, index) => (
                                  <li
                                    key={index}
                                    className="text-sm text-gray-600"
                                  >
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
            {positions.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No positions added. Click the plus button to add a position.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
