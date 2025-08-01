import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Profilecard from './components/Profilecard'
// import Backgroundshapes from './components/Backgroundshapes'
import Particles from '../components/Particles'

function App() {
  return (
    <div className='bg-black font-mono'>
      {/* <SplashCursor /> */}
      {/* <Backgroundshapes /> */}
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

      <Navbar />
      {/* Flex container for Profilecard and Hero */}
      <Hero />
       {/* <div className="flex flex-row items-start justify-center gap-8 mt-8 relative z-10">
        <Profilecard />
        
      </div> */}
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;