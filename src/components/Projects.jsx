import { useRef, useEffect, useState, useCallback } from "react";
import { ExternalLink, Code, Globe, Folder } from "lucide-react";

const DEFAULT_PARTICLE_COUNT = 8;
const DEFAULT_SPOTLIGHT_RADIUS = 300;
const DEFAULT_GLOW_COLOR = "236, 72, 153";
const MOBILE_BREAKPOINT = 768;

// Your projects data
const projectsData = [
    { 
    name: "CaptionCraft", 
    link: "https://captioncraft-eight.vercel.app/",
    description: "An AI-powered full-stack web app that helps users generate creative and engaging captions for social media posts using Google Gemini API.",
    category: "Content",
    status: "Live"
  },
    { 
    name: "DigiTwin", 
    link: "https://digital-twin-tau.vercel.app/",
    description: "AI‑powered web app that turns user activity data into clear, personalized productivity insights.",
    category: "Healthcare",
    status: "Live"
  },
  { 
    name: "Dear Nisha", 
    link: "https://dear-nisha.vercel.app/",
    description: "A personal project with elegant design",
    category: "Personal",
    status: "Live"
  },
  { 
    name: "Dish Delight", 
    link: "https://jay26027894.github.io/Dish-delight/",
    description: "Food delivery and recipe platform",
    category: "Food & Dining",
    status: "Live"
  },
  { 
    name: "Infinity Services", 
    link: "https://jay26027894.github.io/Infinityservices/",
    description: "Professional services website",
    category: "Business",
    status: "Live"
  },
  { 
    name: "News Nest", 
    link: "https://news-nest-rho.vercel.app/",
    description: "Modern news aggregation platform",
    category: "News & Media",
    status: "Live"
  },
  { 
    name: "Portfolio Website", 
    link: "https://jay-bontawar.vercel.app/",
    description: "Personal portfolio showcase",
    category: "Portfolio",
    status: "Live"
  },
  { 
    name: "Twitter UI Clone", 
    link: "https://twitter-two-ashen.vercel.app/",
    description: "Social media interface recreation",
    category: "Social Media",
    status: "Live"
  },
  { 
    name: "iTask", 
    link: "https://itask-tan.vercel.app/",
    description: "Task management application",
    category: "Productivity",
    status: "Live"
  },
  { 
    name: "iSparx Infotech", 
    link: "",
    description: "Corporate technology solutions",
    category: "Enterprise",
    status: "Live"
  },

];

const createParticleElement = (x, y, color = DEFAULT_GLOW_COLOR) => {
  const el = document.createElement("div");
  el.className = "particle";
  el.style.cssText = `
    position: absolute;
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: rgba(${color}, 1);
    box-shadow: 0 0 4px rgba(${color}, 0.6);
    pointer-events: none;
    z-index: 100;
    left: ${x}px;
    top: ${y}px;
  `;
  return el;
};

const calculateSpotlightValues = (radius) => ({
  proximity: radius * 0.5,
  fadeDistance: radius * 0.75,
});

const updateCardGlowProperties = (card, mouseX, mouseY, glow, radius) => {
  const rect = card.getBoundingClientRect();
  const relativeX = ((mouseX - rect.left) / rect.width) * 100;
  const relativeY = ((mouseY - rect.top) / rect.height) * 100;

  card.style.setProperty("--glow-x", `${relativeX}%`);
  card.style.setProperty("--glow-y", `${relativeY}%`);
  card.style.setProperty("--glow-intensity", glow.toString());
  card.style.setProperty("--glow-radius", `${radius}px`);
};

