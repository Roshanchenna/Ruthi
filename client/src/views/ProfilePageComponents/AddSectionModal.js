import React from 'react';

const allSections = [
  "Publications",
  "Personal Projects",
  "Awards and Achievements",
  "Positions of Responsibility",
  "Competitions",
  "Extra-curricular Activities"
];

export default function AddSectionModal({ isOpen, onClose, onAddSection, selectedSections = [], setSelectedSection }) {
  if (!isOpen) return null;

  const availableSections = allSections.filter(section => !selectedSections?.includes(section));

  const handleAddSection = (section) => {
    onAddSection(section);
    onClose();
    setSelectedSection(section); // Immediately set the selected section to the newly added one
  };

  const handleShowOverview = () => {
    onClose();
    setSelectedSection("Overview");
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-2">Additional Profile Sections</h2>
        {availableSections.length > 0 ? (
          <>
            <p className="mb-2">
              Add extra sections or proceed to overview. Your call!
            </p>
            <div className="space-y-1 mb-2 max-h-70 overflow-y-auto">
              {availableSections.map((section) => (
                <button
                  key={section}
                  onClick={() => handleAddSection(section)}
                  className="w-full text-left px-4 py-2 rounded-md hover:bg-gray-100 transition duration-150 ease-in-out"
                >
                  {section}
                </button>
              ))}
            </div>
          </>
        ) : (
          <p className="mb-4">You've added all available sections to your profile.</p>
        )}
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-150 ease-in-out"
          >
            Cancel
          </button>
          <button
            onClick={handleShowOverview}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150 ease-in-out"
          >
            Go to Overview
          </button>
        </div>
      </div>
    </div>
  );
}