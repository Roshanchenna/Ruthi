'use client';

import { useState, useRef, useEffect } from "react";
import { useRecoilState } from "recoil";
import { publicationsState } from "../../store/atoms/userProfileSate";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import { z } from "zod";
  
const publicationSchema = z.object({
  name: z.string()
    .min(1, "Publication name is required")
    .regex(/^(?=.*[a-zA-Z])/, "Publication name must contain at least one letter"),
  link: z.string().url("Invalid URL").or(z.literal("")),
  date: z.string().refine(
    (date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      return selectedDate <= today;
    },
    { message: "Publication date cannot be in the future" }
  ),
});

export default function Publications() {
  const [publications, setPublications] = useRecoilState(publicationsState);
  const newItemRef = useRef(null);
  const [errors, setErrors] = useState({});

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  };

  const validateField = (field, value, index) => {
    try {
      publicationSchema.shape[field].parse(value);
      setErrors(prev => ({...prev, [`${index}-${field}`]: null}));
    } catch (error) {
      setErrors(prev => ({...prev, [`${index}-${field}`]: error.errors[0].message}));
    }
  };

  const addPublication = () => {
    const newPublication = {
      id: Date.now(),
      name: "",
      link: "",
      date: "",
    };
    setPublications([...publications, newPublication]);
    setTimeout(() => scrollToNewItem(), 100);
  };

  const removePublication = (id) => {
    setPublications(publications.filter((publication) => publication.id !== id));
  };

  const scrollToNewItem = () => {
    newItemRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleInputChange = (index, field, value) => {
    const updatedPublications = publications.map((pub, i) =>
      i === index ? { ...pub, [field]: value } : pub
    );
    setPublications(updatedPublications);
    validateField(field, value, index);
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
              <BookOpen className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-semibold">Publications</h2>
            </div>
            <button
              onClick={addPublication}
              className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full"
              aria-label="Add publication"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            {publications.map((publication, index) => (
              <div
                key={publication.id}
                ref={index === publications.length - 1 ? newItemRef : null}
                className="p-4 border border-gray-200 rounded-md relative"
              >
                <button
                  onClick={() => removePublication(publication.id)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                  aria-label="Remove publication"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={`publication-name-${publication.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Publication Name
                    </label>
                    <input
                      type="text"
                      id={`publication-name-${publication.id}`}
                      value={publication.name}
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
                      htmlFor={`publication-link-${publication.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Publication Link
                    </label>
                    <input
                      type="url"
                      id={`publication-link-${publication.id}`}
                      value={publication.link}
                      onChange={(e) => handleInputChange(index, "link", e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`${index}-link`] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[`${index}-link`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${index}-link`]}</p>
                    )}
                  </div>
                  <div className="md:col-span-2">
                    <label
                      htmlFor={`publication-date-${publication.id}`}
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Publication Date
                    </label>
                    <input
                      type="date"
                      id={`publication-date-${publication.id}`}
                      value={publication.date}
                      max={getCurrentDate()}
                      onChange={(e) => handleInputChange(index, "date", e.target.value)}
                      className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors[`${index}-date`] ? "border-red-500" : "border-gray-300"
                      }`}
                    />
                    {errors[`${index}-date`] && (
                      <p className="text-red-500 text-xs mt-1">{errors[`${index}-date`]}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {publications.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                No publications added. Click the plus button to add a publication.
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
}