const ParticleCard = ({
  children,
  className = "",
  disableAnimations = false,
  style,
  particleCount = DEFAULT_PARTICLE_COUNT,
  glowColor = DEFAULT_GLOW_COLOR,
  enableTilt = true,
  clickEffect = false,
  enableMagnetism = false,
  onClick
}) => {
  const cardRef = useRef(null);
  const particlesRef = useRef([]);
  const timeoutsRef = useRef([]);
  const isHoveredRef = useRef(false);
  const memoizedParticles = useRef([]);
  const particlesInitialized = useRef(false);

  const initializeParticles = useCallback(() => {
    if (particlesInitialized.current || !cardRef.current) return;

    const { width, height } = cardRef.current.getBoundingClientRect();
    memoizedParticles.current = Array.from({ length: particleCount }, () =>
      createParticleElement(
        Math.random() * width,
        Math.random() * height,
        glowColor
      )
    );
    particlesInitialized.current = true;
  }, [particleCount, glowColor]);

  const clearAllParticles = useCallback(() => {
    timeoutsRef.current.forEach(clearTimeout);
    timeoutsRef.current = [];

    particlesRef.current.forEach((particle) => {
      if (particle.parentNode) {
        particle.style.transition = 'all 0.3s ease-out';
        particle.style.opacity = '0';
        particle.style.transform = 'scale(0)';
        setTimeout(() => {
          if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
          }
        }, 300);
      }
    });
    particlesRef.current = [];
  }, []);

  const animateParticles = useCallback(() => {
    if (!cardRef.current || !isHoveredRef.current) return;

    if (!particlesInitialized.current) {
      initializeParticles();
    }

    memoizedParticles.current.forEach((particle, index) => {
      const timeoutId = setTimeout(() => {
        if (!isHoveredRef.current || !cardRef.current) return;

        const clone = particle.cloneNode(true);
        cardRef.current.appendChild(clone);
        particlesRef.current.push(clone);

        // Animate particle appearance
        clone.style.transform = 'scale(0)';
        clone.style.opacity = '0';
        
        requestAnimationFrame(() => {
          clone.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
          clone.style.transform = 'scale(1)';
          clone.style.opacity = '1';
        });

        // Floating animation
        const animateFloat = () => {
          if (!isHoveredRef.current) return;
          
          const x = (Math.random() - 0.5) * 60;
          const y = (Math.random() - 0.5) * 60;
          const rotation = Math.random() * 360;
          
          clone.style.transition = 'transform 2s ease-in-out';
          clone.style.transform = `translate(${x}px, ${y}px) rotate(${rotation}deg) scale(1)`;
          
          setTimeout(() => {
            if (isHoveredRef.current) {
              animateFloat();
            }
          }, 2000);
        };
        
        setTimeout(animateFloat, 100);

      }, index * 80);

      timeoutsRef.current.push(timeoutId);
    });
  }, [initializeParticles]);

  useEffect(() => {
    if (disableAnimations || !cardRef.current) return;

    const element = cardRef.current;

    const handleMouseEnter = () => {
      isHoveredRef.current = true;
      animateParticles();

      if (enableTilt) {
        element.style.transition = 'transform 0.3s ease-out';
        element.style.transform = 'perspective(1000px) rotateX(5deg) rotateY(5deg)';
      }
    };

    const handleMouseLeave = () => {
      isHoveredRef.current = false;
      clearAllParticles();

      if (enableTilt) {
        element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
      }

      if (enableMagnetism) {
        element.style.transform += ' translate(0px, 0px)';
      }
    };

    const handleMouseMove = (e) => {
      if (!enableTilt && !enableMagnetism) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      if (enableTilt) {
        const rotateX = ((y - centerY) / centerY) * -8;
        const rotateY = ((x - centerX) / centerX) * 8;

        element.style.transition = 'transform 0.1s ease-out';
        element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      }

      if (enableMagnetism) {
        const magnetX = (x - centerX) * 0.03;
        const magnetY = (y - centerY) * 0.03;

        element.style.transform += ` translate(${magnetX}px, ${magnetY}px)`;
      }
    };

    const handleClick = (e) => {
      if (onClick) {
        onClick(e);
      }

      if (!clickEffect) return;

      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const maxDistance = Math.max(
        Math.hypot(x, y),
        Math.hypot(x - rect.width, y),
        Math.hypot(x, y - rect.height),
        Math.hypot(x - rect.width, y - rect.height)
      );

      const ripple = document.createElement("div");
      ripple.style.cssText = `
        position: absolute;
        width: ${maxDistance * 2}px;
        height: ${maxDistance * 2}px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(${glowColor}, 0.4) 0%, rgba(${glowColor}, 0.2) 30%, transparent 70%);
        left: ${x - maxDistance}px;
        top: ${y - maxDistance}px;
        pointer-events: none;
        z-index: 1000;
        transform: scale(0);
        opacity: 1;
      `;

      element.appendChild(ripple);

      ripple.style.transition = 'all 0.8s ease-out';
      requestAnimationFrame(() => {
        ripple.style.transform = 'scale(1)';
        ripple.style.opacity = '0';
      });

      setTimeout(() => ripple.remove(), 800);
    };

    element.addEventListener("mouseenter", handleMouseEnter);
    element.addEventListener("mouseleave", handleMouseLeave);
    element.addEventListener("mousemove", handleMouseMove);
    element.addEventListener("click", handleClick);

    return () => {
      isHoveredRef.current = false;
      element.removeEventListener("mouseenter", handleMouseEnter);
      element.removeEventListener("mouseleave", handleMouseLeave);
      element.removeEventListener("mousemove", handleMouseMove);
      element.removeEventListener("click", handleClick);
      clearAllParticles();
    };
  }, [animateParticles, clearAllParticles, disableAnimations, enableTilt, enableMagnetism, clickEffect, glowColor, onClick]);

  return (
    <div
      ref={cardRef}
      className={`${className} relative overflow-hidden cursor-pointer`}
      style={{ ...style, position: "relative", overflow: "hidden" }}
    >
      {children}
    </div>
  );
};

