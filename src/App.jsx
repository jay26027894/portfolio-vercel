import React, { useState, useRef, useEffect, useMemo, Suspense } from 'react';
import { Canvas, useFrame, useThree, extend } from '@react-three/fiber';
import { 
  useTexture, 
  Float, 
  Text, 
  ScrollControls, 
  Scroll, 
  useScroll, 
  Outlines, 
  Stars,
  Cloud,
  MeshTransmissionMaterial,
  Sparkles,
  Trail
} from '@react-three/drei';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  ArrowRight,
  ChevronDown,
  MapPin,
  ExternalLink,
  Crosshair,
  Code,
  Cpu,
  Globe,
  Database,
  Layers,
  Terminal,
  Box,
  BookOpen,
  Workflow,
  Radio,
  Gamepad2,
  Rocket
} from 'lucide-react';
import * as THREE from 'three';

// --- DATA: REAL PORTFOLIO CONTENT ---

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
    company: "Isparx Infotech",
    desc: "Delivered web projects which included portfolios.",
    height: 5,
    position: [2, -5, -2]
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

// --- FONTS & GLOBAL STYLES ---
const GlobalStyles = () => (
  <style>
    {`
      @import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Mono:ital,wght@0,400;0,700;1,400&display=swap');
      
      body { 
        background-color: #E0E8E8;
        color: #2D3436;
        margin: 0;
        overflow: hidden; 
        cursor: none; 
      }
      
      .font-title { font-family: 'Archivo Black', sans-serif; }
      .font-mono { font-family: 'Space Mono', monospace; }
      
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

// --- 3D ASSETS ---

const CustomCursor = () => {
  const cursor = useRef();
  const [hovered, setHovered] = useState(false);
  
  useEffect(() => {
    const move = (e) => {
      if(cursor.current) {
        cursor.current.style.left = `${e.clientX}px`;
        cursor.current.style.top = `${e.clientY}px`;
      }
      const target = e.target;
      setHovered(target.tagName === 'A' || target.tagName === 'BUTTON' || target.closest('a') || target.closest('button'));
    };
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, []);

  return (
    <div 
      ref={cursor} 
      className="fixed pointer-events-none z-[100] -translate-x-1/2 -translate-y-1/2 mix-blend-difference text-white transition-all duration-100"
    >
      <div className={`transition-all duration-300 ${hovered ? 'scale-150 rotate-45' : 'scale-100'}`}>
        <Crosshair className="w-8 h-8" strokeWidth={1.5} />
      </div>
    </div>
  );
};

const SpeedLines = ({ scroll }) => {
  const group = useRef();
  useFrame(() => {
    if(group.current) {
        const speed = Math.abs(scroll.delta) * 500;
        // Warp effect increases drastically near black hole (offset > 0.8)
        const warpFactor = scroll.offset > 0.8 ? 5 : 1; 
        
        group.current.position.z = (scroll.offset * 20 * warpFactor) % 20;
        group.current.scale.z = 1 + speed * warpFactor;
        group.current.visible = speed > 0.1 || scroll.offset > 0.8;
    }
  });

  return (
    <group ref={group}>
      {Array.from({ length: 40 }).map((_, i) => (
        <mesh key={i} position={[
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 50,
            (Math.random() - 0.5) * 60
        ]}>
          <boxGeometry args={[0.05, 0.05, 8]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.15} />
        </mesh>
      ))}
    </group>
  );
};

const TravelerShip = ({ scroll }) => {
  const mesh = useRef();
  const engineRef = useRef();
  
  useFrame((state) => {
    // Ship Position follows Camera, but stays in front
    // We adjust Z dynamically to make it look like it's entering the black hole
    const offset = scroll.offset;
    const isEnteringBlackHole = offset > 0.85;

    const targetY = state.camera.position.y - 2;
    const targetX = state.camera.position.x;
    
    // As we enter black hole, push ship forward away from camera into the hole
    const targetZ = isEnteringBlackHole ? state.camera.position.z - 20 : state.camera.position.z - 8;
    
    // Smooth follow
    mesh.current.position.y = THREE.MathUtils.lerp(mesh.current.position.y, targetY, 0.1);
    mesh.current.position.x = THREE.MathUtils.lerp(mesh.current.position.x, targetX, 0.1);
    mesh.current.position.z = THREE.MathUtils.lerp(mesh.current.position.z, targetZ, 0.05);
    
    // Dynamic Banking
    const scrollDelta = scroll.delta;
    const { x } = state.pointer;
    
    // Reduce banking when entering black hole for stability
    const bankingIntensity = isEnteringBlackHole ? 0 : 1;

    mesh.current.rotation.z = ((scrollDelta * -30) + (x * -0.5)) * bankingIntensity;
    mesh.current.rotation.y = Math.PI + (x * 0.2 * bankingIntensity);
    
    // Engine Pulse
    if (engineRef.current) {
        engineRef.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 20) * 0.5 + (Math.abs(scrollDelta) * 10));
    }
  });

  return (
    <group ref={mesh} position={[0, -2, 6]}>
      <Float speed={5} rotationIntensity={0.2} floatIntensity={0.2}>
        <group rotation={[Math.PI / 2, 0, 0]}>
            <Trail width={1.5} length={12} color="#FFE66D" attenuation={(t) => t * t}>
                <mesh>
                    <coneGeometry args={[0.3, 1.5, 8]} />
                    <meshToonMaterial color="#FF6B6B" gradientMap={toonGradientMap} />
                    <Outlines thickness={0.05} color="#2D3436" />
                </mesh>
            </Trail>
        </group>
        <mesh position={[0, 0.2, 0]} rotation={[Math.PI / 2, 0, 0]} scale={[2.5, 0.5, 0.1]}>
          <boxGeometry args={[0.8, 0.8, 0.1]} />
          <meshToonMaterial color="white" gradientMap={toonGradientMap} />
          <Outlines thickness={0.05} color="#2D3436" />
        </mesh>
        <mesh ref={engineRef} position={[0, 0.8, 0]}>
           <sphereGeometry args={[0.2]} />
           <meshBasicMaterial color="#FFE66D" />
        </mesh>
      </Float>
    </group>
  );
};

const BlackHole = ({ position }) => {
    const diskRef = useRef();
    
    useFrame((state, delta) => {
        if(diskRef.current) {
            diskRef.current.rotation.z -= delta * 0.5;
        }
    });

    return (
        <group position={position}>
            {/* Event Horizon (The Void) */}
            <mesh scale={[1,1,1]}>
                <sphereGeometry args={[4, 64, 64]} />
                <meshBasicMaterial color="#000000" fog={false} />
            </mesh>
            
            {/* Photon Ring (Glowing Edge) */}
            <mesh scale={[1.05, 1.05, 1.05]}>
                <sphereGeometry args={[4, 64, 64]} />
                <meshBasicMaterial color="#FF6B6B" transparent opacity={0.2} side={THREE.BackSide} />
            </mesh>

            {/* Accretion Disk */}
            <group ref={diskRef} rotation={[1.2, 0, 0]}>
                {/* Inner Hot Disk */}
                <mesh>
                    <torusGeometry args={[7, 1.5, 32, 100]} />
                    <MeshTransmissionMaterial 
                        backside
                        samples={8}
                        thickness={2}
                        chromaticAberration={1}
                        anisotropy={1}
                        distortion={2}
                        distortionScale={2}
                        temporalDistortion={0.2}
                        color="#FF9F43"
                        emissive="#FF9F43"
                        emissiveIntensity={2}
                        toneMapped={false}
                    />
                </mesh>
                {/* Outer Dust */}
                <mesh rotation={[0,0,Math.PI/4]} scale={[1.5, 1.5, 0.2]}>
                    <torusGeometry args={[8, 2, 32, 100]} />
                    <meshBasicMaterial color="#54A0FF" transparent opacity={0.1} />
                </mesh>
            </group>

            {/* Gravitational Lensing Bubble */}
            <mesh scale={[1.5, 1.5, 1.5]}>
                <sphereGeometry args={[6, 32, 32]} />
                <MeshTransmissionMaterial 
                    backside
                    thickness={5}
                    chromaticAberration={0.5}
                    distortion={3}
                    distortionScale={1}
                    color="#000000"
                    roughness={0}
                    opacity={0.1}
                    transparent
                />
            </mesh>
        </group>
    )
}

// ... (Retaining previous component definitions: Planet, Earth, AsteroidBelt, SpaceStation, SpaceWhales, ExperiencePillar, etc. to save space, assuming they are unchanged unless requested)
const Planet = ({ position, size, color, ring, textureType = "smooth" }) => {
    return (
        <group position={position}>
            <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
                <mesh>
                    {textureType === "crater" ? (
                        <dodecahedronGeometry args={[size, 1]} /> 
                    ) : (
                        <sphereGeometry args={[size, 32, 32]} />
                    )}
                    <meshToonMaterial color={color} gradientMap={toonGradientMap} />
                    <Outlines thickness={0.03} color="#2D3436" />
                </mesh>
                {ring && (
                    <mesh rotation={[1.5, 0, 0]}>
                        <torusGeometry args={[size * 1.6, 0.15, 16, 100]} />
                        <meshToonMaterial color="#FFE66D" gradientMap={toonGradientMap} />
                        <Outlines thickness={0.03} color="#2D3436" />
                    </mesh>
                )}
            </Float>
        </group>
    )
}

const Earth = ({ position }) => {
    return (
        <group position={position}>
            <Float speed={1} rotationIntensity={0.1}>
                <mesh>
                    <sphereGeometry args={[2.5, 32, 32]} />
                    <meshToonMaterial color="#4ECDC4" gradientMap={toonGradientMap} />
                    <Outlines thickness={0.03} color="#2D3436" />
                </mesh>
                <mesh position={[1.5, 0.5, 1]} scale={0.8}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshToonMaterial color="#2ECC71" gradientMap={toonGradientMap} />
                </mesh>
                <mesh position={[-1.2, -0.5, 1.2]} scale={0.6}>
                    <sphereGeometry args={[1, 16, 16]} />
                    <meshToonMaterial color="#2ECC71" gradientMap={toonGradientMap} />
                </mesh>
                <Cloud opacity={0.5} speed={0.2} width={6} depth={1} segments={10} position={[0, 0, 1.5]} color="#FFFFFF" />
            </Float>
        </group>
    )
}

const AsteroidBelt = ({ position }) => {
  return (
    <group position={position}>
      {Array.from({ length: 15 }).map((_, i) => (
        <Float key={i} speed={Math.random() * 2 + 1} rotationIntensity={2} floatIntensity={2}>
          <mesh 
            position={[
              (Math.random() - 0.5) * 15,
              (Math.random() - 0.5) * 5,
              (Math.random() - 0.5) * 5
            ]}
            rotation={[Math.random() * Math.PI, Math.random() * Math.PI, 0]}
          >
            <dodecahedronGeometry args={[Math.random() * 0.5 + 0.2]} />
            <meshToonMaterial color={["#FF6B6B", "#4ECDC4", "#FFE66D"][i % 3]} gradientMap={toonGradientMap} />
            <Outlines thickness={0.02} color="#2D3436" />
          </mesh>
        </Float>
      ))}
    </group>
  );
};

const SpaceStation = ({ position }) => {
  return (
    <group position={position}>
      <Float speed={1} rotationIntensity={0.1}>
        <mesh>
          <cylinderGeometry args={[1, 1, 3, 16]} />
          <meshToonMaterial color="#E0E8E8" gradientMap={toonGradientMap} />
          <Outlines thickness={0.03} color="#2D3436" />
        </mesh>
        <mesh rotation={[Math.PI/2, 0, 0]}>
          <torusGeometry args={[2.5, 0.3, 16, 32]} />
          <meshToonMaterial color="#FFE66D" gradientMap={toonGradientMap} />
          <Outlines thickness={0.03} color="#2D3436" />
        </mesh>
        {[0, 1, 2, 3].map((i) => (
          <mesh key={i} rotation={[0, 0, (Math.PI/2) * i]} position={[0,0,0]}>
             <boxGeometry args={[0.2, 5, 0.2]} />
             <meshToonMaterial color="#2D3436" />
          </mesh>
        ))}
      </Float>
    </group>
  );
};

const SpaceWhales = () => {
  return (
    <group>
      {Array.from({ length: 5 }).map((_, i) => (
        <Float key={i} speed={2} floatIntensity={2} rotationIntensity={0.5}>
          <group 
            position={[
              (Math.random() - 0.5) * 40,
              -50 + (Math.random() - 0.5) * 100, 
              (Math.random() - 0.5) * 30
            ]}
            rotation={[0, Math.PI / 2, 0]}
          >
             <mesh>
               <coneGeometry args={[0.5, 2, 8]} />
               <meshToonMaterial color="#54A0FF" transparent opacity={0.6} />
             </mesh>
             <mesh position={[0, -1.2, 0]} rotation={[0,0,Math.PI]}>
               <coneGeometry args={[0.3, 1, 8]} />
               <meshToonMaterial color="#54A0FF" transparent opacity={0.6} />
             </mesh>
          </group>
        </Float>
      ))}
    </group>
  )
}

const ExperiencePillar = ({ position, height, year, role }) => {
  return (
    <group position={position}>
      <mesh position={[0, height/2, 0]}>
        <boxGeometry args={[0.8, height, 0.8]} />
        <meshToonMaterial color="#FFE66D" gradientMap={toonGradientMap} />
        <Outlines thickness={0.03} color="#2D3436" />
      </mesh>
      <Float speed={2} rotationIntensity={0} floatIntensity={0.5}>
        <Text 
          position={[1.2, height - 0.5, 0]} 
          fontSize={0.3} 
          color="#2D3436" 
          font="/fonts/ArchivoBlack.ttf"
          anchorX="left"
        >
          {year}
        </Text>
        <Text 
          position={[1.2, height - 1.0, 0]} 
          fontSize={0.2} 
          color="#2D3436" 
          font="/fonts/SpaceMono.ttf"
          anchorX="left"
        >
          {role}
        </Text>
      </Float>
    </group>
  );
};

// --- SCENE CONTENT ---

const SceneContent = ({ setBgColor }) => {
  const scroll = useScroll();
  
  useFrame((state) => {
    const offset = scroll.offset;
    
    // JOURNEY PATH CALCULATIONS
    
    // Weave logic: stop weaving when approaching black hole (offset > 0.85)
    const weaveFactor = offset > 0.85 ? Math.max(0, 1 - (offset - 0.85) * 10) : 1;
    state.camera.position.x = (Math.sin(offset * Math.PI * 6) * 3 * weaveFactor) + (state.pointer.x * 0.5);
    
    // Y Position: Deeper descent to -200 (Contact)
    // Black Hole is at -175
    state.camera.position.y = THREE.MathUtils.lerp(0, -200, offset);
    
    // Z Position: 
    // Start at ~12.
    // At Offset 0.9 (Entering Black Hole), we dive deep into the screen (Z -> -5) to "pass through"
    const targetZ = offset > 0.85 ? -5 : 12;
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, 0.05);

    // Camera LookAt target (always look slightly ahead/down)
    // When in black hole, look straight at it
    const lookAtY = offset > 0.85 ? -200 : state.camera.position.y - 12;
    state.camera.lookAt(0, lookAtY, 0);

    // BACKGROUND COLOR CHANGE (Event Horizon)
    if (offset > 0.88) {
        setBgColor("#000000"); // Pitch black for singularity
    } else if (offset > 0.85) {
        setBgColor("#2D0036"); // Transition purple
    } else {
        setBgColor("#E0E8E8"); // Original dusty blue
    }
  });

  return (
    <>
      <ambientLight intensity={0.9} />
      <directionalLight position={[20, 20, 10]} intensity={1.2} castShadow />
      <fog attach="fog" args={['#E0E8E8', 10, 50]} />

      <TravelerShip scroll={scroll} />
      <SpeedLines scroll={scroll} />
      <SpaceWhales />
      
      {/* ACT 1: EARTH (LAUNCHPAD) - Offset 0 */}
      <group position={[0, 0, -5]}>
        <Earth position={[0, 0, 0]} />
      </group>

      {/* ACT 2: NEBULA (PHILOSOPHY) - Offset 0.12 */}
      <group position={[0, -25, -5]}>
         <Cloud opacity={0.5} speed={0.1} width={20} depth={5} segments={20} position={[0, 0, -5]} color="#A29BFE" />
         <Float speed={2}>
            <Text fontSize={0.5} color="#2D3436" position={[0, 2, 0]} font="/fonts/ArchivoBlack.ttf">
               THE VOID
            </Text>
         </Float>
      </group>

      {/* ACT 3: PLANET 1 (ABOUT) - Offset 0.25 */}
      <group position={[0, -50, -5]}>
         <Planet position={[4, 0, 0]} size={2} color="#2ECC71" textureType="smooth" />
         <Cloud opacity={0.6} position={[4, 0, 2]} />
      </group>

      {/* ACT 4: ASTEROID FIELD (SKILLS) - Offset 0.37 */}
      <group position={[0, -75, -5]}>
         <AsteroidBelt position={[0, 0, 0]} />
         <AsteroidBelt position={[0, -5, 2]} />
      </group>

      {/* ACT 5: PLANET 2 (EXPERIENCE) - Offset 0.50 */}
      <group position={[0, -100, -5]}>
         <Planet position={[-3, 0, -2]} size={3} color="#D6A2E8" textureType="crater" />
         <ExperiencePillar position={[-2, 1, 1]} height={3} year="2024" role="Senior Dev" />
         <ExperiencePillar position={[-4, -1, 0]} height={2} year="2022" role="Engineer" />
      </group>

      {/* ACT 6: SPACE STATION (PROJECTS) - Offset 0.62 */}
      <group position={[0, -125, -5]}>
         <SpaceStation position={[3, 0, 0]} />
      </group>

      {/* ACT 7: ARCHIVE (EDUCATION) - Offset 0.75 */}
      <group position={[0, -150, -5]}>
         <Planet position={[-3, 0, 0]} size={1.5} color="#FFE66D" ring={true} />
         <group position={[-3, 2, 0]}>
            <Text fontSize={0.3} color="#2D3436" font="/fonts/ArchivoBlack.ttf">
               ACADEMY
            </Text>
         </group>
      </group>

      {/* ACT 8: EVENT HORIZON - Offset 0.87 */}
      {/* Positioned at -175 to align with flight path */}
      <group position={[0, -175, 0]}>
         <BlackHole position={[0, 0, 0]} />
         <Sparkles count={200} scale={20} size={5} speed={2} color="#FFFFFF" />
      </group>

      {/* ACT 9: SINGULARITY (CONTACT) - Offset 1.0 */}
      <group position={[0, -200, 0]}>
         <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
      </group>
    </>
  );
};

// --- HTML OVERLAY ---

const OverlayContent = () => {
  return (
    <Scroll html style={{ width: '100%' }}>
      
      {/* 1. EARTH (HERO) */}
      <section className="h-screen w-full flex flex-col items-center justify-center p-8 text-center">
        <div className="font-mono text-xs tracking-[0.4em] mb-4 text-[#FF6B6B] uppercase">
          Mission Control
        </div>
        <h1 className="font-title text-[12vw] md:text-[9vw] leading-[0.85] text-[#2D3436] mb-6 uppercase">
          {PERSONAL_DETAILS.name}
        </h1>
        <p className="font-mono text-sm max-w-md mx-auto text-[#2D3436]/80 leading-relaxed mb-12">
          {PERSONAL_DETAILS.tagline}<br/>
          {PERSONAL_DETAILS.role}
        </p>
      </section>

      {/* 2. NEBULA (PHILOSOPHY) */}
      <section className="h-[80vh] w-full flex items-center justify-center p-8">
        <div className="max-w-md text-center">
          <div className="font-mono text-xs tracking-[0.4em] mb-2 text-[#A29BFE] uppercase">
            Sector 01: The Void
          </div>
          <h2 className="font-title text-4xl text-[#2D3436] mb-4">DESIGN THINKING</h2>
          <p className="font-mono text-sm leading-relaxed text-[#2D3436]/80">
            "Before code comes clarity. I navigate the abstract chaos of ideas to find the structured reality of software."
          </p>
        </div>
      </section>

      {/* 3. PLANET 1 (ABOUT) */}
      <section className="h-[80vh] w-full flex items-center justify-end p-8 md:p-24">
        <div className="max-w-md bg-white/80 backdrop-blur-sm p-8 border-r-4 border-[#2ECC71] shadow-lg rounded-l-xl text-right">
          <div className="font-mono text-xs tracking-[0.4em] mb-2 text-[#2ECC71] uppercase">
            Sector 02: Terra Nova
          </div>
          <h2 className="font-title text-4xl text-[#2D3436] mb-4">THE EXPLORER</h2>
          <p className="font-mono text-sm leading-relaxed text-[#2D3436]/80">
            Creative technologist building accessible, performant, and beautiful digital experiences.
          </p>
        </div>
      </section>

      {/* 4. ASTEROID BELT (SKILLS) */}
      <section className="h-[80vh] w-full flex items-center justify-start p-8 md:p-24">
        <div className="max-w-4xl w-full">
          <div className="font-mono text-xs tracking-[0.4em] mb-6 text-[#54A0FF] uppercase text-center">
            Sector 03: The Belt
          </div>
          <h2 className="font-title text-4xl text-[#2D3436] mb-8 text-center">CORE SYSTEMS</h2>
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

      {/* 5. PLANET 2 (EXPERIENCE) */}
      <section className="h-[80vh] w-full flex items-center justify-end p-8 md:p-24">
        <div className="max-w-md bg-white/80 backdrop-blur-sm p-8 border-r-4 border-[#D6A2E8] shadow-lg rounded-l-xl text-right">
          <div className="font-mono text-xs tracking-[0.4em] mb-2 text-[#D6A2E8] uppercase">
            Sector 04: Industria
          </div>
          <h2 className="font-title text-4xl text-[#2D3436] mb-4">MISSION LOGS</h2>
          <div className="space-y-6 font-mono text-sm text-[#2D3436]">
             {EXPERIENCE.map((exp, i) => (
                 <div key={i}>
                   <div className="flex justify-between font-bold">
                     <span>{exp.role.toUpperCase()}</span>
                     <span>{exp.year}</span>
                   </div>
                   <div className="text-xs opacity-60 mb-1">{exp.company}</div>
                   <p className="text-xs leading-relaxed opacity-80">{exp.desc}</p>
                 </div>
             ))}
          </div>
        </div>
      </section>

      {/* 6. SPACE STATION (PROJECTS) */}
      <section className="h-[80vh] w-full flex items-center justify-start p-8 md:p-24">
         <div className="max-w-md">
            <div className="font-mono text-xs tracking-[0.4em] mb-4 text-[#FF6B6B] uppercase">
              Sector 05: Orbital Hub
            </div>
            <h2 className="font-title text-6xl text-[#2D3436] mb-8">PROJECTS</h2>
            <div className="flex flex-col gap-6">
               {PROJECTS.map((project) => (
                  <a 
                    key={project.id}
                    href={project.link}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-white/90 p-4 rounded shadow-lg border-l-4 hover:translate-x-2 transition-transform block text-decoration-none"
                    style={{ borderColor: project.color }}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-bold text-[#2D3436]">{project.title}</h3>
                      <ExternalLink className="w-4 h-4 opacity-50 text-[#2D3436]" />
                    </div>
                    <p className="text-xs text-[#2D3436]/80 mb-2">{project.desc}</p>
                    <div className="flex flex-wrap gap-1">
                      {project.tech.map((t, i) => (
                        <span key={i} className="px-1.5 py-0.5 bg-[#E0E8E8] rounded text-[9px] font-bold text-[#2D3436] font-mono">{t}</span>
                      ))}
                    </div>
                  </a>
               ))}
            </div>
         </div>
      </section>

      {/* 7. ARCHIVE (EDUCATION) */}
      <section className="h-[80vh] w-full flex items-center justify-end p-8 md:p-24">
        <div className="max-w-md bg-white/80 backdrop-blur-sm p-8 border-r-4 border-[#FFE66D] shadow-lg rounded-l-xl text-right">
          <div className="font-mono text-xs tracking-[0.4em] mb-2 text-[#FFE66D] uppercase">
            Sector 06: The Archive
          </div>
          <h2 className="font-title text-4xl text-[#2D3436] mb-4">DATA BANK</h2>
          <div className="font-mono text-sm text-[#2D3436]/80">
            <div className="mb-2 font-bold">B.Tech Computer Science</div>
            <ul className="space-y-2">
              <li>• Oracle Cloud Infrastructure 2025 Certified AI Foundations Associate</li>
              <li>• Oracle Cloud Infrastructure 2025 Certified Generative AI Professional</li>
            </ul>
          </div>
        </div>
      </section>

      {/* 8. BLACK HOLE */}
      <section className="h-[100vh] w-full flex items-center justify-center p-8">
         <h2 className="font-title text-4xl md:text-6xl text-white text-center animate-pulse mix-blend-difference">
            CROSSING<br/>THE HORIZON
         </h2>
      </section>

      {/* 9. CONTACT (NEW GALAXY) */}
      <section className="h-[100vh] w-full flex flex-col items-center justify-center p-8 text-center text-white">
        <div className="font-mono text-xs tracking-[0.4em] mb-4 text-[#54A0FF] uppercase">
          Sector 07: Singularity
        </div>
        <h2 className="font-title text-6xl md:text-9xl mb-12">
          HELLO<br/>WORLD
        </h2>
        <div className="flex gap-6 pointer-events-auto">
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
      </section>

    </Scroll>
  );
};

// --- MAIN APP ---

export default function Portfolio() {
  const [bgColor, setBgColor] = useState("#E0E8E8");

  return (
    <>
      <GlobalStyles />
      <CustomCursor />
      <div style={{ width: '100vw', height: '100vh', transition: 'background-color 2s ease' }} className="bg-transition">
        <Canvas shadows dpr={[1, 2]}>
          <color attach="background" args={[bgColor]} />
          <fog attach="fog" args={[bgColor, 5, 40]} />
          
          {/* Increased pages to accommodate new sections */}
          <ScrollControls pages={12} damping={0.2}>
            <SceneContent setBgColor={setBgColor} />
            <OverlayContent />
          </ScrollControls>
        </Canvas>
        
        <div className="fixed top-8 left-8 z-50 font-title text-xl text-[#2D3436] mix-blend-difference pointer-events-none">
          JB.
        </div>
        <div className="fixed top-8 right-8 z-50 font-mono text-[10px] text-[#2D3436] mix-blend-difference pointer-events-none opacity-60">
          SYSTEM: ONLINE
        </div>
      </div>
    </>
  );
}