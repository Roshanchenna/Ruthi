import React from "react";
import { useRecoilValue } from "recoil";
import { userProfileState } from "../../store/selectors/userProfileState";
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
  if (Array.isArray(data)) {
    return data.length > 0 && data.some(item => 
      Object.entries(item).some(([key, value]) => 
        value !== null && 
        value !== undefined && 
        value !== '' && 
        (typeof value !== 'object' || (Array.isArray(value) && value.length > 0) || Object.keys(value).length > 0)
      )
    );
  }
  if (typeof data === 'object' && data !== null) {
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
  return Object.values(profile).some(isValidData);
};

export default function Resume() {
  const userProfile = useRecoilValue(userProfileState);
  const navigate = useNavigate();

  if (!userProfile) {
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

  if (!hasAnyData(userProfile)) {
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
      {isValidData(userProfile.personal_information) && (
        <header className="text-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            {userProfile.personal_information?.first_name}{" "}
            {userProfile.personal_information?.last_name}
          </h1>
          <div className="flex flex-wrap justify-center items-center gap-4 text-gray-600">
            {userProfile.personal_information?.email && (
              <span className="flex items-center">
                <IconMail className="w-4 h-4 mr-1" />
                <span className="break-all">{userProfile.personal_information.email}</span>
              </span>
            )}
            {userProfile.personal_information?.phone && (
              <span className="flex items-center">
                <IconPhone className="w-4 h-4 mr-1" />
                {userProfile.personal_information.phone}
              </span>
            )}
            {userProfile.socials?.github && (
              <a href={`https://github.com/${userProfile.socials.github}`} className="flex items-center hover:text-blue-500">
                <IconBrandGithub className="w-4 h-4 mr-1" />
                <span className="break-all">{userProfile.socials.github}</span>
              </a>
            )}
            {userProfile.socials?.linkedin && (
              <a href={`https://linkedin.com/in/${userProfile.socials.linkedin}`} className="flex items-center hover:text-blue-500">
                <IconBrandLinkedin className="w-4 h-4 mr-1" />
                <span className="break-all">{userProfile.socials.linkedin}</span>
              </a>
            )}
          </div>
        </header>
      )}

      <Section
        title="Skills"
        icon={<IconCode className="w-5 h-5" />}
        isEmpty={!isValidData(userProfile.skills)}
      >
        <div className="flex flex-wrap gap-2">
          {userProfile.skills?.map((skill, index) => (
            <span key={index} className="bg-gray-200 text-gray-700 px-2 py-1 rounded-full text-sm">
              {skill.skill_name}
            </span>
          ))}
        </div>
      </Section>

      <Section
        title="Education"
        icon={<IconSchool className="w-5 h-5" />}
        isEmpty={!isValidData(userProfile.education)}
      >
        <div className="space-y-4">
          {userProfile.education?.filter(isValidData).map((edu, index) => (
            <div key={index} className="flex flex-col md:flex-row justify-between">
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
        isEmpty={!isValidData(userProfile.experience)}
      >
        <div className="space-y-4">
          {userProfile.experience?.filter(isValidData).map((exp, index) => (
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
        isEmpty={!isValidData(userProfile.personal_projects)}
      >
        <div className="space-y-4">
          {userProfile.personal_projects?.filter(isValidData).map((project, index) => (
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
        isEmpty={!isValidData(userProfile.position_of_responsibility)}
      >
        <div className="space-y-4">
          {userProfile.position_of_responsibility?.map((position, index) => (
            <div key={index}>
              <div className="flex flex-col md:flex-row justify-between mb-1">
                <h3 className="font-semibold text-gray-800">{position.title} - {position.organization}</h3>
                <span className="text-gray-600">
                  {position.start_date && new Date(position.start_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })} -
                  {position.end_date && new Date(position.end_date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                </span>
              </div>
              <ul className="list-disc pl-5 text-gray-600">
                {Array.isArray(position.description) 
                  ? position.description.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))
                  : position.description?.split('\n').map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))
                }
              </ul>
            </div>
          ))}
        </div>
      </Section>

      <Section
        title="Competitions"
        icon={<IconTrophy className="w-5 h-5" />}
        isEmpty={!isValidData(userProfile.competitions)}
      >
        <div className="space-y-4">
          {userProfile.competitions?.map((competition, index) => (
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
        isEmpty={!isValidData(userProfile.publications)}
      >
        <ul className="list-disc pl-5 space-y-2">
          {userProfile.publications?.map((publication, index) => (
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
        isEmpty={!isValidData(userProfile.courses)}
      >
        <ul className="list-disc pl-5 space-y-2">
          {userProfile.courses?.map((course, index) => (
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
        isEmpty={!isValidData(userProfile.awards_and_achievements)}
      >
        <ul className="list-disc pl-5 space-y-1">
          {userProfile.awards_and_achievements?.map((award, index) => (
            <li key={index} className="text-gray-700">{award}</li>
          ))}
        </ul>
      </Section>

      <Section
        title="Extra Curricular Activities"
        icon={<IconHeart className="w-5 h-5" />}
        isEmpty={!isValidData(userProfile.extra_curricular_activities)}
      >
        <p className="text-gray-700">{userProfile.extra_curricular_activities?.join(", ")}</p>
      </Section>

      {hasAnyData(userProfile) && (
        <div className="mt-8 text-center">
          <button 
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition duration-300 shadow-md"
          >
            Submit Profile
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