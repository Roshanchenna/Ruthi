"use client";

import { useState, useRef, useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  educationState,
  coursesState,
} from "../../store/atoms/userProfileSate";
import { GraduationCap, BookOpen, Plus, Trash2 } from "lucide-react";
import { IconBook } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { z } from "zod";

const educationSchema = z.object({
  institution: z.string()
    .min(1, "Institution is required")
    .regex(/^[a-zA-Z\s.,'-]+$/, "Institution should only contain letters, spaces, and common punctuation"),
  degree: z.string()
    .min(1, "Degree is required")
    .regex(/^[a-zA-Z\s.,'-]+$/, "Degree should only contain letters, spaces, and common punctuation"),
  start_date: z.string().refine(
    (date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      const seventyYearsAgo = new Date(today.getFullYear() - 70, today.getMonth(), today.getDate());
      return selectedDate >= seventyYearsAgo && selectedDate <= today;
    },
    { message: "Start date must be within the last 70 years and not in the future" }
  ),
  end_date: z.string().refine(
    (date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      return selectedDate <= today;
    },
    { message: "End date cannot be in the future" }
  ).optional(),
  cgpa_or_percentage: z.string().regex(/^(\d{1,2}(\.\d{1,2})?|100)$/, "Invalid CGPA or percentage"),
  description: z.string().optional(),
});

const courseSchema = z.object({
  course_name: z.string()
    .min(1, "Course name is required")
    .regex(/^(?=.*[a-zA-Z])[a-zA-Z0-9\s.,'-]+$/, "Course name must contain at least one letter and can include letters, numbers, spaces, and common punctuation"),
  course_provider: z.string()
    .min(1, "Course provider is required")
    .regex(/^[a-zA-Z\s.,'-]+$/, "Course provider should only contain letters, spaces, and common punctuation"),
  completion_date: z.string().refine(
    (date) => {
      const selectedDate = new Date(date);
      const today = new Date();
      const seventyYearsAgo = new Date(today.getFullYear() - 70, today.getMonth(), today.getDate());
      return selectedDate >= seventyYearsAgo && selectedDate <= today;
    },
    { message: "Completion date must be within the last 70 years and not in the future" }
  ),
  course_link: z.string().url("Invalid URL").or(z.literal("")),
});

export default function Education() {
  const [educations, setEducations] = useRecoilState(educationState);
  const [courses, setCourses] = useRecoilState(coursesState);
  const [activeTab, setActiveTab] = useState("education");
  const newItemRef = useRef(null);
  const [errors, setErrors] = useState({});

  const validateField = (schema, field, value) => {
    try {
      schema.shape[field].parse(value);
      return null;
    } catch (error) {
      return error.errors[0].message;
    }
  };

  const handleEducationChange = (index, field, value) => {
    const updatedEducations = educations.map((edu, i) =>
      i === index ? { ...edu, [field]: value } : edu
    );
    setEducations(updatedEducations);

    const error = validateField(educationSchema, field, value);
    setErrors(prev => ({
      ...prev,
      [`education-${index}-${field}`]: error
    }));

    if (field === 'end_date' && updatedEducations[index].start_date) {
      if (new Date(value) < new Date(updatedEducations[index].start_date)) {
        setErrors(prev => ({
          ...prev,
          [`education-${index}-${field}`]: "End date must be after start date"
        }));
      }
    }
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = courses.map((course, i) =>
      i === index ? { ...course, [field]: value } : course
    );
    setCourses(updatedCourses);

    const error = validateField(courseSchema, field, value);
    setErrors(prev => ({
      ...prev,
      [`course-${index}-${field}`]: error
    }));
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      institution: "",
      degree: "",
      start_date: "",
      end_date: "",
      cgpa_or_percentage: "",
      description: "",
    };
    setEducations([...educations, newEducation]);
    setTimeout(() => scrollToNewItem(), 100);
  };

  const addCourse = () => {
    const newCourse = {
      id: Date.now(),
      course_name: "",
      course_provider: "",
      completion_date: "",
      course_link: "",
    };
    setCourses([...courses, newCourse]);
    setTimeout(() => scrollToNewItem(), 100);
  };

  const removeEducation = (id) => {
    if (educations.length > 1) {
      setEducations(educations.filter((edu) => edu.id !== id));
    }
  };

  const removeCourse = (id) => {
    setCourses(courses.filter((course) => course.id !== id));
  };

  const scrollToNewItem = () => {
    newItemRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const descriptionToBulletPoints = (description) => {
    if (!description || typeof description !== 'string') {
      return [];
    }
    return description.split('\n').filter(point => point.trim() !== '');
  };

  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const getDateLimit = () => {
    const today = new Date();
    const seventyYearsAgo = new Date(today.getFullYear() - 70, today.getMonth(), today.getDate());
    return seventyYearsAgo.toISOString().split('T')[0];
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
            <div className="flex space-x-4">
              <button
                onClick={() => setActiveTab("education")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                  activeTab === "education"
                    ? "bg-blue-100 text-blue-600"
                    : "text-black hover:bg-blue-50"
                }`}
              >
                <GraduationCap className="w-6 h-6 rounded-full" />
                <span>Education</span>
              </button>
              <button
                onClick={() => setActiveTab("courses")}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
                  activeTab === "courses"
                    ? "bg-blue-100 text-blue-600"
                    : "text-black hover:bg-blue-50"
                }`}
              >
                <BookOpen className="w-5 h-5" />
                <span>Courses</span>
              </button>
            </div>
            <button
              onClick={activeTab === "education" ? addEducation : addCourse}
              className="p-2 bg-blue-100 text-blue-600 hover:bg-blue-200 rounded-full"
              aria-label={`Add ${
                activeTab === "education" ? "education" : "course"
              }`}
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>

          {activeTab === "education" && (
            <div className="space-y-4">
              {educations.map((education, index) => (
                <div
                  key={education.id}
                  ref={index === educations.length - 1 ? newItemRef : null}
                  className="p-4 border border-gray-200 rounded-md relative"
                >
                  {educations.length > 1 && (
                    <button
                      onClick={() => removeEducation(education.id)}
                      className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                      aria-label="Remove education"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`institute-${education.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Institute Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={`institute-${education.id}`}
                        value={education.institution}
                        onChange={(e) => handleEducationChange(index, "institution", e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`education-${index}-institution`] ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                      {errors[`education-${index}-institution`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`education-${index}-institution`]}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor={`degree-${education.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Degree <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={`degree-${education.id}`}
                        value={education.degree}
                        onChange={(e) => handleEducationChange(index, "degree", e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`education-${index}-degree`] ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                      {errors[`education-${index}-degree`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`education-${index}-degree`]}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor={`start-date-${education.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id={`start-date-${education.id}`}
                        value={education.start_date}
                        min={getDateLimit()}
                        max={getCurrentDate()}
                        onChange={(e) => handleEducationChange(index, "start_date", e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`education-${index}-start_date`] ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                      {errors[`education-${index}-start_date`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`education-${index}-start_date`]}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor={`end-date-${education.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        End Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        id={`end-date-${education.id}`}
                        value={education.end_date}
                        min={education.start_date}
                        max={getCurrentDate()}
                        onChange={(e) => handleEducationChange(index, "end_date", e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`education-${index}-end_date`] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors[`education-${index}-end_date`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`education-${index}-end_date`]}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor={`cgpa-or-percentage-${education.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        CGPA/Percentage <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        id={`cgpa-or-percentage-${education.id}`}
                        value={education.cgpa_or_percentage}
                        onChange={(e) => handleEducationChange(index, "cgpa_or_percentage", e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`education-${index}-cgpa_or_percentage`] ? "border-red-500" : "border-gray-300"
                        }`}
                        required
                      />
                      {errors[`education-${index}-cgpa_or_percentage`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`education-${index}-cgpa_or_percentage`]}</p>
                      )}
                    </div>
                    <div className="md:col-span-2">
                      <label
                        htmlFor={`description-${education.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Description
                      </label>
                      <textarea
                        id={`description-${education.id}`}
                        value={education.description || ''}
                        onChange={(e) => handleEducationChange(index, "description", e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Enter description, one per line"
                      />
                    </div>
                    {education.description && (
                      <div className="md:col-span-2 mt-2">
                        <h4 className="text-sm font-medium text-gray-700 mb-2">
                          Description Preview:
                        </h4>
                        <ul className="list-disc pl-5 space-y-1">
                          {descriptionToBulletPoints(education.description).map((point, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === "courses" && (
            <div className="space-y-4">
              {courses.map((course, index) => (
                <div
                  key={course.id}
                  ref={index === courses.length - 1 ? newItemRef : null}
                  className="p-4 border border-gray-200 rounded-md relative"
                >
                  <button
                    onClick={() => removeCourse(course.id)}
                    className="absolute top-2 right-2 text-red-500 hover:text-red-700"
                    aria-label="Remove course"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor={`course-name-${course.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Course Name
                      </label>
                      <input
                        type="text"
                        id={`course-name-${course.id}`}
                        value={course.course_name}
                        onChange={(e) => handleCourseChange(index, "course_name", e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`course-${index}-course_name`] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors[`course-${index}-course_name`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`course-${index}-course_name`]}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor={`provider-${course.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Provider
                      </label>
                      <input
                        type="text"
                        id={`provider-${course.id}`}
                        value={course.course_provider}
                        onChange={(e) => handleCourseChange(index, "course_provider", e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`course-${index}-course_provider`] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors[`course-${index}-course_provider`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`course-${index}-course_provider`]}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor={`completion-date-${course.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Completion Date
                      </label>
                      <input
                        type="date"
                        id={`completion-date-${course.id}`}
                        value={course.completion_date}
                        min={getDateLimit()}
                        max={getCurrentDate()}
                        onChange={(e) => handleCourseChange(index, "completion_date", e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`course-${index}-completion_date`] ? "border-red-500" : "border-gray-300"
                        }`}
                      />
                      {errors[`course-${index}-completion_date`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`course-${index}-completion_date`]}</p>
                      )}
                    </div>
                    <div>
                      <label
                        htmlFor={`course-link-${course.id}`}
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Course Link
                      </label>
                      <input
                        type="url"
                        id={`course-link-${course.id}`}
                        value={course.course_link}
                        onChange={(e) => handleCourseChange(index, "course_link", e.target.value)}
                        className={`w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                          errors[`course-${index}-course_link`] ? "border-red-500" : "border-gray-300"
                        }`}
                        placeholder="https://example.com/course"
                      />
                      {errors[`course-${index}-course_link`] && (
                        <p className="text-red-500 text-xs mt-1">{errors[`course-${index}-course_link`]}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              {courses.length === 0 && (
                <div className="text-center text-gray-500 py-4">
                  No courses added. Click the plus button to add a course.
                </div>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
