import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { 
  useTexture, 
  Float, 
  Text, 
  ScrollControls, 
  Scroll, 
  useScroll, 
  Outlines, 
  Cloud,
  Sparkles,
  Stars,
  Html,
  Torus
} from '@react-three/drei';
import { 
  Github, 
  Linkedin, 
  Mail, 
  ArrowRight,
  ChevronDown,
  MapPin,
  ExternalLink,
  Code2,
  Cpu,
  Globe
} from 'lucide-react';
import * as THREE from 'three';

// --- DATA: UPDATED WITH NEW DETAILS ---

// --- DATA: UPDATED WITH REAL PORTFOLIO CONTENT ---

const PERSONAL_DETAILS = {
  name: "Jay Bontawar",
  role: "Web Developer & AI Enthusiast",
  location: "India",
  tagline: "Building digital universes with code.",
  socials: {
    github: "https://github.com/jay26027894",
    linkedin: "https://www.linkedin.com/in/jay-bontawar/",
    email: "mailto:jaybontawar33@gmail.com",
    
  }
};

const SKILLS = [
  { name: "React / Next.js", color: "#FF9F43", position: [-3, 1, 0] },
  { name: "Generative AI", color: "#A29BFE", position: [-1.5, 3, -2] },
  { name: "Node.js / Mongo", color: "#FF6B6B", position: [3, 2, -1] },
  { name: "Tailwind / GSAP", color: "#FFE66D", position: [2, -1, 1] },
  { name: "Three.js / R3F", color: "#54A0FF", position: [0, 4, -1] },
  { name: "Python / LLMs", color: "#6C5CE7", position: [-2, -2, 1] }
];

const EXPERIENCE = [
  {
    year: "2024",
    role: "Vice President",
    company: "Nexus Forum",
    desc: "Leading technical events and organizing Techotsav.",
    height: 6,
    position: [-2, -3, 0]
  },
  {
    year: "2023",
    role: "Web Developer",
    company: "Freelance",
    desc: "Delivered 10+ web projects including e-commerce and portfolios.",
    height: 5,
    position: [2, -5, -2]
  },
  {
    year: "2022",
    role: "Open Source",
    company: "GitHub",
    desc: "Active contributor to various web and AI repositories.",
    height: 4,
    position: [-1, -8, -4]
  }
];

const PROJECTS = [
  {
    id: 1,
    title: "Audio Atlas",
    desc: "AI-powered accessibility tool transforming visual data into conversational knowledge using Chrome's on-device AI.",
    tech: ["SvelteKit", "TypeScript", "Tailwind", "Chrome AI"],
    color: "#FF9F43",
    shape: "dodecahedron",
    position: [4, 2, -3],
    link: "https://audio-atlas.vercel.app"
  },
  {
    id: 2,
    title: "DigiTwin",
    desc: "AI productivity hub turning activity data into personalized insights.",
    tech: ["React", "AI/ML", "Tailwind"],
    color: "#54A0FF",
    shape: "octahedron",
    position: [-4, -1, -2],
    link: "https://digital-twin-tau.vercel.app/"
  },
  {
    id: 3,
    title: "CaptionCraft",
    desc: "AI-powered tool generating creative social media captions using Gemini API.",
    tech: ["React", "Gemini API", "Node.js"],
    color: "#FF6B6B",
    shape: "icosahedron",
    position: [3, -4, -4],
    link: "https://captioncraft-eight.vercel.app/"
  },
  {
    id: 4,
    title: "Dear Nisha",
    desc: "Interactive appreciation web app with elegant animations.",
    tech: ["HTML/CSS", "JS", "Tailwind"],
    color: "#A29BFE",
    shape: "torus",
    position: [-3, 5, -5],
    link: "https://dear-nisha.vercel.app/"
  },
  {
    id: 5,
    title: "NewsNest",
    desc: "Modern news aggregation platform for fast and reliable updates.",
    tech: ["React", "CSS", "API"],
    color: "#6C5CE7",
    shape: "box",
    position: [2, -6, -1],
    link: "https://news-nest-rho.vercel.app/"
  }
];

