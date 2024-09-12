import { useRecoilState, useRecoilValue } from "recoil";
import {
  personalInformationState,
  socialsState,
} from "../../store/atoms/userProfileSate";
import { userProfileState } from "../../store/selectors/userProfileState";
import { IconUserCheck } from "@tabler/icons-react";
import { motion } from "framer-motion";
import { z } from "zod";
import { useState } from "react";

// Define the schema
const personalInfoSchema = z.object({
  first_name: z
    .string()
    .min(1, "First name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters are allowed"),
  last_name: z
    .string()
    .min(1, "Last name is required")
    .regex(/^[a-zA-Z\s]+$/, "Only letters are allowed"),
  email: z.string().email("Invalid email address"),
  phone: z.string().regex(/^\d{10}$/, "Phone number must be exactly 10 digits"),
  expected_salary: z
    .number()
    .min(1, "Expected salary must be at least 1")
    .max(99, "Expected salary must not exceed 99")
    .or(z.string().regex(/^[1-9][0-9]?$/, "Expected salary must be between 1 and 99")),
});

const socialsSchema = z.object({
  github: z.string().url("Invalid URL").optional().or(z.literal("")),
  linkedin: z.string().url("Invalid URL").optional().or(z.literal("")),
  twitter: z.string().url("Invalid URL").optional().or(z.literal("")),
  website: z.string().url("Invalid URL").optional().or(z.literal("")),
});

const BasicInformationForm = ({ errors: parentErrors }) => {
  const [personalInformation, setPersonalInformation] = useRecoilState(
    personalInformationState
  );
  const profileInformation = useRecoilValue(userProfileState);
  const [socials, setSocials] = useRecoilState(socialsState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedValue = value;
    
    // Special handling for expected_salary
    if (name === 'expected_salary') {
      updatedValue = value.replace(/^0+/, '').slice(0, 2); // Remove leading zeros and limit to 2 digits
    }
    
    setPersonalInformation({ ...personalInformation, [name]: updatedValue });
    validateField(name, updatedValue);
  };

  const handleSocialChange = (e) => {
    const { name, value } = e.target;
    setSocials({ ...socials, [name]: value });
    validateSocialField(name, value);
  };

  const validateField = (name, value) => {
    try {
      personalInfoSchema.shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: null }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
    }
  };

  const validateSocialField = (name, value) => {
    try {
      socialsSchema.shape[name].parse(value);
      setErrors((prev) => ({ ...prev, [name]: null }));
    } catch (error) {
      setErrors((prev) => ({ ...prev, [name]: error.errors[0].message }));
    }
  };

  return (
    <div className="container mx-auto p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="grid gap-6 md:grid-cols-2">
          {/* Basic Information Card */}
          <div className="bg-white shadow-md rounded-lg p-4">
            <div className="mb-3">
              <div className="flex items-center justify-start">
                <IconUserCheck className="p-2 bg-blue-200 rounded-full w-9 h-9 text-blue-600 text-lg" />
                <h1 className="text-lg font-semibold text-gray-800 text-center m-2">
                  Basic Information
                </h1>
              </div>
              <p className="text-sm text-gray-600">
                Please enter your personal details
              </p>
            </div>
            <div className="space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="firstName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="first_name"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.first_name ? "border-red-500" : "border-gray-300"
                    }`}
                    value={profileInformation.personal_information.first_name}
                    onChange={handleChange}
                  />
                  {errors.first_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.first_name}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="lastName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="last_name"
                    className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.last_name ? "border-red-500" : "border-gray-300"
                    }`}
                    value={profileInformation.personal_information.last_name}
                    onChange={handleChange}
                  />
                  {errors.last_name && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.last_name}
                    </p>
                  )}
                </div>
              </div>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm bg-gray-100 focus:outline-none ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                  value={
                    profileInformation.personal_information.email ||
                    "roshanchenna@gmail.com"
                  }
                  readOnly
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <div
                  className={`flex items-center border rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${
                    errors.phone ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <span className="px-3 py-2 bg-gray-100 border-r border-gray-300 rounded-l-md">
                    +91
                  </span>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 focus:outline-none rounded-r-md"
                    onChange={handleChange}
                    value={profileInformation.personal_information.phone}
                    maxLength={10}
                  />
                </div>
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
                <div>
                  <label
                    htmlFor="expectedSalary"
                    className="block text-sm font-medium text-gray-700 mb-1 mt-4"
                  >
                    Expected Salary(LPA) <span className="text-red-500">*</span>
                  </label>
                  <div
                    className={`flex items-center border rounded-md shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 ${
                      errors.expected_salary
                        ? "border-red-500"
                        : "border-gray-300"
                    }`}
                  >
                    <span className="px-3 py-2 bg-gray-100 border-r border-gray-300 rounded-l-md">
                      INR
                    </span>
                    <input
                      type="number"
                      id="expectedSalary"
                      name="expected_salary"
                      className="w-full px-3 py-2 focus:outline-none rounded-r-md"
                      onChange={handleChange}
                      value={
                        profileInformation.personal_information.expected_salary
                      }
                      min="1"
                      max="99"
                    />
                  </div>
                  {errors.expected_salary && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.expected_salary}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Social Media Card */}
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800">
                Social Media
              </h2>
              <p className="text-sm text-gray-600">
                Add your social media profiles
              </p>
            </div>
            <div className="space-y-3">
              <div>
                <label
                  htmlFor="github"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  GitHub
                </label>
                <input
                  type="url"
                  id="github"
                  name="github"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.github ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://github.com/username"
                  value={profileInformation.socials.github}
                  onChange={handleSocialChange}
                />
                {errors.github && (
                  <p className="text-red-500 text-xs mt-1">{errors.github}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="linkedin"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  LinkedIn
                </label>
                <input
                  type="url"
                  id="linkedin"
                  name="linkedin"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.linkedin ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://linkedin.com/in/username"
                  value={profileInformation.socials.linkedin}
                  onChange={handleSocialChange}
                />
                {errors.linkedin && (
                  <p className="text-red-500 text-xs mt-1">{errors.linkedin}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="twitter"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Twitter
                </label>
                <input
                  type="url"
                  id="twitter"
                  name="twitter"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.twitter ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://twitter.com/username"
                  value={profileInformation.socials.twitter}
                  onChange={handleSocialChange}
                />
                {errors.twitter && (
                  <p className="text-red-500 text-xs mt-1">{errors.twitter}</p>
                )}
              </div>
              <div>
                <label
                  htmlFor="website"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Website
                </label>
                <input
                  type="url"
                  id="website"
                  name="website"
                  className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.website ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="https://example.com"
                  value={profileInformation.socials.website}
                  onChange={handleSocialChange}
                />
                {errors.website && (
                  <p className="text-red-500 text-xs mt-1">{errors.website}</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default BasicInformationForm;
