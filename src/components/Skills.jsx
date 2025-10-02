import AnimatedList from "./AnimatedList";

const skills = [
  // AI & Machine Learning
  "Generative AI",
  "Large Language Models (LLMs)",
  "LLM Fine-Tuning",
  "AI Model Deployment",
  "Chatbot Development",
  "Vector Databases",
  "Computer Vision",
  "Prompt Engineering",
  
  // Cloud & Infrastructure
  "Oracle Cloud Infrastructure (OCI)",
  "OCI AI Services",
  "OCI Dedicated AI Clusters",
  
  // Programming Languages
  "C",
  "C++",
  "JavaScript",
  
  // Frontend Development
  "HTML5",
  "CSS3",
  "React.js",
  "Next.js",
  "Node.js",
  "Vite",
  
  // Styling & Animation
  "Tailwind CSS",
  "Framer Motion",
  "GSAP",
  "Responsive Web Design",
  
  // Tools & Technologies
  "Git",
  "GitHub",
  "REST APIs",
  "Figma",
  "WordPress",
  "Web Hosting",
  
  // Soft Skills
  "Problem Solving",
  "Team Collaboration",
  "Communication",
  "Time Management",
  "Adaptability",
  "Continuous Learning",
  "Critical Thinking",
  "Event Management",
  "Organization Skills",
];

export default function Skills() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-20">
      <h2 className="text-3xl font-semibold text-center text-purple-400 mb-12">
        Skills
      </h2>
      <div className="flex justify-center">
        <AnimatedList
          items={skills}
          onItemSelect={(item) => console.log("Selected:", item)}
          showGradients={false}
          enableArrowNavigation={true}
          displayScrollbar={true}
        />
      </div>
    </section>
  );
}
