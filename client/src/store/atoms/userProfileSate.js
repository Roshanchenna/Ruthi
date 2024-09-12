import { atom } from "recoil";

// Atom for personal information
export const personalInformationState = atom({
  key: "personalInformationState",
  default: {
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
  },
});

// Atom for socials
export const socialsState = atom({
  key: "socialsState",
  default: {
    github: "",
    linkedin: "",
    twitter: "",
    website: "",
  },
});

// Atom for courses
export const coursesState = atom({
  key: "coursesState",
  default: [
    {
      course_name: "",
      course_link: "",
      course_provider: "",
      completion_date: "",
    },
  ],
});

// Atom for education
export const educationState = atom({
  key: "educationState",
  default: [
    {
      institution: "",
      degree: "",
      start_date: "",
      end_date: "",
      cgpa_or_percentage: "",
      description:[],
    },
  ],
});

// Atom for experience
export const experienceState = atom({
  key: "experienceState",
  default: [],
});

// Atom for publications
export const publicationsState = atom({
  key: "publicationsState",
  default: [
    {
      name: "",
      link: "",
      date: "",
    },
  ],
});

// Atom for skills
export const skillsState = atom({
  key: "skillsState",
  default: [
    {
      skill_name: "",
      skill_proficiency: "",
    },
  ],
});

// Atom for personal projects
export const personalProjectsState = atom({
  key: "personalProjectsState",
  default: [
    {
      name: "",
      description: [],
      link: "",
      start_date: "",
      end_date: "",
      description:[]
    },
  ],
});

// Atom for awards and achievements
export const awardsAndAchievementsState = atom({
  key: "awardsAndAchievementsState",
  default: [],
});

// Atom for positions of responsibility
export const positionsOfResponsibilityState = atom({
  key: "positionsOfResponsibilityState",
  default: [],
});

// Atom for competitions
export const competitionsState = atom({
  key: "competitionsState",
  default: [],
});

// Atom for extracurricular activities
export const extracurricularActivitiesState = atom({
  key: "extracurricularActivitiesState",
  default: [],
});
