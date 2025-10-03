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
 { node: <SiOracle className="text-pink-400" />, title: "Oracle Cloud Infrastructure (OCI)", href: "https://www.oracle.com/cloud/" },
  { node: <SiC className="text-pink-500" />, title: "C", href: "#" },
  { node: <SiCplusplus className="text-fuchsia-500" />, title: "C++", href: "#" },
  { node: <SiJavascript className="text-pink-400" />, title: "JavaScript", href: "https://developer.mozilla.org/en-US/docs/Web/JavaScript" },
  { node: <SiHtml5 className="text-pink-500" />, title: "HTML5", href: "https://developer.mozilla.org/en-US/docs/Web/HTML" },
  { node: <SiCss3 className="text-fuchsia-400" />, title: "CSS3", href: "https://developer.mozilla.org/en-US/docs/Web/CSS" },
  { node: <SiReact className="text-pink-500" />, title: "React.js", href: "https://react.dev" },
  { node: <SiNextdotjs className="text-pink-400" />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiNodedotjs className="text-fuchsia-500" />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiVite className="text-pink-500" />, title: "Vite", href: "https://vitejs.dev" },
  { node: <SiTailwindcss className="text-pink-400" />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <TbBrandFramerMotion className="text-fuchsia-500" />, title: "Framer Motion", href: "https://www.framer.com/motion/" },
  { node: <SiGreensock className="text-pink-500" />, title: "GSAP", href: "https://greensock.com/gsap/" },
  { node: <SiGit className="text-pink-400" />, title: "Git", href: "https://git-scm.com" },
  { node: <SiGithub className="text-fuchsia-400" />, title: "GitHub", href: "https://github.com" },
  { node: <SiFigma className="text-pink-500" />, title: "Figma", href: "https://www.figma.com" },
  { node: <SiWordpress className="text-fuchsia-500" />, title: "WordPress", href: "https://wordpress.org" },
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
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
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