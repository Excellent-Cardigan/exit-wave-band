import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AlertCircle, Eye } from 'lucide-react';
import Navigation from '../components/Navigation';
import FooterWithResistance from '../components/FooterWithResistance';
import { useKirbyData } from '../hooks/useKirbyData';
import type { KirbyMember, KirbyLoreEntry } from '../types/kirby';

export default function Coven() {
  const { data: members, loading: membersLoading, error: membersError } = useKirbyData<KirbyMember[]>('members.json');
  const { data: loreEntries, loading: loreLoading, error: loreError } = useKirbyData<KirbyLoreEntry[]>('lore.json');

  const memberList = members ?? [];
  const loreList = loreEntries ?? [];

  const [selectedMember, setSelectedMember] = useState<string | null>(null);
  const [revealedLore, setRevealedLore] = useState<Set<number>>(new Set());
  const [scrollDepth, setScrollDepth] = useState(0);

  // Once lore loads, initialise revealed set from hidden field
  useEffect(() => {
    if (loreList.length > 0) {
      const initiallyVisible = new Set(
        loreList.filter(entry => !entry.hidden).map(entry => entry.id)
      );
      setRevealedLore(initiallyVisible);
    }
  }, [loreList.length]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const depth = (element.scrollTop / (element.scrollHeight - element.clientHeight)) * 100;
    setScrollDepth(depth);

    // Reveal lore entries based on their revelationOrder threshold
    loreList.forEach(entry => {
      if (entry.hidden && depth >= entry.revelationOrder && !revealedLore.has(entry.id)) {
        setRevealedLore(prev => new Set([...prev, entry.id]));
      }
    });
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

        {/* Error state — members */}
        {membersError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 border-2 border-[#c85a3e] bg-[#d4cbb8] p-6 flex items-center gap-3"
          >
            <AlertCircle className="text-[#c85a3e] shrink-0" size={18} />
            <div>
              <div className="text-mono text-xs text-[#c85a3e] tracking-widest mb-1">SIGNAL INTERRUPTED</div>
              <div className="text-mono text-xs text-[#2b2820]/60">{membersError}</div>
            </div>
          </motion.div>
        )}

        {/* Member Grid */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mb-20"
        >
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            {membersLoading
              ? // Skeleton placeholders
                [1, 2, 3, 4, 5].map(skeletonIndex => (
                  <motion.div
                    key={skeletonIndex}
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: skeletonIndex * 0.1 }}
                    className="border-2 border-[#8b7e6a] bg-[#d4cbb8] aspect-square"
                  />
                ))
              : memberList.map((member, index) => (
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
                ))
            }
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
                  {memberList
                    .filter(m => m.circleName === selectedMember)
                    .map(member => (
                      <div key={member.circleName} className="grid lg:grid-cols-3 gap-8">
                        {/* Large Image */}
                        <div className="lg:col-span-1">
                          <div className="border-2 border-[#8b7e6a] overflow-hidden aspect-square">
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.circleName}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-[#c9bfad] flex items-center justify-center">
                                <div className="text-8xl opacity-20" style={{ color: member.color }}>
                                  {member.sigil}
                                </div>
                              </div>
                            )}
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
          onScroll={handleScroll as unknown as React.UIEventHandler<HTMLElement>}
        >
          <h2 className="text-blackletter text-4xl text-[#3a8a7a] mb-8 text-center">
            Core Transmissions
          </h2>

          {/* Error state — lore */}
          {loreError && (
            <div className="mb-6 border-2 border-[#c85a3e] bg-[#d4cbb8] p-4 flex items-center gap-3 max-w-3xl mx-auto">
              <AlertCircle className="text-[#c85a3e] shrink-0" size={16} />
              <div className="text-mono text-xs text-[#c85a3e] tracking-widest">SIGNAL INTERRUPTED / {loreError}</div>
            </div>
          )}

          <div className="space-y-8 max-w-3xl mx-auto">
            {loreLoading
              ? [1, 2, 3].map(skeletonIndex => (
                  <motion.div
                    key={skeletonIndex}
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: skeletonIndex * 0.2 }}
                    className="h-16 bg-[#d4cbb8] border-l-4 border-[#8b7e6a]/30"
                  />
                ))
              : loreList.map(lore => {
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
                })
            }
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
