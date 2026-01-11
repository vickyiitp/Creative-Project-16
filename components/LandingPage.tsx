import React, { useState, useEffect } from 'react';
import { Play, Shield, Cpu, Network, Lock, Zap, Menu, X, ArrowUp, Youtube, Linkedin, Twitter, Github, Instagram, ExternalLink, Mail, Terminal } from 'lucide-react';

interface Props {
  onStart: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStart }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll listener
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const SocialLinks = () => (
    <div className="flex items-center gap-4">
      <a href="https://youtube.com/@vickyiitp" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-red-500 transition-colors" aria-label="YouTube"><Youtube size={20} /></a>
      <a href="https://linkedin.com/in/vickyiitp" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-blue-600 transition-colors" aria-label="LinkedIn"><Linkedin size={20} /></a>
      <a href="https://x.com/vickyiitp" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="X (Twitter)"><Twitter size={20} /></a>
      <a href="https://github.com/vickyiitp" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-white transition-colors" aria-label="GitHub"><Github size={20} /></a>
      <a href="https://instagram.com/vickyiitp" target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-pink-500 transition-colors" aria-label="Instagram"><Instagram size={20} /></a>
    </div>
  );

  return (
    <div className="absolute inset-0 z-[100] w-full min-h-screen bg-[#050505] text-white font-sans overflow-y-auto overflow-x-hidden selection:bg-blue-500 selection:text-white">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-black/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-20 flex items-center justify-between">
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => window.location.reload()}>
                <div className="p-1.5 bg-blue-500/10 rounded-lg group-hover:bg-blue-500/20 transition-colors">
                    <Cpu className="text-blue-500" size={24} />
                </div>
                <span className="font-['Orbitron'] font-bold text-lg md:text-xl tracking-wider text-white">PACKET TRACER</span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-8">
                <SocialLinks />
                <button 
                    onClick={onStart}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 transition-all font-bold text-xs tracking-widest rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] hover:-translate-y-0.5 border border-blue-400/20"
                >
                    PLAY NOW
                </button>
            </div>

            {/* Mobile Menu Button */}
            <button 
              className="md:hidden text-slate-300 hover:text-white p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Toggle Menu"
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a] border-b border-white/10 p-6 flex flex-col items-center gap-8 animate-in slide-in-from-top-5 fade-in duration-200">
             <div className="flex gap-8 py-2">
                <SocialLinks />
             </div>
             <button 
                onClick={onStart}
                className="w-full max-w-xs px-6 py-4 bg-blue-600 hover:bg-blue-500 transition-all font-bold text-sm tracking-widest rounded-lg flex items-center justify-center gap-2"
            >
                <Play size={16} fill="white" /> PLAY NOW
            </button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden pt-20">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-[#050505] to-[#050505] pointer-events-none"></div>
        <div className="absolute inset-0 opacity-20 pointer-events-none bg-[size:50px_50px] [background-image:linear-gradient(to_right,#3b82f6_1px,transparent_1px),linear-gradient(to_bottom,#3b82f6_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto flex flex-col items-center">
            <div className="mb-8 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-400 text-xs tracking-[0.2em] uppercase font-bold animate-pulse shadow-[0_0_15px_rgba(59,130,246,0.2)]">
                <Terminal size={12} /> System Alert: Intrusion Detected
            </div>
            
            <h1 className="font-['Orbitron'] text-5xl sm:text-7xl md:text-9xl font-black mb-8 leading-none tracking-tighter text-white drop-shadow-2xl">
                DEFEND THE <br/>
                <span className="bg-clip-text text-transparent bg-gradient-to-b from-blue-400 to-blue-700">NETWORK</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed px-4 font-light">
                You are the last line of defense. Route data, block malware, and decrypt threats in this high-octane SysAdmin simulator.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 w-full sm:w-auto">
                <button 
                    onClick={onStart}
                    className="group relative w-full sm:w-auto px-12 py-5 bg-white text-black hover:bg-blue-50 font-['Orbitron'] font-bold text-xl rounded transition-all duration-300 shadow-[0_0_40px_rgba(255,255,255,0.1)] hover:shadow-[0_0_60px_rgba(255,255,255,0.3)] hover:-translate-y-1"
                >
                    <span className="flex items-center justify-center gap-3">
                        <Play fill="currentColor" className="w-6 h-6" />
                        INITIALIZE
                    </span>
                </button>
                <a 
                    href="#how-it-works" 
                    className="px-12 py-5 border border-white/20 hover:border-white text-slate-300 hover:text-white rounded font-['Orbitron'] font-bold text-xl transition-all duration-300"
                >
                    BRIEFING
                </a>
            </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 relative bg-slate-900/30 border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="font-['Orbitron'] text-3xl md:text-5xl font-bold mb-6">OPERATIONAL PROTOCOLS</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-blue-600 to-transparent mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                {[
                    { title: "Route Traffic", icon: Network, desc: "Identify packets. Toggle switches to direct Data to servers and Malware to firewalls." },
                    { title: "Decrypt Threats", icon: Lock, desc: "Encrypted packets cloak their intent. Double-tap to reveal them before they hit the core." },
                    { title: "Maintain Integrity", icon: Shield, desc: "Incorrect routing damages server health. Survive the increasing speed and chaos." }
                ].map((card, i) => (
                    <div key={i} className="group relative p-8 bg-black border border-white/10 rounded-2xl hover:border-blue-500/50 transition-all duration-300 hover:-translate-y-2">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-800 to-black rounded-xl flex items-center justify-center mb-6 group-hover:from-blue-900/50 group-hover:to-blue-900/20 transition-all border border-white/5 group-hover:border-blue-500/30 shadow-lg">
                            <card.icon className="text-slate-300 group-hover:text-blue-400 transition-colors w-8 h-8" />
                        </div>
                        <h3 className="font-['Orbitron'] text-xl font-bold mb-4 text-white group-hover:text-blue-400 transition-colors">{card.title}</h3>
                        <p className="text-slate-400 leading-relaxed text-sm">{card.desc}</p>
                    </div>
                ))}
            </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
            <div className="inline-block p-4 rounded-full bg-yellow-500/10 mb-8 border border-yellow-500/20 animate-pulse">
                <Zap className="w-8 h-8 text-yellow-500" />
            </div>
            <h2 className="font-['Orbitron'] text-3xl md:text-5xl font-bold mb-8">THE NETWORK IS COMPROMISED</h2>
            <p className="text-lg md:text-2xl text-slate-300 leading-relaxed font-light">
                "It started with a single ping. Now, millions of malicious packets are flooding our primary data centers. 
                You are the only SysAdmin left. The AI is offline. <span className="text-white font-bold">Good luck.</span>"
            </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 bg-[#020202] relative z-10 text-sm">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-12">
            
            <div className="md:col-span-2 space-y-4">
                <div className="flex items-center gap-2 text-white mb-4">
                    <Cpu className="w-6 h-6 text-blue-500" />
                    <span className="font-['Orbitron'] font-bold text-xl">PACKET TRACER</span>
                </div>
                <p className="text-slate-500 max-w-sm leading-relaxed">
                    A high-performance network defense simulator designed to test your reflexes and strategic thinking under pressure.
                </p>
                <div className="pt-4">
                     <SocialLinks />
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="font-bold text-white mb-2">Connect</h4>
                <a href="mailto:themvaplatform@gmail.com" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                    <Mail size={16} /> Contact Support
                </a>
                <a href="https://vickyiitp.tech" className="text-slate-400 hover:text-white transition-colors flex items-center gap-2">
                    <ExternalLink size={16} /> Developer Portfolio
                </a>
            </div>

            <div className="space-y-4">
                <h4 className="font-bold text-white mb-2">Legal</h4>
                <div className="flex flex-col gap-2 text-slate-400">
                    <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                    <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                    <span className="text-slate-600 mt-4">© 2025 Vicky Kumar.</span>
                </div>
            </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button 
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 p-3 bg-blue-600 hover:bg-blue-500 rounded-full shadow-[0_0_20px_rgba(59,130,246,0.5)] transition-all duration-300 z-50 ${showScrollTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10 pointer-events-none'}`}
        aria-label="Back to Top"
      >
        <ArrowUp size={24} />
      </button>

    </div>
  );
};