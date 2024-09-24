import React, { useEffect, useState, useCallback } from "react";
import {
  IconUser,
  IconBriefcase,
  IconSchool,
  IconCode,
  IconAward,
  IconCertificate,
  IconTrophy,
  IconHeart,
  IconBrandGithub,
  IconBrandLinkedin,
  IconMail,
  IconPhone
} from '@tabler/icons-react';
import {Rocket, BookOpen} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import { useRecoilState,useRecoilValue,useSetRecoilState } from 'recoil';
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
  extracurricularActivitiesState
} from '../../store/atoms/userProfileSate';

const SectionTitle = ({ title, icon }) => (
  <h2 className="text-lg font-bold text-gray-800 border-b pb-2 mb-3 flex items-center">
    {icon}
    <span className="ml-2">{title}</span>
  </h2>
);

const Section = ({ title, children, isEmpty, icon }) => {
  if (isEmpty) return null;
  return (
    <section className="mb-6">
      <SectionTitle title={title} icon={icon} />
      {children}
    </section>
  );
};

const ResumePage = ({ content }) => (
  <div className="bg-white shadow-lg p-4 mx-auto my-2 max-w-4xl w-full text-sm">
    {content}
  </div>
);

const isValidData = (data) => {
  if (data == null) {
    return false;
  }
  if (Array.isArray(data)) {
    return data.length > 0 && data.some(item => 
      item != null && Object.entries(item).some(([key, value]) => 
        value !== null && 
        value !== undefined && 
        value !== '' && 
        (typeof value !== 'object' || (Array.isArray(value) && value.length > 0) || Object.keys(value).length > 0)
      )
    );
  }
  if (typeof data === 'object') {
    return Object.values(data).some(value => 
      value !== null && 
      value !== undefined && 
      value !== '' && 
      (typeof value !== 'object' || (Array.isArray(value) && value.length > 0) || Object.keys(value).length > 0)
    );
  }
  return data !== null && data !== undefined && data !== '';
};

const hasAnyData = (profile) => {
  if (!profile || typeof profile !== 'object') {
    return false;
  }
  return Object.values(profile).some(isValidData);
};