// --- GLOBAL STYLES ---
const GlobalStyles = () => (
  <style>
    {`
      @font-face {
        font-family: 'Archivo Black';
        src: url('/fonts/ArchivoBlack.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      @font-face {
        font-family: 'Space Mono';
        src: url('/fonts/SpaceMono.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
      }
      
      body { 
        background-color: #E0E8E8; /* Soft dusty blue/grey */
        color: #2D3436;
        margin: 0;
        overflow: hidden; 
      }
      
      .font-title { font-family: 'Archivo Black', sans-serif; }
      .font-mono { font-family: 'Space Mono', monospace; }
      
      /* Custom scrollbar hide */
      ::-webkit-scrollbar { display: none; }
      
      ::selection {
        background: #FF6B6B;
        color: white;
      }
    `}
  </style>
);

// --- TOON SHADER SETUP ---
const toonGradientMap = new THREE.DataTexture(
  new Uint8Array([0, 128, 255]), 
  3, 
  1, 
  THREE.RedFormat
);
toonGradientMap.minFilter = THREE.NearestFilter;
toonGradientMap.magFilter = THREE.NearestFilter;
toonGradientMap.needsUpdate = true;

// --- 3D COMPONENTS ---

const TravelerShip = ({ scroll }) => {
  const mesh = useRef();
  
  useFrame((state) => {
    const targetY = state.camera.position.y - 3;
    const targetX = state.camera.position.x;
    
    if (mesh.current) {
      mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, 0.1);
      mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, targetX, 0.1);
      
      const scrollDelta = scroll.delta;
      mesh.current.rotation.z = scrollDelta * -20;
      mesh.current.rotation.y = scrollDelta * 10 + Math.PI;
    }
  });

  return (
    <group ref={mesh} position={[0, -2, 6]}>
      <Float speed={5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <coneGeometry args={[0.3, 1.5, 4]} />
          <meshToonMaterial color="#FF6B6B" gradientMap={toonGradientMap} />
          <Outlines thickness={0.05} color="#2D3436" />
        </mesh>
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[2, 0.5, 0.5]}>
          <boxGeometry args={[0.8, 0.8, 0.1]} />
          <meshToonMaterial color="white" gradientMap={toonGradientMap} />
          <Outlines thickness={0.05} color="#2D3436" />
        </mesh>
        <mesh position={[0, 0.8, 0]}>
           <sphereGeometry args={[0.15]} />
           <meshBasicMaterial color="#FFE66D" />
        </mesh>
      </Float>
    </group>
  );
};

const ToonMesh = ({ geometry, color, position, scale, rotation, outlineColor = "#2D3436", outlineThickness = 0.03 }) => {
  return (
    <mesh position={position} scale={scale} rotation={rotation} geometry={geometry}>
      <meshToonMaterial color={color} gradientMap={toonGradientMap} />
      <Outlines thickness={outlineThickness} color={outlineColor} />
    </mesh>
  );
};

const OrbitingRings = ({ position }) => {
  const ref = useRef();
  useFrame((state) => {
    if (ref.current) {
      ref.current.rotation.y += 0.005;
      ref.current.rotation.z += 0.002;
    }
  });

  return (
    <group position={position} ref={ref}>
       <Torus args={[5, 0.05, 16, 100]} rotation={[Math.PI/2, 0, 0]}>
         <meshBasicMaterial color="#2D3436" transparent opacity={0.2} />
       </Torus>
       <Torus args={[7, 0.05, 16, 100]} rotation={[Math.PI/3, 0, 0]}>
         <meshBasicMaterial color="#2D3436" transparent opacity={0.1} />
       </Torus>
    </group>
  )
}

const SkillCrystal = ({ position, color, label }) => {
  const [hovered, setHover] = useState(false);
  
  return (
    <group position={position}>
      <Float speed={3} rotationIntensity={1} floatIntensity={1}>
        <mesh 
          onPointerOver={() => setHover(true)} 
          onPointerOut={() => setHover(false)}
          scale={hovered ? 1.2 : 1}
        >
          <octahedronGeometry args={[0.4]} />
          <meshToonMaterial color={color} gradientMap={toonGradientMap} />
          <Outlines thickness={0.02} color="#2D3436" />
        </mesh>
      </Float>
      <Text 
        position={[0, -0.8, 0]} 
        fontSize={0.2} 
        color="#2D3436" 
        font="/fonts/SpaceMono.ttf"
        anchorX="center" 
        anchorY="middle"
      >
        {label}
      </Text>
    </group>
  );
};