const GlobalSpotlight = ({
  gridRef,
  disableAnimations = false,
  enabled = true,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  glowColor = DEFAULT_GLOW_COLOR,
}) => {
  const spotlightRef = useRef(null);

  useEffect(() => {
    if (disableAnimations || !gridRef?.current || !enabled) return;

    const spotlight = document.createElement("div");
    spotlight.className = "global-spotlight";
    spotlight.style.cssText = `
      position: fixed;
      width: 600px;
      height: 600px;
      border-radius: 50%;
      pointer-events: none;
      background: radial-gradient(circle,
        rgba(${glowColor}, 0.12) 0%,
        rgba(${glowColor}, 0.06) 15%,
        rgba(${glowColor}, 0.03) 25%,
        rgba(${glowColor}, 0.015) 40%,
        rgba(${glowColor}, 0.008) 65%,
        transparent 70%
      );
      z-index: 200;
      opacity: 0;
      transform: translate(-50%, -50%);
      mix-blend-mode: screen;
      transition: all 0.3s ease-out;
    `;
    document.body.appendChild(spotlight);
    spotlightRef.current = spotlight;

    const handleMouseMove = (e) => {
      if (!spotlightRef.current || !gridRef.current) return;

      const section = gridRef.current.closest(".projects-section");
      const rect = section?.getBoundingClientRect();
      const mouseInside =
        rect &&
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom;

      const cards = gridRef.current.querySelectorAll(".project-card");

      if (!mouseInside) {
        spotlightRef.current.style.opacity = '0';
        cards.forEach((card) => {
          card.style.setProperty("--glow-intensity", "0");
        });
        return;
      }

      const { proximity, fadeDistance } = calculateSpotlightValues(spotlightRadius);
      let minDistance = Infinity;

      cards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();
        const centerX = cardRect.left + cardRect.width / 2;
        const centerY = cardRect.top + cardRect.height / 2;
        const distance =
          Math.hypot(e.clientX - centerX, e.clientY - centerY) -
          Math.max(cardRect.width, cardRect.height) / 2;
        const effectiveDistance = Math.max(0, distance);

        minDistance = Math.min(minDistance, effectiveDistance);

        let glowIntensity = 0;
        if (effectiveDistance <= proximity) {
          glowIntensity = 1;
        } else if (effectiveDistance <= fadeDistance) {
          glowIntensity =
            (fadeDistance - effectiveDistance) / (fadeDistance - proximity);
        }

        updateCardGlowProperties(card, e.clientX, e.clientY, glowIntensity, spotlightRadius);
      });

      spotlightRef.current.style.left = e.clientX + 'px';
      spotlightRef.current.style.top = e.clientY + 'px';

      const targetOpacity =
        minDistance <= proximity
          ? 0.6
          : minDistance <= fadeDistance
            ? ((fadeDistance - minDistance) / (fadeDistance - proximity)) * 0.6
            : 0;

      spotlightRef.current.style.opacity = targetOpacity;
    };

    const handleMouseLeave = () => {
      gridRef.current?.querySelectorAll(".project-card").forEach((card) => {
        card.style.setProperty("--glow-intensity", "0");
      });
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = '0';
      }
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      spotlightRef.current?.parentNode?.removeChild(spotlightRef.current);
    };
  }, [gridRef, disableAnimations, enabled, spotlightRadius, glowColor]);

  return null;
};

