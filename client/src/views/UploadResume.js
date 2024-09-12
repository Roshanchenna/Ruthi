import React, { useState } from "react";
import {
  Upload,
  Linkedin,
  FileText,
  User,
  CheckCircle,
  Briefcase,
  ArrowRight,
} from "lucide-react";

export default function Component() {
  const [file, setFile] = useState(null);
  const [linkedinUrl, setLinkedinUrl] = useState("");

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
    }
  };

  const handleLinkedinChange = (event) => {
    setLinkedinUrl(event.target.value);
  };

  const processSteps = [
    {
      icon: <User className="w-6 h-6" />,
      text: "Sign up and complete your profile: Upload your resume or connect your LinkedIn to get started quickly.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: "Take our tests and interviews: Showcase your skills through our tailored assessments.",
    },
    {
      icon: <Briefcase className="w-6 h-6" />,
      text: "Receive job offers or apply for jobs: Get matched with companies looking for your specific skill set.",
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      text: "Start working on your dream job! Begin your new career journey with confidence.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden max-w-6xl w-full">
        <div className="flex flex-col md:flex-row">
          {/* Left side - Resume Upload */}
          <div className="md:w-1/2 p-8 space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <FileText className="mr-2 text-orange-600" />
                Quick Profile Setup
              </h1>
              <p className="text-gray-600">
                Upload your resume or add your LinkedIn URL to get started.
              </p>
            </div>

            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-orange-600 transition-colors duration-300">
              <input
                type="file"
                id="file-upload"
                className="hidden"
                accept=".pdf,.doc,.docx"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center space-y-2"
              >
                <Upload className="w-12 h-12 text-orange-600" />
                <span className="text-orange-600 font-medium">
                  Drop resume or click to browse
                </span>
                <span className="text-sm text-gray-500">
                  PDF or DOC, max 5MB
                </span>
              </label>
            </div>

            <div className="flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="relative">
              <Linkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Your LinkedIn profile URL"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-between items-center">
              <button className="text-gray-600 hover:text-orange-600 font-medium" onClick={()=>{
                window.location.href="/profile"
              }}>
                Skip for now
              </button>
              <button className="bg-orange-400 text-white px-4 py-2 rounded-md hover:bg-orange-600 transition duration-300 flex items-center">
                Continue
                <ArrowRight className="ml-2 h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Right side - How it works */}
          <div className="md:w-1/2 bg-gray-50 p-8 flex items-center">
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                How it works
              </h2>
              <ul className="space-y-4">
                {[
                  "Upload your resume or LinkedIn profile",
                  "We'll extract your information automatically",
                  "Review and enhance your profile",
                  "Start applying for jobs!",
                ].map((step, index) => (
                  <li key={index} className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-semibold">
                      {index + 1}
                    </div>
                    <p className="text-gray-700">{step}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