const ExperiencePillar = ({ position, height, year, role, company }) => {
  return (
    <group position={position}>
      <mesh position={[0, height/2, 0]}>
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshToonMaterial color="#4ECDC4" gradientMap={toonGradientMap} />
        <Outlines thickness={0.03} color="#2D3436" />
      </mesh>
      <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
        <Text 
          position={[0.6, height - 0.5, 0.6]} 
          fontSize={0.4} 
          color="#2D3436" 
          font="/fonts/ArchivoBlack.ttf"
          anchorX="left" 
          anchorY="middle"
          rotation={[0, -Math.PI/4, 0]}
        >
          {year}
        </Text>
        <Text 
          position={[0.6, height - 1.0, 0.6]} 
          fontSize={0.2} 
          color="#2D3436" 
          font="/fonts/SpaceMono.ttf"
          anchorX="left" 
          anchorY="middle"
          rotation={[0, -Math.PI/4, 0]}
        >
          {role}
        </Text>
        <Text 
          position={[0.6, height - 1.3, 0.6]} 
          fontSize={0.15} 
          color="#2D3436" 
          font="/fonts/SpaceMono.ttf"
          anchorX="left" 
          anchorY="middle"
          rotation={[0, -Math.PI/4, 0]}
        >
          @{company}
        </Text>
      </Float>
    </group>
  );
};

