import { Link, useLocation } from 'react-router';
import { motion } from 'motion/react';

export default function Navigation() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="fixed top-4 left-4 right-4 z-50">
      <div className="container mx-auto">
        <nav className="bg-[#e8e1d3]/80 backdrop-blur-md border-2 border-[#8b7e6a] px-8 py-4">
          <div className="flex items-center justify-between">
            {/* Logo/Brand */}
            <Link to="/" className="text-blackletter text-xl text-[#2b2820]">
              EXIT.WAVE
            </Link>

            {/* Center Nav */}
            <div className="flex items-center gap-8 text-mono text-xs tracking-widest">
              <Link 
                to="/signal" 
                className={`transition-colors group flex items-center gap-1.5 ${
                  isActive('/signal') 
                    ? 'text-[#3a8a7a]' 
                    : 'text-[#2b2820]/80 hover:text-[#3a8a7a]'
                }`}
              >
                <span className={`transition-opacity ${
                  isActive('/signal') 
                    ? 'opacity-100' 
                    : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {isActive('/signal') ? '◆' : '•'}
                </span>
                MUSIC
              </Link>
              <Link 
                to="/coven" 
                className={`transition-colors group flex items-center gap-1.5 ${
                  isActive('/coven') 
                    ? 'text-[#3a8a7a]' 
                    : 'text-[#2b2820]/80 hover:text-[#3a8a7a]'
                }`}
              >
                <span className={`transition-opacity ${
                  isActive('/coven') 
                    ? 'opacity-100' 
                    : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {isActive('/coven') ? '◆' : '•'}
                </span>
                COVEN
              </Link>
              <Link 
                to="/ritual" 
                className={`transition-colors group flex items-center gap-1.5 ${
                  isActive('/ritual') 
                    ? 'text-[#3a8a7a]' 
                    : 'text-[#2b2820]/80 hover:text-[#3a8a7a]'
                }`}
              >
                <span className={`transition-opacity ${
                  isActive('/ritual') 
                    ? 'opacity-100' 
                    : 'opacity-0 group-hover:opacity-100'
                }`}>
                  {isActive('/ritual') ? '◆' : '•'}
                </span>
                CONTACT
              </Link>
            </div>

            {/* Status indicator */}
            <div className="flex items-center gap-2 text-mono text-xs text-[#2b2820]/60">
              <span className="border border-[#2b2820]/60 px-2 py-0.5">ACTIVE</span>
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}