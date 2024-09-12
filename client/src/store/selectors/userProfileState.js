import {selector} from 'recoil';
import {
    personalInformationState,
    socialsState,
    coursesState,
    educationState,
    experienceState,
    publicationsState,
    skillsState,
    personalProjectsState,
    awardsAndAchievementsState,
    positionsOfResponsibilityState,
    competitionsState,
    extracurricularActivitiesState,
} from '../atoms/userProfileSate';

export const userProfileState = selector({
    key: 'userProfileState',
    get: ({get}) => {
      const personalInformation = get(personalInformationState);
      const socials = get(socialsState);
      const courses = get(coursesState);
      const education = get(educationState);
      const experience = get(experienceState);
      const publications = get(publicationsState);
      const skills = get(skillsState);
      const personalProjects = get(personalProjectsState);
      const awardsAndAchievements = get(awardsAndAchievementsState);
      const positionsOfResponsibility = get(positionsOfResponsibilityState);
      const competitions = get(competitionsState);
      const extracurricularActivities = get(extracurricularActivitiesState);
  
      return {
        personal_information: personalInformation,
        socials,
        courses,
        education,
        experience,
        publications,
        skills,
        personal_projects: personalProjects,
        awards_and_achievements: awardsAndAchievements,
        position_of_responsibility: positionsOfResponsibility,
        competitions,
        extra_curricular_activities: extracurricularActivities
      };
    }
  });
  