const CosmicBoids = () => {
  const boids = useMemo(() => Array.from({ length: 20 }).map(() => ({
    speed: 3 + Math.random(),
    rotationIntensity: 2,
    floatIntensity: 2,
    position: [
      (Math.random() - 0.5) * 30,
      (Math.random() - 0.5) * 80 - 40, 
      (Math.random() - 0.5) * 20
    ],
    rotation: [0, 0, Math.PI / 2]
  })), []);

  return (
    <group>
      {boids.map((data, i) => (
        <Float key={i} speed={data.speed} rotationIntensity={data.rotationIntensity} floatIntensity={data.floatIntensity}>
          <mesh position={data.position} rotation={data.rotation}>
            <coneGeometry args={[0.1, 0.4, 3]} />
            <meshToonMaterial color="#2D3436" />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const FloatingDebris = () => {
  const debris = useMemo(() => Array.from({ length: 50 }).map(() => ({
    color: ["#FF6B6B", "#4ECDC4", "#FFE66D", "#A29BFE"][Math.floor(Math.random() * 4)],
    position: [
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 80 - 20, 
      (Math.random() - 0.5) * 20
    ],
    rotation: [Math.random() * Math.PI, Math.random() * Math.PI, 0],
    scale: Math.random() * 0.5 + 0.3
  })), []);

  return (
    <group>
      {debris.map((data, i) => (
        <ToonMesh
          key={i}
          geometry={new THREE.TetrahedronGeometry(0.2)}
          color={data.color}
          position={data.position}
          rotation={data.rotation}
          scale={data.scale}
        />
      ))}
    </group>
  );
};

const ProjectGeometry = ({ shape, color, position }) => {
  let geo;
  switch(shape) {
    case 'dodecahedron': geo = new THREE.DodecahedronGeometry(1.5); break;
    case 'octahedron': geo = new THREE.OctahedronGeometry(1.2); break;
    case 'icosahedron': geo = new THREE.IcosahedronGeometry(1.4); break;
    case 'torus': geo = new THREE.TorusGeometry(1, 0.4, 16, 32); break;
    case 'box': geo = new THREE.BoxGeometry(1.8, 1.8, 1.8); break;
    default: geo = new THREE.SphereGeometry(1.2);
  }

  return (
    <group position={position}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <ToonMesh geometry={geo} color={color} />
      </Float>
    </group>
  );
}

// --- SCENE LOGIC ---

const SceneContent = () => {
  const scroll = useScroll();
  
  useFrame((state) => {
    // Extended Camera Journey: 0 to -60 Y due to more projects
    const offset = scroll.offset;
    
    state.camera.position.y = THREE.MathUtils.lerp(0, -60, offset);
    state.camera.position.z = THREE.MathUtils.lerp(12, 10, offset);
    
    const { x, y } = state.pointer;
    state.camera.rotation.x = THREE.MathUtils.lerp(0, -0.1, offset) + (y * 0.05);
    state.camera.rotation.y = x * 0.05;
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[20, 20, 10]} intensity={1.2} castShadow />
      <fog attach="fog" args={['#E0E8E8', 10, 45]} />
      <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />

      <TravelerShip scroll={scroll} />
      <FloatingDebris />

      {/* ACT 1: THE ORIGIN (Hero) */}
      <group position={[0, 0, 0]}>
        <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
          <ToonMesh 
            geometry={new THREE.SphereGeometry(1.8, 32, 32)} 
            color="#FF6B6B" 
            position={[3, 1, -2]} 
          />
          <ToonMesh 
            geometry={new THREE.IcosahedronGeometry(0.8)} 
            color="#4ECDC4" 
            position={[-3, -2, -4]} 
          />
        </Float>
        <Cloud opacity={0.4} speed={0.2} width={15} depth={2} segments={10} position={[0, -2, -8]} color="#E0E8E8" />
        <Sparkles count={50} scale={10} size={4} speed={0.4} opacity={0.5} color="#FFE66D" />
      </group>

      {/* ACT 2: THE ARTIFACTS (Skills) */}
      <group position={[0, -12, 0]}>
         <OrbitingRings position={[0, 0, 0]} />
         {SKILLS.map((skill, i) => (
           <SkillCrystal key={i} {...skill} />
         ))}
         
         <Float speed={4} rotationIntensity={0.2}>
            <ToonMesh 
              geometry={new THREE.TorusGeometry(3, 0.1, 16, 100)} 
              color="#2D3436" 
              position={[0, 0, -2]} 
              rotation={[Math.PI/3, 0, 0]}
            />
         </Float>
      </group>

      {/* ACT 3: THE JOURNEY (Experience) */}
      <group position={[0, -24, 0]}>
        {EXPERIENCE.map((exp, i) => (
          <ExperiencePillar key={i} {...exp} />
        ))}
        <Cloud opacity={0.6} speed={0.3} width={20} depth={5} segments={20} position={[0, -8, -2]} color="#E0E8E8" />
      </group>

      {/* ACT 4: THE CONSTELLATIONS (Projects) */}
      <group position={[0, -38, 0]}>
        {PROJECTS.map((proj, i) => (
          <ProjectGeometry key={i} {...proj} />
        ))}
        <Sparkles count={100} scale={20} size={6} speed={0.2} opacity={0.3} color="#FF6B6B" />
      </group>

      {/* ACT 5: HORIZONS (Contact) */}
      <group position={[0, -60, 0]}>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
          <circleGeometry args={[20, 64]} />
          <meshToonMaterial color="#FF9F43" gradientMap={toonGradientMap} />
          <Outlines thickness={0.05} color="#2D3436" />
        </mesh>
        <ToonMesh geometry={new THREE.SphereGeometry(6)} color="#54A0FF" position={[0, -6, -20]} />
      </group>
    </>
  );
};

// --- HTML OVERLAY ---

const OverlayContent = () => {
  return (
    <Scroll html style={{ width: '100%' }}>
      
      {/* 1. HERO */}
      <section className="h-screen w-full flex flex-col items-center justify-center p-8 text-center">
        <div className="font-mono text-xs tracking-[0.4em] mb-4 text-[#FF6B6B] uppercase">
          Act I: The Origin
        </div>
        <h1 className="font-title text-[12vw] md:text-[9vw] leading-[0.85] text-[#2D3436] mb-6">
          COSMIC<br/><span className="text-transparent bg-clip-text bg-gradient-to-b from-[#2D3436] to-[#636e72]">EXPLORER</span>
        </h1>
        <div className="flex flex-col items-center gap-4">
          <p className="font-mono text-sm md:text-base max-w-md text-[#2D3436]/80 leading-relaxed">
            Welcome to the digital universe of <span className="font-bold">{PERSONAL_DETAILS.name}</span>.<br/>
            {PERSONAL_DETAILS.role}
          </p>
          <div className="animate-bounce mt-8">
            <ChevronDown className="w-6 h-6 text-[#2D3436]" />
          </div>
        </div>
      </section>

      {/* 2. SKILLS */}
      <section className="h-screen w-full flex items-center justify-center p-8 relative">
        <div className="text-center">
          <div className="font-mono text-xs tracking-[0.4em] mb-4 text-[#4ECDC4] uppercase">
            Act II: The Artifacts
          </div>
          <h2 className="font-title text-5xl md:text-7xl text-[#2D3436] mb-4">
            CORE<br/>SYSTEMS
          </h2>
          <p className="font-mono text-xs md:text-sm max-w-sm mx-auto text-[#2D3436]/60 mb-8">
            Navigating the stack with precision tools. 
            Hover over the floating crystals to analyze data.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-left bg-white/60 backdrop-blur-sm p-6 rounded-xl border border-white/50 shadow-lg">
             <div>
                <h4 className="font-mono text-xs font-bold text-[#FF6B6B] mb-2">FRONTEND</h4>
                <ul className="font-mono text-xs text-[#2D3436]/70 space-y-1">
                   <li>React.js / Next.js</li>
                   <li>Tailwind CSS</li>
                   <li>Framer Motion</li>
                   <li>Vite / GSAP</li>
                </ul>
             </div>
             <div>
                <h4 className="font-mono text-xs font-bold text-[#54A0FF] mb-2">AI / ML</h4>
                <ul className="font-mono text-xs text-[#2D3436]/70 space-y-1">
                   <li>Generative AI</li>
                   <li>LLMs / Gemini</li>
                   <li>Python</li>
                   <li>Model Tuning</li>
                </ul>
             </div>
             <div>
                <h4 className="font-mono text-xs font-bold text-[#FFE66D] mb-2">BACKEND</h4>
                <ul className="font-mono text-xs text-[#2D3436]/70 space-y-1">
                   <li>Node.js</li>
                   <li>MongoDB</li>
                </ul>
             </div>
             <div>
                <h4 className="font-mono text-xs font-bold text-[#4ECDC4] mb-2">TOOLS</h4>
                <ul className="font-mono text-xs text-[#2D3436]/70 space-y-1">
                   <li>Git / GitHub</li>
                   <li>Figma</li>
                   <li>Vercel</li>
                   <li>OCI</li>
                </ul>
             </div>
          </div>
        </div>
      </section>

      {/* 3. EXPERIENCE */}
      <section className="h-screen w-full flex items-center justify-start p-8 md:p-24">
        <div className="max-w-md bg-white/90 backdrop-blur-sm p-8 border-l-4 border-[#4ECDC4] shadow-lg">
          <div className="font-mono text-xs tracking-[0.4em] mb-4 text-[#54A0FF] uppercase">
            Act III: The Journey
          </div>
          <h2 className="font-title text-4xl md:text-5xl text-[#2D3436] mb-6">
            RISING<br/>PILLARS
          </h2>
          <p className="font-mono text-sm leading-relaxed text-[#2D3436]/80">
            Building monuments of code across the industry. From startups to enterprise scale, every monolith represents a chapter of growth and technical mastery.
          </p>
        </div>
      </section>

      {/* 4. PROJECTS - Extended Height */}
      <section className="h-[150vh] w-full relative">
         <div className="absolute top-12 right-8 md:right-24 text-right">
            <div className="font-mono text-xs tracking-[0.4em] mb-4 text-[#FFE66D] uppercase">
              Act IV: Constellations
            </div>
            <h2 className="font-title text-5xl md:text-7xl text-[#2D3436]">
              WORKS
            </h2>
         </div>

         {/* Dynamic Project Cards */}
         <div className="absolute top-[20vh] left-0 w-full flex flex-col gap-48 px-8 md:px-24 pb-24">
            {PROJECTS.map((project, index) => (
              <div 
                key={project.id}
                className={`flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}
              >
                <a 
                  href={project.link}
                  target="_blank"
                  rel="noreferrer"
                  className="group bg-white/90 p-6 border-2 border-[#2D3436] shadow-[6px_6px_0px_0px_#2D3436] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer w-full md:max-w-xs relative z-10 block text-decoration-none"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-title text-xl uppercase text-[#2D3436]">{project.title}</h3>
                    <ExternalLink className="w-4 h-4 opacity-50 text-[#2D3436]" />
                  </div>
                  <p className="font-mono text-xs mb-4 text-[#2D3436]/70">{project.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((tech, tIndex) => (
                      <span key={tIndex} className="px-2 py-1 bg-[#E0E8E8] border border-[#2D3436]/20 rounded text-[10px] font-bold text-[#2D3436] font-mono">
                        {tech}
                      </span>
                    ))}
                  </div>
                </a>
              </div>
            ))}
         </div>
      </section>

      {/* 5. CONTACT */}
      <section className="h-screen w-full flex flex-col items-center justify-center p-8 text-center relative">
        <div className="font-mono text-xs tracking-[0.4em] mb-4 text-[#FF9F43] uppercase">
          Act V: New Horizons
        </div>
        <h2 className="font-title text-6xl md:text-9xl text-[#2D3436] mb-12 leading-none">
          MAKE<br/>CONTACT
        </h2>
        
        <div className="flex gap-6 pointer-events-auto relative z-10">
          {[
            { Icon: Github, href: PERSONAL_DETAILS.socials.github, color: "#FF6B6B" },
            { Icon: Linkedin, href: PERSONAL_DETAILS.socials.linkedin, color: "#4ECDC4" },
            { Icon: Mail, href: PERSONAL_DETAILS.socials.email, color: "#FFE66D" }
          ].map((item, i) => (
            <a 
              key={i}
              href={item.href} 
              target="_blank"
              rel="noreferrer"
              className="w-16 h-16 bg-[#2D3436] text-white flex items-center justify-center rounded-full hover:scale-110 transition-all duration-300 border-2 border-transparent hover:border-[#2D3436] hover:bg-white hover:text-[#2D3436]"
            >
              <item.Icon className="w-6 h-6" />
            </a>
          ))}
        </div>

        <div className="mt-20 flex flex-col items-center gap-2 font-mono text-xs text-[#2D3436]/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{PERSONAL_DETAILS.location.toUpperCase()}</span>
          </div>
          <span>© 2025 {PERSONAL_DETAILS.name.toUpperCase()}</span>
        </div>
      </section>

    </Scroll>
  );
};

// --- MAIN APP ---

export default function Portfolio() {
  return (
    <>
      <GlobalStyles />
      <div style={{ width: '100vw', height: '100vh' }}>
        <Canvas shadows dpr={[1, 2]}>
          {/* Background Gradient */}
          <color attach="background" args={['#E0E8E8']} /> 
          <fog attach="fog" args={['#E0E8E8', 5, 45]} />
          
          {/* Scroll container logic: Increased pages to 6 to fit content */}
          <ScrollControls pages={6} damping={0.2}>
            <SceneContent />
            <OverlayContent />
          </ScrollControls>
        </Canvas>
        
        {/* Fixed UI Overlay */}
        <div className="fixed top-8 left-8 z-50 font-title text-xl text-[#2D3436] pointer-events-none mix-blend-multiply">
          JB.
        </div>
        <div className="fixed top-8 right-8 z-50 flex flex-col items-end gap-1 font-mono text-[10px] text-[#2D3436] pointer-events-none mix-blend-multiply opacity-60">
          <span>LOG: 2025.11.27</span>
          <span>SYS: ONLINE</span>
        </div>
        
        {/* Simple Progress Indicator */}
        <div className="fixed left-8 bottom-8 w-1 h-24 bg-[#2D3436]/10 rounded-full overflow-hidden z-50 hidden md:block">
           <div className="w-full bg-[#FF6B6B] animate-pulse h-full opacity-30" /> 
        </div>
      </div>
    </>
  );
}