export default function Resume() {
  const [personalInfo, setPersonalInfo] = useRecoilState(personalInformationState);
  const [socials, setSocials] = useRecoilState(socialsState);
  // const [courses, setCourses] = useRecoilState(coursesState);
  const courses = useRecoilValue(coursesState);
  const setCourses = useSetRecoilState(coursesState);

  const [education, setEducation] = useRecoilState(educationState);
  const [experience, setExperience] = useRecoilState(experienceState);
  const [publications, setPublications] = useRecoilState(publicationsState);
  const [skills, setSkills] = useRecoilState(skillsState);
  const [personalProjects, setPersonalProjects] = useRecoilState(personalProjectsState);
  const [awardsAndAchievements, setAwardsAndAchievements] = useRecoilState(awardsAndAchievementsState);
  const [positionsOfResponsibility, setPositionsOfResponsibility] = useRecoilState(positionsOfResponsibilityState);
  const [competitions, setCompetitions] = useRecoilState(competitionsState);
  const [extracurricularActivities, setExtracurricularActivities] = useRecoilState(extracurricularActivitiesState);

  const [isLoading, setIsLoading] = useState(true);
  const [profileExists, setProfileExists] = useState(false);
  const [hasAttemptedFetch, setHasAttemptedFetch] = useState(false);
  const navigate = useNavigate();
  var { fetchUserInfo, userInfo } = useAuth();
  const [hasLocalChanges, setHasLocalChanges] = useState(false);

  const fetchUserInfoAndProfile = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate("/login");
      return;
    }

    setIsLoading(true);
    try {
      await fetchUserInfo(token);
      if (userInfo && userInfo._id) {
        const response = await axios.get(`http://localhost:3004/api/user-profile/${userInfo._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        console.log(response.data);
        
        // Update states with fetched data
        setPersonalInfo(prevState => ({
          ...prevState,
          ...response.data.personal_information
        }));
        setSocials(prevState => ({
          ...prevState,
          ...response.data.socials
        }));
        // setCourses(response.data.courses || []);
        setEducation(response.data.education || []);
        setExperience(response.data.experience || []);
        setPublications(response.data.publications || []);
        setSkills(response.data.skills || []);
        setPersonalProjects(response.data.personal_projects || []);
        setAwardsAndAchievements(response.data.awards_and_achievements || []);
        setPositionsOfResponsibility(response.data.positions_of_responsibility || []);
        setCompetitions(response.data.competitions || []);
        setExtracurricularActivities(response.data.extracurricular_activities || []);

        setProfileExists(true);
      }
    } catch (error) {
      console.error('Error fetching user info or profile:', error);
      if (error.response && error.response.status === 404) {
        console.log('User profile not found. New user can create their profile.');
        // Initialize all states with default values
        // setPersonalInfo({
        //   ...personalInformationState.default,
        //   first_name: userInfo?.first_name || '',
        //   last_name: userInfo?.last_name || '',
        //   email: userInfo?.email || ''
        // });
        // setSocials(socialsState);
        // setCourses(coursesState);
        // setEducation(educationState);
        // setExperience(experienceState);
        // setPublications(publicationsState);
        // setSkills(skillsState.default);
        // setPersonalProjects(personalProjectsState);
        // setAwardsAndAchievements(awardsAndAchievementsState);
        // setPositionsOfResponsibility(positionsOfResponsibilityState);
        // setCompetitions(competitionsState);
        // setExtracurricularActivities(extracurricularActivitiesState);
      } else {
        toast.error('Failed to fetch user information or profile. Please try again.');
      }
    } finally {
      setIsLoading(false);
      setHasAttemptedFetch(true);
    }
  }, [navigate, fetchUserInfo, userInfo, setPersonalInfo, setSocials, setEducation, setExperience, setPublications, setSkills, setPersonalProjects, setAwardsAndAchievements, setPositionsOfResponsibility, setCompetitions, setExtracurricularActivities]);

  useEffect(() => {
    if (!hasAttemptedFetch) {
      fetchUserInfoAndProfile();
    }
  }, [fetchUserInfoAndProfile, hasAttemptedFetch]);

  // New function to check for changes
  const checkForChanges = useCallback(() => {
    // Compare current state with initial state
    const hasChanges = 
      JSON.stringify(personalInfo) !== JSON.stringify(personalInformationState.default) ||
      JSON.stringify(socials) !== JSON.stringify(socialsState.default) ||
      JSON.stringify(courses) !== JSON.stringify(coursesState.default) ||
      JSON.stringify(education) !== JSON.stringify(educationState.default) ||
      JSON.stringify(experience) !== JSON.stringify(experienceState.default) ||
      JSON.stringify(publications) !== JSON.stringify(publicationsState.default) ||
      JSON.stringify(skills) !== JSON.stringify(skillsState.default) ||
      JSON.stringify(personalProjects) !== JSON.stringify(personalProjectsState.default) ||
      JSON.stringify(awardsAndAchievements) !== JSON.stringify(awardsAndAchievementsState.default) ||
      JSON.stringify(positionsOfResponsibility) !== JSON.stringify(positionsOfResponsibilityState.default) ||
      JSON.stringify(competitions) !== JSON.stringify(competitionsState.default) ||
      JSON.stringify(extracurricularActivities) !== JSON.stringify(extracurricularActivitiesState.default) ||
      false;

    setHasLocalChanges(hasChanges);
  }, [personalInfo, socials, courses, education, experience, publications, skills, personalProjects, awardsAndAchievements, positionsOfResponsibility, competitions, extracurricularActivities]);

  useEffect(() => {
    checkForChanges();
  }, [personalInfo, socials, courses, education, experience, publications, skills, personalProjects, awardsAndAchievements, positionsOfResponsibility, competitions, extracurricularActivities, checkForChanges]);

  const handleSubmit = async () => {
    const token = localStorage.getItem('authToken');
    if (!token || !userInfo || !userInfo._id) {
      toast.error('You must be logged in to submit your profile.');
      navigate("/login");
      return;
    }

    try {
      const dataToSubmit = {
        userId: userInfo._id,
        personal_information: {
          ...personalInfo,
          email: userInfo.email // Use the email from userInfo
        },
        socials,
        courses,
        education,
        experience,
        publications,
        skills,
        personal_projects: personalProjects,
        awards_and_achievements: awardsAndAchievements,
        positions_of_responsibility: positionsOfResponsibility,
        competitions,
        extracurricular_activities: extracurricularActivities
      };

      console.log('Data being submitted:', JSON.stringify(dataToSubmit, null, 2));

      let response;
      if (profileExists) {
        // Update existing profile
          response = await axios.put(`http://localhost:3004/api/user-profile/${userInfo._id}`, dataToSubmit, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Create new profile
        response = await axios.post('http://localhost:3004/api/user-profile/create', dataToSubmit, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      console.log('Profile submitted successfully:', response.data);
      toast.success('Profile submitted successfully!');
      setProfileExists(true);
      setHasLocalChanges(false);  // Reset hasLocalChanges after successful submission
      
      // Refetch the profile data to ensure local state is in sync with the backend
      await fetchUserInfoAndProfile();

    } catch (error) {
      console.error('Error submitting profile:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        toast.error(`Failed to submit profile: ${error.response.data.message || 'Unknown error'}`);
      } else if (error.request) {
        toast.error('Failed to submit profile. No response received from server.');
      } else {
        toast.error('Failed to submit profile. Please try again.');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (!hasAnyData(personalInfo)) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8">
        <div className="text-center p-6 sm:p-8 bg-white rounded-lg shadow-xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl">
          <IconUser className="w-16 h-16 text-orange-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Resume is Empty</h2>
          <p className="text-gray-600 mb-4">
            Please enter your details in the various sections to build your resume.
          </p>
        </div>
      </div>
    );
  }

  const content = (
    <>
      {isValidData(personalInfo) && (
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {personalInfo?.first_name}{" "}
            {personalInfo?.last_name}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600">
            {personalInfo?.email && (
              <span className="flex items-center">
                <IconMail className="w-4 h-4 mr-1" />
                <span className="break-all">{personalInfo.email}</span>
              </span>
            )}
            {personalInfo?.phone && (
              <span className="flex items-center">
                <IconPhone className="w-4 h-4 mr-1" />
                {personalInfo.phone}
              </span>
            )}
            {socials?.github && (
              <a href={`https://github.com/${socials.github}`} className="flex items-center hover:text-blue-500">
                <IconBrandGithub className="w-4 h-4 mr-1" />
                <span className="break-all">{socials.github}</span>
              </a>
            )}
            {socials?.linkedin && (
              <a href={`https://linkedin.com/in/${socials.linkedin}`} className="flex items-center hover:text-blue-500">
                <IconBrandLinkedin className="w-4 h-4 mr-1" />
                <span className="break-all">{socials.linkedin}</span>
              </a>
            )}
          </div>
        </header>
      )}

      <Section
        title="Skills"
        icon={<IconCode className="w-5 h-5" />}
        isEmpty={!isValidData(skills)}
      >
        <div className="flex flex-wrap gap-2">
          {skills?.map((skill, index) => (
            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
              {skill.skill_name}
            </span>
          ))}
        </div>
      </Section>

      <Section
        title="Education"
        icon={<IconSchool className="w-5 h-5" />}
        isEmpty={!isValidData(education)}
      >
        <div className="space-y-4">
          {education?.filter(isValidData).map((edu, index) => (
            <div key={edu.id ||index} className="flex flex-col md:flex-row justify-between">
              <div>
                <h3 className="font-semibold text-gray-800">{edu.institution}</h3>
                <p className="text-gray-600">{edu.degree}</p>
                {edu.description && (
                  <p className="text-gray-500 mt-1">{edu.description}</p>
                )}
              </div>
              <div className="text-right mt-2 md:mt-0">
                <p className="text-gray-600">
                  {edu.start_date ? new Date(edu.start_date).getFullYear() : ''} - {edu.end_date ? new Date(edu.end_date).getFullYear() : 'Present'}
                </p>
                {edu.cgpa_or_percentage && (
                  <p className="text-gray-500">CGPA/Percentage: {edu.cgpa_or_percentage}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Work Experience"
        icon={<IconBriefcase className="w-5 h-5" />}
        isEmpty={!isValidData(experience)}
      >
        <div className="space-y-4">
          {experience?.filter(isValidData).map((exp, index) => (
            <div key={index}>
              <div className="flex flex-col md:flex-row justify-between mb-1">
                <h3 className="font-semibold text-gray-800">{exp.position} - {exp.company}</h3>
                <span className="text-gray-600">
                  {exp.start_date && new Date(exp.start_date).toLocaleDateString("en-US", {
                    month: "short",
                    year: "numeric",
                  })} -
                  {exp.currently_working
                    ? " Present"
                    : exp.end_date && new Date(exp.end_date).toLocaleDateString("en-US", {
                        month: "short",
                        year: "numeric",
                      })}
                </span>
              </div>
              {Array.isArray(exp.description) && exp.description.length > 0 && (
                <ul className="list-disc pl-5 text-gray-600">
                  {exp.description.map((item, idx) => (
                    <li key={idx}>{item}</li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Projects"
        icon={<Rocket className="w-5 h-5" />}
        isEmpty={!isValidData(personalProjects)}
      >
        <div className="space-y-4">
          {personalProjects?.filter(isValidData).map((project, index) => (
            <div key={index}>
              <div className="flex flex-col md:flex-row justify-between mb-1">
                <h3 className="font-semibold text-gray-800">{project.name}</h3>
                <span className="text-gray-600">
                  {project.start_date && new Date(project.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
              {project.link && (
                <a href={project.link} className="text-blue-500 hover:underline block mb-1 break-all">{project.link}</a>
              )}
              <ul className="list-disc pl-5 text-gray-600">
                {Array.isArray(project.description)
                  ? project.description.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))
                  : typeof project.description === 'string'
                    ? project.description.split("\n").map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))
                    : project.description
                      ? <li>{String(project.description)}</li>
                      : null
                }
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Positions of Responsibility"
        icon={<IconAward className="w-5 h-5" />}
        isEmpty={!isValidData(positionsOfResponsibility)}
      >
        <div className="space-y-4">
          {positionsOfResponsibility?.filter(isValidData).map((position, index) => (
            <div key={position.id || index}>
              <div className="flex flex-col md:flex-row justify-between mb-1">
                <h3 className="font-semibold text-gray-800">{position.title} - {position.organization}</h3>
                <span className="text-gray-600">
                  {position.start_date && new Date(position.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })} -
                  {position.end_date ? new Date(position.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : 'Present'}
                </span>
              </div>
              <ul className="list-disc pl-5 text-gray-600">
                {position.description?.split('\n').map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Competitions"
        icon={<IconTrophy className="w-5 h-5" />}
        isEmpty={!isValidData(competitions)}
      >
        <div className="space-y-4">
          {competitions?.map((competition, index) => (
            <div key={index}>
              <div className="flex flex-col md:flex-row justify-between mb-1">
                <h3 className="font-semibold text-gray-800">{competition.name}</h3>
                <span className="text-gray-600">
                  {competition.date && new Date(competition.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
              <ul className="list-disc pl-5 text-gray-600">
                {Array.isArray(competition.description) 
                  ? competition.description.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))
                  : competition.description?.split('\n').map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))
                }
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Publications"
        icon={<BookOpen className="w-5 h-5" />}
        isEmpty={!isValidData(publications)}
      >
        <ul className="list-disc pl-5 space-y-2">
          {publications?.map((publication, index) => (
            <li key={index} className="text-gray-700">
              <span className="font-semibold">{publication.name}</span>
              {publication.link && (
                <a href={publication.link} className="ml-1 text-blue-500 hover:underline">[Link]</a>
              )}
              <span className="ml-1 text-gray-600">
                {publication.date && `(${new Date(publication.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })})`}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Courses"
        icon={<IconCertificate className="w-5 h-5" />}
        isEmpty={!isValidData(courses)}
      >
        <ul className="list-disc pl-5 space-y-2">
          {courses?.map((course, index) => (
            <li key={index} className="text-gray-700">
              <span className="font-semibold">{course.course_name}</span>
              {course.course_provider && <span className="text-gray-600"> - {course.course_provider}</span>}
              <span className="ml-1 text-gray-600">
                {course.completion_date && `(Completed: ${new Date(course.completion_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })})`}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      <Section
        title="Achievements"
        icon={<IconTrophy className="w-5 h-5" />}
        isEmpty={!isValidData(awardsAndAchievements)}
      >
        <ul className="list-disc pl-5 space-y-1">
          {awardsAndAchievements?.map((award, index) => (
            <li key={index} className="text-gray-700">{award}</li>
          ))}
        </ul>
      </Section>

      <Section
        title="Extra Curricular Activities"
        icon={<IconHeart className="w-5 h-5" />}
        isEmpty={!isValidData(extracurricularActivities)}
      >
        <ul className="list-disc pl-5 space-y-1">
          {extracurricularActivities?.map((activity, index) => (
            <li key={index} className="text-gray-700">{activity}</li>
          ))}
        </ul>
      </Section>

      {hasAnyData(personalInfo) && (
        <div className="mt-8 text-center">
          <button 
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 shadow-md"
            onClick={handleSubmit}
          >
            {profileExists ? 'Update Profile' : 'Create Profile'}
          </button>
        </div>
      )}
    </>
  );

  return (
    <div className="min-h-screen">
      <div className="w-full mx-auto">
        <ResumePage content={content} />
      </div>
    </div>
  );
}