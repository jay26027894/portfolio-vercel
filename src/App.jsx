import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Particles from '../components/Particles'
import LogoLoop from './components/LogoLoop'
import {  SiReact, SiNextdotjs, SiTailwindcss, SiNodedotjs, SiJavascript,SiHtml5, SiCss3, SiC,SiCplusplus,SiGit,SiGithub, SiFigma, SiWordpress, SiFramer, SiGreensock, SiVite, SiOracle, SiOpenai, SiTensorflow,SiPython} from 'react-icons/si';
import { TbBrandFramerMotion } from 'react-icons/tb';

function App() {
  // Define your tech logos
 const techLogos = [
  // Cloud & Infrastructure
  { node: <SiOracle />, title: "Oracle Cloud Infrastructure (OCI)", href: "https://www.oracle.com/cloud/" },
  
  // Programming Languages
  { node: <SiC />, title: "C", href: "#" },
  { node: <SiCplusplus />, title: "C++", href: "#" },
  { node: <SiJavascript />, title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  
  // Frontend Development
  { node: <SiHtml5 />, title: "HTML5", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { node: <SiCss3 />, title: "CSS3", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { node: <SiReact />, title: "React.js", href: "https://react.dev" },
  { node: <SiNextdotjs />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiNodedotjs />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiVite />, title: "Vite", href: "https://vitejs.dev" },
  
  // Styling & Animation
  { node: <SiTailwindcss />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <TbBrandFramerMotion />, title: "Framer Motion", href: "https://www.framer.com/motion/" },
  { node: <SiGreensock />, title: "GSAP", href: "https://greensock.com/gsap/" },
  
  // Tools & Technologies
  { node: <SiGit />, title: "Git", href: "https://git-scm.com" },
  { node: <SiGithub />, title: "GitHub", href: "https://github.com" },
  { node: <SiFigma />, title: "Figma", href: "https://www.figma.com" },
  { node: <SiWordpress />, title: "WordPress", href: "https://wordpress.org" },
];

  return (
    <div className='bg-black font-mono'>
      {/* Particles Background */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      >
        <Particles
          particleColors={['#FF69B4', '#FF1493']}
          particleCount={120}
          particleSpread={10}
          speed={0.1}
          particleBaseSize={100}
          moveParticlesOnHover={true}
          alphaParticles={true}
          disableRotation={false}
        />
      </div>

      {/* Main Content */}
      <Navbar />
      <Hero />
      <About />
      <Skills />
      
      {/* LogoLoop Section */}
      <div className="relative z-20 py-20 bg-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-pink-400 mb-12">
            Technologies & Tools
          </h2>
          <div className="bg-black" style={{ height: '120px', position: 'relative', overflow: 'hidden' }}>
            <LogoLoop
              logos={techLogos}
              speed={120}
              direction="left"
              logoHeight={48}
              gap={40}
              pauseOnHover
              scaleOnHover
              fadeOut
              fadeOutColor="#000000"
              ariaLabel="Technology stack"
            />
          </div>
        </div>
      </div>

      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;