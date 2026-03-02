import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navigation from '../components/Navigation';
import { ChevronDown, Eye } from 'lucide-react';

const members = [
  {
    circleName: 'PURITY',
    realName: 'Bobby D.',
    role: 'Composer, Producer, Sampler, Guitar',
    sigil: '◈',
    color: '#4fd1d1',
  },
  {
    circleName: 'TOY',
    realName: 'Tony',
    role: 'Vocals',
    sigil: '◇',
    color: '#8b7fd4',
  },
  {
    circleName: 'CALM',
    realName: 'Thom',
    role: 'Drums',
    sigil: '◆',
    color: '#4fd1d1',
  },
  {
    circleName: 'AER',
    realName: 'Aaron',
    role: 'Composer, Producer, Modular Synth',
    sigil: '◊',
    color: '#8b7fd4',
  },
  {
    circleName: 'ZERO',
    realName: 'John',
    role: 'Bass',
    sigil: '◈',
    color: '#4fd1d1',
  },
];

const loreTexts = [
  {
    id: 1,
    text: "The exit is not an ending — it is a rite of passage. A frequency. A door that only opens from one side.",
    hidden: false,
  },
  {
    id: 2,
    text: "The Wave is not sound. The Wave is what sound leaves behind — the resonance in a room after the last note dies.",
    hidden: false,
  },
  {
    id: 3,
    text: "Exit-Wave are space druids — but not the kind that tend sacred groves on forest moons. We are the witchier kind. The ones who were cast out, who left, who chose the void.",
    hidden: true,
  },
  {
    id: 4,
    text: "Exit-Wave was never formed. It coalesced — the way a storm coalesces, the way a coven finds itself, the way a frequency that has always existed finally finds its receivers.",
    hidden: true,
  },
  {
    id: 5,
    text: "like a signal in the static",
    hidden: true,
  },
];

export default function Archive() {
  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [revealedLore, setRevealedLore] = useState<Set<number>>(new Set([1, 2]));
  const [scrollDepth, setScrollDepth] = useState(0);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const depth = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setScrollDepth(depth);

    // Reveal lore based on scroll depth
    if (depth > 30 && !revealedLore.has(3)) {
      setRevealedLore(prev => new Set([...prev, 3]));
    }
    if (depth > 60 && !revealedLore.has(4)) {
      setRevealedLore(prev => new Set([...prev, 4]));
    }
    if (depth > 85 && !revealedLore.has(5)) {
      setRevealedLore(prev => new Set([...prev, 5]));
    }
  };

  const toggleMember = (circleName: string) => {
    setExpandedMember(prev => prev === circleName ? null : circleName);
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-[#e8e4d9] relative overflow-hidden">
      <Navigation />
      
      <div 
        className="h-screen overflow-y-auto overflow-x-hidden"
        onScroll={handleScroll}
      >
        <div className="container mx-auto px-8 py-24 max-w-4xl">
          {/* Page title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-16"
          >
            <h1 className="text-mono text-3xl tracking-wider text-[#4fd1d1] glow-signal mb-2">
              THE ARCHIVE
            </h1>
            <div className="w-24 h-px bg-[#4fd1d1]" style={{ boxShadow: '0 0 8px #4fd1d1' }} />
          </motion.div>

          {/* Lore section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-blackletter text-4xl text-[#8b7fd4] mb-8 glow-accent">
              Core Transmissions
            </h2>
            
            <div className="space-y-8">
              {loreTexts.map((lore) => {
                const isRevealed = revealedLore.has(lore.id);
                
                return (
                  <AnimatePresence key={lore.id}>
                    {isRevealed ? (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1 }}
                        className="border-l-2 border-[#8b7fd4] pl-6 py-2"
                      >
                        <p className="text-serif text-lg leading-relaxed text-[#e8e4d9]/90 italic">
                          {lore.text}
                        </p>
                      </motion.div>
                    ) : (
                      <motion.div
                        initial={{ opacity: 0.3 }}
                        animate={{ opacity: 0.3 }}
                        className="border-l-2 border-[#8b7fd4]/20 pl-6 py-2"
                      >
                        <div className="flex items-center gap-3 text-mono text-xs text-[#8b7fd4]/40">
                          <Eye size={14} />
                          <span>TRANSMISSION LOCKED / CONTINUE ARCHIVE TRAVERSAL</span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                );
              })}
            </div>
          </motion.section>

          {/* Member profiles section */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mb-20"
          >
            <h2 className="text-blackletter text-4xl text-[#8b7fd4] mb-8 glow-accent">
              The Order
            </h2>
            
            <div className="text-mono text-xs text-[#8b7fd4]/60 mb-8 tracking-wider">
              HARLEM, NY × WESTERN MASSACHUSETTS / FIVE MEMBERS IN RITUAL ORDER
            </div>

            <div className="space-y-4">
              {members.map((member, index) => (
                <motion.div
                  key={member.circleName}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.6 }}
                >
                  <button
                    onClick={() => toggleMember(member.circleName)}
                    className="w-full bg-[#111119] border border-[#8b7fd4]/30 p-6 text-left hover:border-[#8b7fd4] transition-all duration-500 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        {/* Sigil */}
                        <div 
                          className="text-4xl transition-colors duration-300"
                          style={{ 
                            color: expandedMember === member.circleName ? member.color : '#8b7fd4',
                            textShadow: expandedMember === member.circleName ? `0 0 15px ${member.color}` : 'none'
                          }}
                        >
                          {member.sigil}
                        </div>
                        
                        {/* Names */}
                        <div>
                          <div className="text-blackletter text-2xl text-[#e8e4d9] mb-1">
                            {member.circleName}
                          </div>
                          <div className="text-mono text-xs text-[#8b7fd4]/60 tracking-wider">
                            {member.realName}
                          </div>
                        </div>
                      </div>
                      
                      <motion.div
                        animate={{ rotate: expandedMember === member.circleName ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <ChevronDown className="text-[#8b7fd4]" size={20} />
                      </motion.div>
                    </div>
                    
                    {/* Expanded content */}
                    <AnimatePresence>
                      {expandedMember === member.circleName && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="mt-6 pt-6 border-t border-[#8b7fd4]/30">
                            <div className="text-mono text-xs text-[#8b7fd4] mb-2 tracking-wider">
                              ROLE IN THE ORDER
                            </div>
                            <div className="text-mono text-sm text-[#e8e4d9] leading-relaxed">
                              {member.role}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Distribution info */}
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mb-20"
          >
            <div className="bg-[#111119] border border-[#4fd1d1]/30 p-8">
              <div className="text-mono text-xs text-[#8b7fd4] mb-4 tracking-wider">
                DISTRIBUTION CHANNELS
              </div>
              <div className="flex gap-6 text-mono text-sm">
                <span className="text-[#4fd1d1]">TIDAL</span>
                <span className="text-[#8b7fd4]/60">·</span>
                <span className="text-[#8b7fd4]">SUBVERT FM [PLANNED]</span>
              </div>
            </div>
          </motion.section>

          {/* Final lore */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: scrollDepth > 90 ? 1 : 0 }}
            transition={{ duration: 2 }}
            className="text-center py-20"
          >
            <p className="text-serif text-xl text-[#4fd1d1]/80 italic">
              "We are the witchier kind."
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
