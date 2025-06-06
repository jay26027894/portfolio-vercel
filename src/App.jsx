import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Skills from './components/Skills'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
// import Backgroundshapes from './components/Backgroundshapes'
import Particles from '../components/Particles'
function App() {
  return (
    
    <div className='bg-black '>
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
  cla
    particleColors={['#FF69B4' /* Hot Pink */, '#FF1493' /* Deep Pink */]}
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
      <Hero />
      <About />
      <Skills />
      <Projects />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
