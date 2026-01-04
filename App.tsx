import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Github, 
  Linkedin, 
  Twitter, 
  Mail, 
  Cpu,
  Heart,
  MessageSquare,
  Share2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  Award
} from 'lucide-react';
import ThreeHero from './components/ThreeHero';
import NeonGame from './components/NeonGame';
import { SKILLS, PROJECTS, SOCIALS, CERTIFICATES } from './constants';

gsap.registerPlugin(ScrollTrigger);

const App: React.FC = () => {
  const aboutRef = useRef<HTMLElement>(null);
  const skillsRef = useRef<HTMLElement>(null);
  const certsRef = useRef<HTMLElement>(null);
  const portfolioRef = useRef<HTMLElement>(null);
  const gameRef = useRef<HTMLElement>(null);
  const contactRef = useRef<HTMLElement>(null);
  const certScrollRef = useRef<HTMLDivElement>(null);
  
  // 'idle' | 'copied'
  const [copyState, setCopyState] = useState('idle');

  useEffect(() => {
    const sections = [aboutRef, skillsRef, certsRef, portfolioRef, gameRef, contactRef];

    sections.forEach((ref) => {
      if (ref.current) {
        gsap.fromTo(
          ref.current.children,
          { opacity: 0, y: 30 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            stagger: 0.1,
            scrollTrigger: {
              trigger: ref.current,
              start: 'top 85%',
            },
          }
        );
      }
    });
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText('aml.y.k.2000@gmail.com');
    setCopyState('copied');
    setTimeout(() => setCopyState('idle'), 2000);
  };

  const scrollCerts = (direction: 'left' | 'right') => {
    if (certScrollRef.current) {
      const scrollAmount = 300;
      certScrollRef.current.scrollBy({
        left: direction === 'right' ? scrollAmount : -scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="relative w-full min-h-screen text-white overflow-x-hidden selection:bg-[#ff00ff] selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 w-full z-50 px-6 py-4 flex justify-between items-center bg-[#050011]/80 backdrop-blur-md border-b border-white/5">
        <div className="text-xl font-['Press_Start_2P'] text-transparent bg-clip-text bg-gradient-to-r from-[#00f3ff] to-[#ff00ff] cursor-pointer" onClick={() => window.scrollTo(0,0)}>
          AML<span className="text-white hidden md:inline">.PR</span>
        </div>
        <div className="hidden md:flex space-x-6 text-xs font-['Orbitron'] tracking-widest uppercase">
          {['About', 'Skills', 'Certificates', 'Portfolio', 'Game', 'Contact'].map((item) => (
            <button
              key={item}
              onClick={() => scrollToSection(item.toLowerCase())}
              className="hover:text-[#00f3ff] hover:drop-shadow-[0_0_5px_#00f3ff] transition-all duration-300"
            >
              {item}
            </button>
          ))}
        </div>
      </nav>

      {/* Hero Section */}
      <header className="relative w-full h-screen flex flex-col items-center justify-center overflow-hidden">
        <ThreeHero />
        
        {/* Main Badge/Logo Container from Image */}
        <div className="relative z-10 flex flex-col items-center">
            {/* Top Decorative Lines */}
            <div className="flex w-full max-w-2xl justify-between mb-2">
                <div className="h-2 w-16 bg-[#ff00ff] rounded-full shadow-[0_0_10px_#ff00ff]"></div>
                <div className="h-2 w-4 bg-[#00f3ff] rounded-full"></div>
            </div>

            {/* Main Neon Box */}
            <div className="relative p-8 md:p-12 border-4 border-[#00f3ff] shadow-[0_0_20px_rgba(0,243,255,0.5),inset_0_0_20px_rgba(0,243,255,0.2)] bg-black/40 backdrop-blur-sm rounded-lg mb-8 mx-4">
                 <h1 className="text-3xl md:text-6xl lg:text-7xl font-['Press_Start_2P'] text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] via-white to-[#00f3ff] animate-pulse tracking-tighter text-center">
                    PROGRAVELLER
                 </h1>
                 
                 {/* Decorative Corners */}
                 <div className="absolute -top-2 -left-2 w-6 h-6 border-t-4 border-l-4 border-[#ff00ff]"></div>
                 <div className="absolute -bottom-2 -right-2 w-6 h-6 border-b-4 border-r-4 border-[#ff00ff]"></div>
            </div>

            {/* Bottom Decorative Lines */}
            <div className="flex w-full max-w-2xl justify-between mt-2 mb-12">
                <div className="h-2 w-4 bg-[#00f3ff] rounded-full"></div>
                <div className="h-2 w-32 bg-[#ff00ff] rounded-full shadow-[0_0_10px_#ff00ff]"></div>
            </div>

            {/* Action Buttons (Like/Comment/Share Style) */}
            <div className="flex flex-wrap justify-center gap-6">
                <button onClick={() => scrollToSection('portfolio')} className="group flex items-center space-x-3 px-6 py-3 rounded-lg border border-[#ff00ff] shadow-[0_0_10px_rgba(255,0,255,0.3)] bg-black/50 hover:bg-[#ff00ff]/20 transition-all">
                    <Heart className="text-[#ff00ff] group-hover:fill-[#ff00ff]" size={20} />
                    <span className="font-['Orbitron'] text-sm tracking-widest text-[#ff00ff]">PROJECTS</span>
                </button>
                
                <button onClick={() => scrollToSection('contact')} className="group flex items-center space-x-3 px-6 py-3 rounded-lg border border-[#00f3ff] shadow-[0_0_10px_rgba(0,243,255,0.3)] bg-black/50 hover:bg-[#00f3ff]/20 transition-all">
                    <MessageSquare className="text-[#00f3ff] group-hover:fill-[#00f3ff]" size={20} />
                    <span className="font-['Orbitron'] text-sm tracking-widest text-[#00f3ff]">CONTACT</span>
                </button>

                <button onClick={() => scrollToSection('game')} className="group flex items-center space-x-3 px-6 py-3 rounded-lg border border-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.3)] bg-black/50 hover:bg-purple-500/20 transition-all">
                    <Share2 className="text-purple-500 group-hover:fill-purple-500" size={20} />
                    <span className="font-['Orbitron'] text-sm tracking-widest text-purple-500">PLAY GAME</span>
                </button>
            </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 bg-[#050011]">
        
        {/* About Section */}
        <section id="about" ref={aboutRef} className="py-24 px-6 md:px-12 max-w-7xl mx-auto border-t border-[#ff00ff]/20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-['Press_Start_2P'] text-[#00f3ff] leading-relaxed">
                PLAYER PROFILE
               </h2>
            </div>
            
            <div className="bg-black/40 p-8 rounded-xl border border-white/10 backdrop-blur-sm">
              <div className="space-y-6 text-gray-300 font-['Rajdhani'] text-lg text-center">
                <p className="border-t-4 border-b-4 border-[#ff00ff] py-4 inline-block px-8 bg-[#ff00ff]/5">
                  Level 24 Creative Developer specializing in 3D Web Experiences. I merge high-end aesthetics with clean code to build immersive digital worlds.
                </p>
                <p>
                  My mission is to gamify the web, turning static pages into interactive playgrounds. Equipped with React, Three.js, and a keen eye for Cyberpunk design.
                </p>
              </div>
              
              <div className="mt-8 grid grid-cols-2 gap-4">
                 <div className="p-4 border border-[#00f3ff]/30 rounded bg-[#00f3ff]/5 text-center">
                    <h4 className="text-[#00f3ff] font-bold mb-1">ROLE</h4>
                    <p className="text-sm">Frontend Engineer</p>
                 </div>
                 <div className="p-4 border border-[#ff00ff]/30 rounded bg-[#ff00ff]/5 text-center">
                    <h4 className="text-[#ff00ff] font-bold mb-1">EXP</h4>
                    <p className="text-sm">5+ Years</p>
                 </div>
              </div>
            </div>
          </div>
        </section>

        {/* Skills Section */}
        <section id="skills" ref={skillsRef} className="py-24 px-6 bg-black/50">
          <div className="max-w-5xl mx-auto">
             <div className="text-center mb-16">
                <h2 className="text-3xl font-['Press_Start_2P'] text-white mb-4">STATS & ABILITIES</h2>
                <div className="h-1 w-24 bg-[#ff00ff] mx-auto shadow-[0_0_10px_#ff00ff]"></div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               {SKILLS.map((skill, index) => (
                 <div key={index} className="bg-[#0a0a1a] p-6 rounded border border-white/5 hover:border-[#00f3ff] transition-colors group">
                   <div className="flex justify-between items-end mb-4 font-['Orbitron']">
                     <span className="text-lg group-hover:text-[#00f3ff] transition-colors">{skill.name}</span>
                     <span className="text-[#ff00ff]">{skill.level}/100</span>
                   </div>
                   {/* Pixelated Progress Bar */}
                   <div className="w-full h-4 bg-gray-900 border border-gray-700 p-1">
                     <div 
                       className="h-full bg-gradient-to-r from-[#00f3ff] to-[#ff00ff] shadow-[0_0_10px_#ff00ff]"
                       style={{ width: `${skill.level}%` }}
                     ></div>
                   </div>
                 </div>
               ))}
             </div>
          </div>
        </section>

        {/* Certificates Section (Horizontal Scroll) */}
        <section id="certificates" ref={certsRef} className="py-24 px-6 bg-[#08081a] relative">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h2 className="text-2xl md:text-3xl font-['Press_Start_2P'] text-[#ff00ff]">
                    ACHIEVEMENTS
                  </h2>
                  <p className="font-['Orbitron'] text-[#00f3ff] text-sm mt-2 tracking-wider">UNLOCKED CERTIFICATIONS</p>
               </div>
               
               {/* Controls */}
               <div className="flex space-x-4">
                  <button onClick={() => scrollCerts('left')} className="p-3 border border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black transition-all rounded-full">
                    <ChevronLeft size={24} />
                  </button>
                  <button onClick={() => scrollCerts('right')} className="p-3 border border-[#00f3ff] text-[#00f3ff] hover:bg-[#00f3ff] hover:text-black transition-all rounded-full">
                    <ChevronRight size={24} />
                  </button>
               </div>
            </div>

            {/* Scroll Container */}
            <div 
              ref={certScrollRef}
              className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {CERTIFICATES.map((cert) => (
                <div 
                  key={cert.id} 
                  className="flex-none w-[300px] md:w-[400px] bg-black border border-white/10 rounded-xl overflow-hidden snap-center group hover:border-[#ff00ff] hover:shadow-[0_0_15px_rgba(255,0,255,0.2)] transition-all duration-300"
                >
                   {/* Image Area */}
                   <div className="h-48 md:h-56 bg-gray-900 relative overflow-hidden">
                      <img src={cert.imageUrl} alt={cert.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500" />
                      <div className="absolute top-2 right-2 bg-black/70 backdrop-blur p-2 rounded-full border border-[#00f3ff]">
                         <Award className="text-[#00f3ff]" size={16} />
                      </div>
                   </div>
                   
                   {/* Content */}
                   <div className="p-5">
                      <div className="text-[#00f3ff] text-xs font-['Orbitron'] mb-2">{cert.date}</div>
                      <h3 className="text-white font-bold font-['Rajdhani'] text-xl leading-tight mb-2 group-hover:text-[#ff00ff] transition-colors line-clamp-2 h-14">
                        {cert.title}
                      </h3>
                      <p className="text-gray-400 text-sm border-t border-white/10 pt-2 mt-2">
                        {cert.issuer}
                      </p>
                   </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Portfolio Section */}
        <section id="portfolio" ref={portfolioRef} className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
           <div className="flex justify-between items-end mb-16 border-b border-gray-800 pb-6">
               <h2 className="text-2xl md:text-3xl font-['Press_Start_2P'] text-white">
                  MISSION LOG
               </h2>
               <span className="text-[#ff00ff] font-['Orbitron'] hidden md:block">/// SELECTED WORKS</span>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
             {PROJECTS.map((project) => (
               <div key={project.id} className="group bg-gray-900 rounded-xl overflow-hidden border border-white/10 hover:border-[#00f3ff] transition-all duration-300">
                 <div className="h-48 overflow-hidden relative">
                   <img 
                     src={project.imageUrl} 
                     alt={project.title} 
                     className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                   />
                   <div className="absolute inset-0 bg-[#00f3ff]/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                 </div>
                 <div className="p-6 relative">
                    {/* Decorative corner */}
                    <div className="absolute top-0 right-0 p-2">
                        <div className="w-2 h-2 bg-[#ff00ff]"></div>
                    </div>
                    
                    <span className="text-[#ff00ff] text-xs font-bold tracking-widest uppercase mb-2 block font-['Orbitron']">
                      {project.category}
                    </span>
                    <h3 className="text-xl font-bold text-white mb-4">
                      {project.title}
                    </h3>
                    <button className="text-sm text-[#00f3ff] hover:text-white font-['Press_Start_2P'] text-[10px]">
                        [ VIEW DATA ]
                    </button>
                 </div>
               </div>
             ))}
           </div>
        </section>

        {/* Game Section */}
        <section id="game" ref={gameRef} className="py-24 px-6 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#1a0b2e] to-[#050011]">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-['Press_Start_2P'] mb-6 text-transparent bg-clip-text bg-gradient-to-r from-[#ff00ff] to-[#00f3ff]">
               NEON BREAKER
            </h2>
            <div className="inline-block border border-[#ff00ff] px-4 py-1 rounded text-[#ff00ff] text-xs font-bold mb-12 uppercase tracking-widest">
               Interactive 3D Simulation
            </div>
            <NeonGame />
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" ref={contactRef} className="py-24 px-6 md:px-12">
          <div className="max-w-xl mx-auto p-8 md:p-10 bg-black/80 backdrop-blur rounded-2xl border border-[#00f3ff] shadow-[0_0_30px_rgba(0,243,255,0.15)] flex flex-col items-center justify-center text-center relative overflow-hidden group">
             
             {/* Background Glow */}
             <div className="absolute inset-0 bg-gradient-to-b from-[#00f3ff]/5 to-transparent opacity-50"></div>
             
             <h2 className="text-xl md:text-2xl font-['Press_Start_2P'] mb-6 text-white relative z-10">
               CONNECT
             </h2>

             <Mail className="text-[#00f3ff] mb-4 relative z-10 group-hover:scale-110 transition-transform duration-300" size={48} />
             
             <p className="text-gray-400 font-['Orbitron'] text-[10px] tracking-[0.2em] mb-2 relative z-10">OFFICIAL COMMS CHANNEL</p>
             
             <h3 className="text-lg md:text-xl font-['Rajdhani'] font-bold text-white mb-6 relative z-10 break-all hover:text-[#00f3ff] transition-colors selection:bg-[#ff00ff]">
                aml.y.k.2000@gmail.com
             </h3>
             
             <button 
               onClick={copyEmailToClipboard}
               className={`
                 relative z-10 flex items-center space-x-2 px-6 py-3 rounded-full 
                 border-2 transition-all duration-300 font-['Press_Start_2P'] text-[10px] md:text-xs
                 shadow-[0_0_15px_rgba(0,0,0,0.5)]
                 ${copyState === 'copied' 
                   ? 'bg-[#00f3ff]/20 border-[#00f3ff] text-[#00f3ff] shadow-[0_0_15px_#00f3ff]' 
                   : 'bg-black border-white/20 text-white hover:border-[#ff00ff] hover:text-[#ff00ff] hover:shadow-[0_0_15px_#ff00ff]'}
               `}
             >
               {copyState === 'copied' ? (
                 <>
                    <Check size={14} />
                    <span>COPIED!</span>
                 </>
               ) : (
                 <>
                    <Copy size={14} />
                    <span>COPY ADDRESS</span>
                 </>
               )}
             </button>

             <div className="flex justify-center space-x-6 mt-8 relative z-10">
                {SOCIALS.map((social) => (
                  <a 
                    key={social.name} 
                    href={social.url}
                    className="text-gray-500 hover:text-[#00f3ff] hover:scale-125 transition-all duration-300"
                  >
                     {social.icon === 'github' && <Github size={20} />}
                     {social.icon === 'linkedin' && <Linkedin size={20} />}
                     {social.icon === 'twitter' && <Twitter size={20} />}
                     {social.icon === 'image' && <Cpu size={20} />}
                  </a>
                ))}
             </div>
          </div>
        </section>

      </main>

      <footer className="py-8 text-center text-xs text-gray-600 font-['Press_Start_2P'] border-t border-white/5 bg-black">
        <p>SYSTEM STATUS: ONLINE // © 2025 PROGRAVELLER</p>
      </footer>
    </div>
  );
};

export default App;