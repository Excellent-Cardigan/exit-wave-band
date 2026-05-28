import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navigation from '../components/Navigation';
import { ChevronDown, Eye, AlertCircle } from 'lucide-react';
import { useKirbyData } from '../hooks/useKirbyData';
import type { KirbyMember, KirbyLoreEntry } from '../types/kirby';

export default function Archive() {
  const { data: members, loading: membersLoading, error: membersError } = useKirbyData<KirbyMember[]>('members.json');
  const { data: loreEntries, loading: loreLoading, error: loreError } = useKirbyData<KirbyLoreEntry[]>('lore.json');

  const memberList = members ?? [];
  const loreList = loreEntries ?? [];

  const [expandedMember, setExpandedMember] = useState<string | null>(null);
  const [revealedLore, setRevealedLore] = useState<Set<number>>(new Set());
  const [scrollDepth, setScrollDepth] = useState(0);

  // Initialise revealed set from hidden field once lore loads
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

    // Reveal entries based on their revelationOrder threshold
    loreList.forEach(entry => {
      if (entry.hidden && depth >= entry.revelationOrder && !revealedLore.has(entry.id)) {
        setRevealedLore(prev => new Set([...prev, entry.id]));
      }
    });
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

            {loreError && (
              <div className="mb-6 flex items-center gap-3 text-mono text-xs text-[#c85a3e]">
                <AlertCircle size={14} />
                <span>SIGNAL INTERRUPTED / {loreError}</span>
              </div>
            )}

            <div className="space-y-8">
              {loreLoading
                ? [1, 2, 3].map(skeletonIndex => (
                    <motion.div
                      key={skeletonIndex}
                      animate={{ opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: skeletonIndex * 0.2 }}
                      className="h-14 border-l-2 border-[#8b7fd4]/20 pl-6"
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
                            className="border-l-2 border-[#8b7fd4] pl-6 py-2"
                          >
                            <p className="text-blackletter italic text-lg leading-relaxed text-[#e8e4d9]/90 italic">
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
                  })
              }
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

            {membersError && (
              <div className="mb-6 flex items-center gap-3 text-mono text-xs text-[#c85a3e]">
                <AlertCircle size={14} />
                <span>SIGNAL INTERRUPTED / {membersError}</span>
              </div>
            )}

            <div className="space-y-4">
              {membersLoading
                ? [1, 2, 3, 4, 5].map(skeletonIndex => (
                    <motion.div
                      key={skeletonIndex}
                      animate={{ opacity: [0.2, 0.4, 0.2] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: skeletonIndex * 0.1 }}
                      className="h-20 bg-[#111119] border border-[#8b7fd4]/10"
                    />
                  ))
                : memberList.map((member, index) => (
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
                  ))
              }
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
            <p className="text-blackletter italic text-xl text-[#4fd1d1]/80 italic">
              "We are the witchier kind."
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
