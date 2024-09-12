import React from "react";

export default function LandingSecondSection() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32">
      <div className="container space-y-12 px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">
              Elevate Your Career
            </h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Our platform provides the tools and resources you need to build a
              successful career.
            </p>
          </div>
        </div>
        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
          <div className="grid gap-1">
            <h3 className="text-lg font-bold">Resume Builder</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Create a professional resume that showcases your skills and
              experience.
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="text-lg font-bold">Job Search</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Find the perfect job opportunities and apply with ease.
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="text-lg font-bold">Career Coaching</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Get personalized guidance from industry experts to reach your
              goals.
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="text-lg font-bold">Skill Development</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Enhance your skills and stay competitive in the job market.
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="text-lg font-bold">Networking</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Connect with professionals in your industry and expand your
              network.
            </p>
          </div>
          <div className="grid gap-1">
            <h3 className="text-lg font-bold">Interview Prep</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Prepare for interviews and ace your next job opportunity.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
