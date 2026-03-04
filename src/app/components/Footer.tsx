import { Link } from 'react-router';

export default function Footer() {
  return (
    <footer className="relative bg-[#2b2820] text-[#e8e1d3] border-t-4 border-[#8b7e6a]">
      <div className="container mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div>
            <div className="text-blackletter text-3xl mb-4">EXIT.WAVE</div>
            <p className="text-blackletter italic text-sm text-[#e8e1d3]/70 leading-relaxed">
              A witch rock collective merging medieval heraldry with corporate occult aesthetics.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-mono text-xs tracking-widest mb-4 text-[#e8e1d3]/50">
              NAVIGATION
            </h3>
            <nav className="space-y-2">
              <Link 
                to="/signal" 
                className="block text-mono text-sm text-[#e8e1d3]/80 hover:text-[#3a8a7a] transition-colors"
              >
                The Signal
              </Link>
              <Link 
                to="/coven" 
                className="block text-mono text-sm text-[#e8e1d3]/80 hover:text-[#3a8a7a] transition-colors"
              >
                The Coven
              </Link>
              <Link 
                to="/ritual" 
                className="block text-mono text-sm text-[#e8e1d3]/80 hover:text-[#3a8a7a] transition-colors"
              >
                Ritual Contact
              </Link>
            </nav>
          </div>

          {/* Channels */}
          <div>
            <h3 className="text-mono text-xs tracking-widest mb-4 text-[#e8e1d3]/50">
              TRANSMISSION CHANNELS
            </h3>
            <div className="space-y-2">
              <a 
                href="https://tidal.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-mono text-sm text-[#e8e1d3]/80 hover:text-[#3a8a7a] transition-colors"
              >
                Tidal
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-mono text-sm text-[#e8e1d3]/80 hover:text-[#3a8a7a] transition-colors"
              >
                Instagram
              </a>
              <a 
                href="https://soundcloud.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block text-mono text-sm text-[#e8e1d3]/80 hover:text-[#3a8a7a] transition-colors"
              >
                SoundCloud
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-[#8b7e6a]/30 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-mono text-xs text-[#e8e1d3]/40 tracking-wider">
            © MMXXVI EXIT.WAVE · HARLEM, NY × WESTERN MASSACHUSETTS
          </div>
          <div className="text-mono text-xs text-[#e8e1d3]/40 tracking-wider">
            v0.14.0
          </div>
        </div>
      </div>
    </footer>
  );
}