const useMobileDetection = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () =>
      setIsMobile(window.innerWidth <= MOBILE_BREAKPOINT);

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return isMobile;
};

const Projects = ({
  textAutoHide = true,
  enableStars = true,
  enableSpotlight = true,
  enableBorderGlow = true,
  disableAnimations = false,
  spotlightRadius = DEFAULT_SPOTLIGHT_RADIUS,
  particleCount = DEFAULT_PARTICLE_COUNT,
  enableTilt = true,
  glowColor = DEFAULT_GLOW_COLOR,
  clickEffect = true,
  enableMagnetism = true,
}) => {
  const gridRef = useRef(null);
  const isMobile = useMobileDetection();
  const shouldDisableAnimations = disableAnimations || isMobile;

  const handleProjectClick = (project) => {
    if (project.link) {
      window.open(project.link, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <>
      <style>
        {`
          .projects-section {
            --glow-x: 50%;
            --glow-y: 50%;
            --glow-intensity: 0;
            --glow-radius: 200px;
            --glow-color: ${glowColor};
            --border-color: rgba(236, 72, 153, 0.2);
            --background-dark: rgba(0, 0, 0, 0.8);
            --card-bg: rgba(0, 0, 0, 0.6);
            --white: hsl(0, 0%, 100%);
            --pink-primary: rgba(236, 72, 153, 1);
            --pink-secondary: rgba(219, 39, 119, 1);
            --pink-glow: rgba(236, 72, 153, 0.3);
            --pink-border: rgba(236, 72, 153, 0.4);
            --text-muted: rgba(255, 255, 255, 0.7);
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(20px);
            min-height: 100vh;
            padding: 2rem 1rem;
          }
          
          .projects-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
            gap: 1.5rem;
            max-width: 1400px;
            margin: 0 auto;
            padding: 2rem 0;
          }
          
          @media (min-width: 768px) {
            .projects-grid {
              grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
              gap: 2rem;
            }
          }
          
          @media (min-width: 1200px) {
            .projects-grid {
              grid-template-columns: repeat(3, 1fr);
            }
          }
          
          .project-card {
            background: var(--card-bg);
            border: 1px solid var(--border-color);
            border-radius: 20px;
            min-height: 200px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            backdrop-filter: blur(15px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          }
          
          .project-card:hover {
            transform: translateY(-4px);
            box-shadow: 
              0 20px 40px rgba(236, 72, 153, 0.15),
              0 8px 16px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(236, 72, 153, 0.3);
            border-color: rgba(236, 72, 153, 0.5);
            background: rgba(0, 0, 0, 0.7);
          }
          
          .project-card--border-glow::after {
            content: '';
            position: absolute;
            inset: 0;
            padding: 1px;
            background: radial-gradient(var(--glow-radius) circle at var(--glow-x) var(--glow-y),
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.6)) 0%,
                rgba(${glowColor}, calc(var(--glow-intensity) * 0.3)) 30%,
                transparent 60%);
            border-radius: inherit;
            mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            mask-composite: subtract;
            -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
            -webkit-mask-composite: xor;
            pointer-events: none;
            transition: opacity 0.3s ease;
            z-index: 1;
          }
          
          .project-card--border-glow:hover::after {
            opacity: 1;
          }
          
          .particle::before {
            content: '';
            position: absolute;
            top: -1px;
            left: -1px;
            right: -1px;
            bottom: -1px;
            background: rgba(${glowColor}, 0.15);
            border-radius: 50%;
            z-index: -1;
          }
          
          .status-badge {
            display: inline-flex;
            align-items: center;
            gap: 0.25rem;
            padding: 0.25rem 0.75rem;
            border-radius: 9999px;
            font-size: 0.75rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.025em;
          }
          
          .status-live {
            background: rgba(236, 72, 153, 0.1);
            color: rgb(236, 72, 153);
            border: 1px solid rgba(236, 72, 153, 0.3);
          }
          
          .status-development {
            background: rgba(59, 130, 246, 0.1);
            color: rgb(59, 130, 246);
            border: 1px solid rgba(59, 130, 246, 0.3);
          }
          
          .status-dot {
            width: 6px;
            height: 6px;
            border-radius: 50%;
            background: currentColor;
          }
          
          .project-link-icon {
            opacity: 0;
            transform: translateX(-8px);
            transition: all 0.3s ease;
            color: rgb(236, 72, 153);
          }
          
          .project-card:hover .project-link-icon {
            opacity: 1;
            transform: translateX(0);
          }
          
          .text-clamp-1 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
            line-clamp: 1;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .text-clamp-2 {
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          @media (max-width: 767px) {
            .projects-grid {
              grid-template-columns: 1fr;
              gap: 1rem;
              padding: 1rem 0;
            }
            
            .project-card {
              min-height: 160px;
            }
          }
        `}
      </style>

      <div className="projects-section">
        {enableSpotlight && (
          <GlobalSpotlight
            gridRef={gridRef}
            disableAnimations={shouldDisableAnimations}
            enabled={enableSpotlight}
            spotlightRadius={spotlightRadius}
            glowColor={glowColor}
          />
        )}

        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            <span className="text-pink-400">My</span> Projects
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
            A collection of projects I've built, ranging from web applications to interactive experiences
          </p>
        </div>

        <div ref={gridRef} className="projects-grid">
          {projectsData.map((project, index) => {
            const baseClassName = `project-card flex flex-col justify-between p-6 relative ${
              enableBorderGlow ? "project-card--border-glow" : ""
            }`;

            const cardStyle = {
              "--glow-x": "50%",
              "--glow-y": "50%",
              "--glow-intensity": "0",
              "--glow-radius": "200px",
            };

            if (enableStars) {
              return (
                <ParticleCard
                  key={index}
                  className={baseClassName}
                  style={cardStyle}
                  disableAnimations={shouldDisableAnimations}
                  particleCount={particleCount}
                  glowColor={glowColor}
                  enableTilt={enableTilt}
                  clickEffect={clickEffect}
                  enableMagnetism={enableMagnetism}
                  onClick={() => handleProjectClick(project)}
                >
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/30">
                          {project.link ? <Globe className="w-5 h-5 text-pink-400" /> : <Folder className="w-5 h-5 text-pink-400" />}
                        </div>
                        <div className={`status-badge ${project.status === 'Live' ? 'status-live' : 'status-development'}`}>
                          <div className="status-dot"></div>
                          {project.status}
                        </div>
                      </div>
                      {project.link && (
                        <ExternalLink className="w-5 h-5 text-pink-400 project-link-icon" />
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className={`text-xl font-semibold text-white mb-2 ${textAutoHide ? "text-clamp-1" : ""}`}>
                        {project.name}
                      </h3>
                      <p className={`text-gray-300 text-sm leading-relaxed mb-4 ${textAutoHide ? "text-clamp-2" : ""}`}>
                        {project.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-xs text-pink-300 font-medium bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/30">
                        {project.category}
                      </span>
                      {project.link && (
                        <span className="text-xs text-gray-400 hover:text-pink-300 transition-colors">
                          Click to visit →
                        </span>
                      )}
                    </div>
                  </div>
                </ParticleCard>
              );
            }

            return (
              <div
                key={index}
                className={baseClassName}
                style={cardStyle}
                onClick={() => handleProjectClick(project)}
              >
                <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-pink-500/10 border border-pink-500/30">
                          {project.link ? <Globe className="w-5 h-5 text-pink-400" /> : <Folder className="w-5 h-5 text-pink-400" />}
                        </div>
                        <div className={`status-badge ${project.status === 'Live' ? 'status-live' : 'status-development'}`}>
                          <div className="status-dot"></div>
                          {project.status}
                        </div>
                      </div>
                      {project.link && (
                        <ExternalLink className="w-5 h-5 text-pink-400 project-link-icon" />
                      )}
                    </div>

                  <div className="flex-1">
                    <h3 className={`text-xl font-semibold text-white mb-2 ${textAutoHide ? "text-clamp-1" : ""}`}>
                      {project.name}
                    </h3>
                    <p className={`text-gray-300 text-sm leading-relaxed mb-4 ${textAutoHide ? "text-clamp-2" : ""}`}>
                      {project.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-auto">
                    <span className="text-xs text-pink-300 font-medium bg-pink-500/10 px-3 py-1 rounded-full border border-pink-500/30">
                      {project.category}
                    </span>
                    {project.link && (
                      <span className="text-xs text-gray-400 hover:text-pink-300 transition-colors">
                        Click to visit →
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Projects;