import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navigation from '../components/Navigation';
import FooterWithResistance from '../components/FooterWithResistance';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { Eye } from 'lucide-react';

const members = [
  {
    circleName: 'PURITY',
    realName: 'Bobby D.',
    role: 'Composer, Producer, Sampler, Guitar',
    sigil: '◈',
    color: '#4fd1d1',
    image: '/images/members/purity-dithered-image.png',
  },
  {
    circleName: 'TOY',
    realName: 'Tony',
    role: 'Vocals',
    sigil: '◇',
    color: '#8b7fd4',
    image: '/images/members/toy-dithered-image.png',
  },
  {
    circleName: 'CALM',
    realName: 'Thom',
    role: 'Drums',
    sigil: '○',
    color: '#c9a353',
    image: '',
  },
  {
    circleName: 'AER',
    realName: 'Aaron',
    role: 'Composer, Producer, Modular Synth',
    sigil: '◊',
    color: '#8b7fd4',
    image: '/images/members/aer-dithered-image.png',
  },
  {
    circleName: 'ZERO',
    realName: 'John',
    role: 'Bass',
    sigil: '◈',
    color: '#4fd1d1',
    image: '/images/members/zero-dithered-image.png',
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

export default function Coven() {
  const [selectedMember, setSelectedMember] = useState<string | null>(null);
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

  return (
    <div className="min-h-screen bg-[#e8e1d3] text-[#2b2820] relative">
      <Navigation />
      
      <div className="container mx-auto px-4 sm:px-8 py-24">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h1 className="text-blackletter text-3xl text-[#3a8a7a] mb-3">
            The Coven
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-px bg-[#8b7e6a]" />
            <span className="text-mono text-xs text-[#2b2820]/60 tracking-widest">
              THE ORDER OF FIVE
            </span>
            <div className="w-16 h-px bg-[#8b7e6a]" />
          </div>
        </motion.div>

        {/* Member Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {members.map((member, index) => (
              <motion.button
                key={member.circleName}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                onClick={() => setSelectedMember(selectedMember === member.circleName ? null : member.circleName)}
                className={`group relative overflow-hidden border-2 transition-all duration-500 ${
                  selectedMember === member.circleName
                    ? 'border-[#3a8a7a] scale-105'
                    : 'border-[#8b7e6a] hover:border-[#3a8a7a]'
                }`}
              >
                {/* Member Image */}
                <div className="aspect-square overflow-hidden bg-[#d4cbb8] flex items-center justify-center">
                  {member.image ? (
                    <img
                      src={member.image}
                      alt={member.circleName}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div
                      className="text-5xl opacity-30"
                      style={{ color: member.color }}
                    >
                      {member.sigil}
                    </div>
                  )}
                </div>

                {/* Name Overlay */}
                <div className="absolute inset-x-0 bottom-0 bg-[#d4cbb8] border-t-2 border-[#8b7e6a] p-3">
                  <div className="text-blackletter text-xl text-[#2b2820] leading-tight">
                    {member.circleName}
                  </div>
                  <div className="text-mono text-[9px] text-[#2b2820]/50 tracking-widest">
                    {member.realName}
                  </div>
                </div>

                {/* Sigil indicator */}
                <div 
                  className="absolute top-3 right-3 text-2xl transition-all duration-300"
                  style={{
                    color: selectedMember === member.circleName ? member.color : '#8b7e6a',
                    filter: selectedMember === member.circleName ? `drop-shadow(0 0 8px ${member.color})` : 'none'
                  }}
                >
                  {member.sigil}
                </div>
              </motion.button>
            ))}
          </div>

          {/* Selected Member Details */}
          <AnimatePresence mode="wait">
            {selectedMember && (
              <motion.div
                key={selectedMember}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
                className="overflow-hidden"
              >
                <div className="bg-[#d4cbb8] border-2 border-[#8b7e6a] p-8">
                  {members
                    .filter(m => m.circleName === selectedMember)
                    .map(member => (
                      <div key={member.circleName} className="grid lg:grid-cols-3 gap-8">
                        {/* Large Image */}
                        <div className="lg:col-span-1">
                          <div className="border-2 border-[#8b7e6a] overflow-hidden aspect-square">
                            <img 
                              src={member.image} 
                              alt={member.circleName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Details */}
                        <div className="lg:col-span-2 flex flex-col justify-center">
                          <div className="mb-6">
                            <div 
                              className="text-6xl mb-4"
                              style={{ 
                                color: member.color,
                                filter: `drop-shadow(0 0 12px ${member.color})`
                              }}
                            >
                              {member.sigil}
                            </div>
                            <h3 className="text-blackletter text-4xl text-[#2b2820] mb-2">
                              {member.circleName}
                            </h3>
                            <div className="text-mono text-sm text-[#2b2820]/60 tracking-widest mb-6">
                              {member.realName}
                            </div>
                          </div>

                          <div className="border-t-2 border-[#8b7e6a]/40 pt-6">
                            <div className="text-mono text-xs text-[#2b2820]/50 tracking-widest mb-2">
                              ROLE IN THE ORDER
                            </div>
                            <div className="text-serif text-lg text-[#2b2820] leading-relaxed">
                              {member.role}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.section>

        {/* Lore Transmissions */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mb-20"
        >
          <h2 className="text-blackletter text-4xl text-[#3a8a7a] mb-8 text-center">
            Core Transmissions
          </h2>
          
          <div className="space-y-8 max-w-3xl mx-auto">
            {loreTexts.map((lore) => {
              const isRevealed = revealedLore.has(lore.id);
              
              return (
                <AnimatePresence key={lore.id}>
                  {isRevealed ? (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 1 }}
                      className="border-l-4 border-[#3a8a7a] bg-[#d4cbb8] pl-6 py-4"
                    >
                      <p className="text-serif text-lg leading-relaxed text-[#2b2820]/90 italic">
                        {lore.text}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: 0.3 }}
                      className="border-l-4 border-[#8b7e6a]/20 bg-[#d4cbb8]/50 pl-6 py-4"
                    >
                      <div className="flex items-center gap-3 text-mono text-xs text-[#2b2820]/40">
                        <Eye size={14} />
                        <span>TRANSMISSION LOCKED / CONTINUE TRAVERSAL</span>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              );
            })}
          </div>
        </motion.section>

        {/* Location Info */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="mb-20"
        >
          <div className="bg-[#d4cbb8] border-2 border-[#8b7e6a] p-8 max-w-3xl mx-auto">
            <div className="text-mono text-xs text-[#2b2820]/50 mb-4 tracking-widest text-center">
              RITUAL CHAMBERS
            </div>
            <div className="text-mono text-lg text-[#2b2820] tracking-wide text-center">
              HARLEM, NY × WESTERN MASSACHUSETTS
            </div>
          </div>
        </motion.section>

        {/* Distribution info */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-20"
        >
          <div className="bg-[#d4cbb8] border-2 border-[#8b7e6a] p-8 max-w-3xl mx-auto">
            <div className="text-mono text-xs text-[#2b2820]/50 mb-4 tracking-widest text-center">
              DISTRIBUTION CHANNELS
            </div>
            <div className="flex gap-6 text-mono text-sm justify-center">
              <span className="text-[#3a8a7a]">TIDAL</span>
              <span className="text-[#2b2820]/40">·</span>
              <span className="text-[#2b2820]/60">SUBVERT FM [PLANNED]</span>
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
          <p className="text-serif text-2xl text-[#3a8a7a] italic">
            "We are the witchier kind."
          </p>
        </motion.div>
      </div>
      <FooterWithResistance />
    </div>
  );
}