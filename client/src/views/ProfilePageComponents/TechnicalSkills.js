'use client'

import { useState, useEffect, useRef } from "react"
import { PlusIcon, TrashIcon, ChevronDownIcon, SearchIcon } from "lucide-react"
import { useRecoilState } from "recoil"
import { skillsState } from "../../store/atoms/userProfileSate"
import { IconDeviceDesktop } from "@tabler/icons-react"
import { motion } from "framer-motion"

const initialSkills = [
  "JavaScript", "Python", "Java", "C++", "Ruby", "Go", "Rust",
  "React", "Angular", "Vue", "Node.js", "Express", "Django", "Flask",
  "MongoDB", "PostgreSQL", "MySQL", "Redis", "Elasticsearch",
  "Docker", "Kubernetes", "AWS", "Azure", "GCP", "Git", "CI/CD"
]

const proficiencyLevels = ["Beginner", "Intermediate", "Advanced", "Expert"]

export default function SkillsDropdown() {
  const [skills, setSkills] = useRecoilState(skillsState)
  const [availableSkills, setAvailableSkills] = useState(initialSkills)
  const [selectedSkill, setSelectedSkill] = useState("")
  const [customSkill, setCustomSkill] = useState("")
  const [selectedProficiency, setSelectedProficiency] = useState("")
  const [isProficiencyDropdownOpen, setIsProficiencyDropdownOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isSkillsDropdownOpen, setIsSkillsDropdownOpen] = useState(false)
  const skillsDropdownRef = useRef(null)
  const customSkillInputRef = useRef(null)

  useEffect(() => {
    // Remove any skills with empty name or proficiency
    setSkills(prevSkills => prevSkills.filter(skill => skill.skill_name && skill.skill_proficiency))
  }, [])

  useEffect(() => {
    // Filter out selected skills from availableSkills
    const selectedSkillNames = skills.map(skill => skill.skill_name)
    setAvailableSkills(initialSkills.filter(skill => !selectedSkillNames.includes(skill)))
  }, [skills])

  const filteredSkills = availableSkills.filter(skill =>
    skill.toLowerCase().includes(searchTerm.toLowerCase())
  )

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (skillsDropdownRef.current && !skillsDropdownRef.current.contains(event.target)) {
        setIsSkillsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const addSkill = () => {
    if ((selectedSkill && selectedSkill !== "Other" && selectedProficiency) || 
        (customSkill && selectedSkill === "Other" && selectedProficiency)) {
      const newSkillName = selectedSkill === "Other" ? customSkill : selectedSkill
      if (!skills.some(skill => skill.skill_name.toLowerCase() === newSkillName.toLowerCase())) {
        const newSkill = {
          skill_name: newSkillName,
          skill_proficiency: selectedProficiency,
        }
        setSkills(prev => [...prev, newSkill])
        setSelectedSkill("")
        setSelectedProficiency("")
        setCustomSkill("")
        setSearchTerm("")
        
        // Remove the skill from availableSkills
        if (selectedSkill !== "Other") {
          setAvailableSkills(prev => prev.filter(skill => skill !== selectedSkill))
        }
      }
    }
  }

  useEffect(() => {
    if (selectedSkill && selectedProficiency) {
      addSkill()
    }
  }, [selectedProficiency])

  const removeSkill = (index) => {
    const removedSkill = skills[index]
    setSkills(prev => prev.filter((_, i) => i !== index))
    
    // Add the skill back to availableSkills if it's not a custom skill
    if (initialSkills.includes(removedSkill.skill_name)) {
      setAvailableSkills(prev => [...prev, removedSkill.skill_name].sort())
    }
  }

  const handleSkillSelect = (skill) => {
    setSelectedSkill(skill)
    setIsSkillsDropdownOpen(false)
    if (skill === "Other") {
      setTimeout(() => {
        customSkillInputRef.current?.focus()
      }, 0)
    } else {
      setIsProficiencyDropdownOpen(true)
    }
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
      <div className="bg-white shadow-xl rounded-lg p-6 mb-8">
        <div className="flex items-center justify-start mb-4">
          <IconDeviceDesktop className="p-2 bg-blue-200 rounded-full w-9 h-9 text-blue-600 text-lg" />
          <h1 className="text-lg font-semibold text-gray-800 text-center m-2">
            Skills
          </h1>
        </div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Add Skills
        </h2>

        <div className="flex flex-wrap items-center gap-4">
          <div className="w-full sm:w-64 relative" ref={skillsDropdownRef}>
            <div className="relative">
              <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={selectedSkill || searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setSelectedSkill("")
                  setIsSkillsDropdownOpen(true)
                }}
                onFocus={() => setIsSkillsDropdownOpen(true)}
                placeholder="Search skills..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            {isSkillsDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {availableSkills
                  .filter(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((skill) => (
                    <div
                      key={skill}
                      className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 transition duration-150 ease-in-out"
                      onClick={() => handleSkillSelect(skill)}
                    >
                      {skill}
                    </div>
                  ))}
                <div
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 transition duration-150 ease-in-out"
                  onClick={() => handleSkillSelect("Other")}
                >
                  Other
                </div>
              </div>
            )}
          </div>
          {selectedSkill === "Other" && (
            <div className="w-full sm:w-64">
              <input
                type="text"
                ref={customSkillInputRef}
                value={customSkill}
                onChange={(e) => setCustomSkill(e.target.value)}
                placeholder="Enter custom skill"
                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
              />
            </div>
          )}
          <div className="w-full sm:w-64 relative">
            <button
              type="button"
              onClick={() => setIsProficiencyDropdownOpen(!isProficiencyDropdownOpen)}
              className="w-full px-4 py-2 text-left bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-150 ease-in-out"
            >
              {selectedProficiency || "Select proficiency"}
              <ChevronDownIcon className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            </button>
            {isProficiencyDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
                {proficiencyLevels.map((level) => (
                  <div
                    key={level}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 transition duration-150 ease-in-out"
                    onClick={() => {
                      setSelectedProficiency(level)
                      setIsProficiencyDropdownOpen(false)
                      if (selectedSkill) {
                        addSkill()
                      }
                    }}
                  >
                    {level}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-xl rounded-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Your Skills
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {skills.filter(skill => skill.skill_name && skill.skill_proficiency).map((skill, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 shadow-md transition-all duration-200 hover:shadow-lg hover:scale-105"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-700">{skill.skill_name}</h3>
                  <p className="text-sm text-blue-600 font-medium">
                    {skill.skill_proficiency}
                  </p>
                </div>
                <button
                  onClick={() => removeSkill(index)}
                  className="text-red-500 hover:text-red-700 focus:outline-none transition-colors duration-200"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </motion.div>
    </div>
  )
}