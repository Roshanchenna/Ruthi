import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { PlusIcon, XIcon } from 'lucide-react'
import { Trash2 } from 'react-feather'
import { IconAward } from '@tabler/icons-react'
import { useRecoilState } from 'recoil'
import { awardsAndAchievementsState } from '../../store/atoms/userProfileSate'
import { z } from 'zod'

const awardSchema = z.string()
  .min(1, "Award name is required")
  .regex(/^(?=.*[a-zA-Z])/, "Award name must contain at least one letter")
  .max(100, "Award name must be 100 characters or less");

export default function AwardsAndAchievements() {
  const [awards, setAwards] = useRecoilState(awardsAndAchievementsState)
  const [newAward, setNewAward] = useState('')
  const [error, setError] = useState(null)

  const validateAward = (award) => {
    try {
      awardSchema.parse(award);
      return null;
    } catch (error) {
      return error.errors[0].message;
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setNewAward(value);
    const validationError = validateAward(value);
    setError(validationError);
  };

  const handleSubmit = (e) => {
    e.preventDefault()
    const validationError = validateAward(newAward);
    if (validationError) {
      setError(validationError);
      return;
    }
    if (newAward.trim()) {
      setAwards([...awards, newAward.trim()])
      setNewAward('')
      setError(null)
    }
  }

  const removeAward = (index) => {
    setAwards(awards.filter((_, i) => i !== index))
  }

  return (
    <div className="flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full lg:max-w-2xl md:max-w-xl sm:max-w-md"
      >
        <div className="flex items-center justify-start mb-4">
          <IconAward className="p-2 bg-blue-200 rounded-full w-9 h-9 text-blue-600 text-lg" />
          <h1 className="text-lg font-semibold text-gray-800 text-center m-2">
            Awards and Achievements
          </h1>
        </div>      
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={newAward}
              onChange={handleInputChange}
              className={`flex-grow px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                error ? "border-red-500" : "border-gray-300"
              }`}
              aria-label="New award"
              placeholder="Enter award or achievement"
            />
            <button
              type="submit"
              className="bg-orange-500 text-white p-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
              aria-label="Add award"
              disabled={!!error}
            >
              <PlusIcon className="w-5 h-5" />
            </button>
          </div>
          {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
        </form>

        <div className="max-h-[60vh] overflow-y-auto">
          <AnimatePresence>
            {awards.length > 0 ? (
              <ul className="space-y-3">
                {awards.map((award, index) => (
                  <motion.li 
                    key={index}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between bg-gray-50 px-3 py-2 rounded-md"
                  >
                    <span className="text-gray-700">{award}</span>
                    <button
                      onClick={() => removeAward(index)}
                      className="text-red-500 hover:text-red-700 focus:outline-none"
                      aria-label={`Remove ${award}`}
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </motion.li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-center">No awards or achievements added yet.</p>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}