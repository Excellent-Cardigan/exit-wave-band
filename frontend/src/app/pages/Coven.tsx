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

    loreList.forEach(entry => {
      if (entry.hidden && depth >= entry.revelationOrder && !revealedLore.has(entry.id)) {
        setRevealedLore(prev => new Set([...prev, entry.id]));
      }
    });
  };

  return (
    <div
      className="min-h-screen relative"
      style={{ background: '#010313', color: '#e6e6e6' }}
    >
      <Navigation />

      <main className="container mx-auto px-4 sm:px-8 py-24">
        {/* Page title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-16 text-center"
        >
          <h1
            className="text-display text-3xl mb-3"
            style={{ color: '#e6e6e6' }}
          >
            The Coven
          </h1>
          <div className="flex items-center justify-center gap-3">
            <div className="w-16 h-px" style={{ background: 'rgba(0,77,241,0.3)' }} />
            <span
              className="text-mono text-xs tracking-widest"
              style={{ color: 'rgba(0,77,241,0.6)' }}
            >
              THE ORDER OF FIVE
            </span>
            <div className="w-16 h-px" style={{ background: 'rgba(0,77,241,0.3)' }} />
          </div>
        </motion.div>

        {/* Error state — members */}
        {membersError && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8 p-6 flex items-center gap-3"
            style={{ border: '1px solid #c85a3e', background: 'rgba(200,90,62,0.05)' }}
          >
            <AlertCircle className="text-[#c85a3e] shrink-0" size={18} />
            <div>
              <div className="text-mono text-xs text-[#c85a3e] tracking-widest mb-1">SIGNAL INTERRUPTED</div>
              <div className="text-mono text-xs" style={{ color: 'rgba(230,230,230,0.4)' }}>
                {membersError}
              </div>
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
              ? [1, 2, 3, 4, 5].map(skeletonIndex => (
                  <motion.div
                    key={skeletonIndex}
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: skeletonIndex * 0.1 }}
                    className="aspect-square"
                    style={{ background: 'rgba(0,77,241,0.04)', border: '1px solid rgba(0,77,241,0.15)' }}
                  />
                ))
              : memberList.map((member, index) => (
                  <motion.button
                    key={member.circleName}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1, duration: 0.6 }}
                    onClick={() => setSelectedMember(selectedMember === member.circleName ? null : member.circleName)}
                    className="group relative overflow-hidden transition-all duration-500"
                    style={{
                      border: selectedMember === member.circleName
                        ? '1px solid #004df1'
                        : '1px solid rgba(0,77,241,0.2)',
                      transform: selectedMember === member.circleName ? 'scale(1.05)' : 'scale(1)',
                    }}
                  >
                    {/* Member Image */}
                    <div
                      className="aspect-square overflow-hidden flex items-center justify-center"
                      style={{ background: 'rgba(0,77,241,0.04)' }}
                    >
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.circleName}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          style={{ filter: 'saturate(0.5) contrast(1.1) brightness(0.85)' }}
                        />
                      ) : (
                        <div className="text-5xl opacity-40" style={{ color: member.color }}>
                          {member.sigil}
                        </div>
                      )}
                    </div>

                    {/* Name Overlay */}
                    <div
                      className="absolute inset-x-0 bottom-0 p-3"
                      style={{ background: 'rgba(1,3,19,0.9)', borderTop: '1px solid rgba(0,77,241,0.2)' }}
                    >
                      <div className="text-display text-xl leading-tight" style={{ color: '#e6e6e6' }}>
                        {member.circleName}
                      </div>
                      <div className="text-mono tracking-widest" style={{ fontSize: 9, color: 'rgba(230,230,230,0.3)' }}>
                        {member.realName}
                      </div>
                    </div>

                    {/* Sigil indicator */}
                    <div
                      className="absolute top-3 right-3 text-2xl transition-all duration-300"
                      style={{
                        color: selectedMember === member.circleName ? member.color : 'rgba(230,230,230,0.25)',
                        filter: selectedMember === member.circleName ? `drop-shadow(0 0 8px ${member.color})` : 'none',
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
                <div
                  className="p-8"
                  style={{ background: 'rgba(0,77,241,0.04)', border: '1px solid rgba(0,77,241,0.2)' }}
                >
                  {memberList
                    .filter(m => m.circleName === selectedMember)
                    .map(member => (
                      <div key={member.circleName} className="grid lg:grid-cols-3 gap-8">
                        {/* Large Image */}
                        <div className="lg:col-span-1">
                          <div className="overflow-hidden aspect-square" style={{ border: '1px solid rgba(0,77,241,0.25)' }}>
                            {member.image ? (
                              <img
                                src={member.image}
                                alt={member.circleName}
                                className="w-full h-full object-cover"
                                style={{ filter: 'saturate(0.5) contrast(1.1) brightness(0.85)' }}
                              />
                            ) : (
                              <div
                                className="w-full h-full flex items-center justify-center"
                                style={{ background: 'rgba(0,77,241,0.04)' }}
                              >
                                <div className="text-8xl opacity-25" style={{ color: member.color }}>
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
                              style={{ color: member.color, filter: `drop-shadow(0 0 12px ${member.color})` }}
                            >
                              {member.sigil}
                            </div>
                            <h3 className="text-display text-4xl mb-2" style={{ color: '#e6e6e6' }}>
                              {member.circleName}
                            </h3>
                            <div className="text-mono text-sm tracking-widest mb-6" style={{ color: 'rgba(230,230,230,0.3)' }}>
                              {member.realName}
                            </div>
                          </div>

                          <div className="pt-6" style={{ borderTop: '1px solid rgba(0,77,241,0.2)' }}>
                            <div className="text-mono text-xs tracking-widest mb-2" style={{ color: 'rgba(0,77,241,0.6)' }}>
                              ROLE IN THE ORDER
                            </div>
                            <div className="text-display italic text-lg leading-relaxed" style={{ color: '#e6e6e6' }}>
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
          <h2 className="text-display text-4xl mb-8 text-center" style={{ color: '#e6e6e6' }}>
            Core Transmissions
          </h2>

          {loreError && (
            <div
              className="mb-6 p-4 flex items-center gap-3 max-w-3xl mx-auto"
              style={{ border: '1px solid #c85a3e', background: 'rgba(200,90,62,0.05)' }}
            >
              <AlertCircle className="text-[#c85a3e] shrink-0" size={16} />
              <div className="text-mono text-xs text-[#c85a3e] tracking-widest">
                SIGNAL INTERRUPTED / {loreError}
              </div>
            </div>
          )}

          <div className="space-y-8 max-w-3xl mx-auto">
            {loreLoading
              ? [1, 2, 3].map(skeletonIndex => (
                  <motion.div
                    key={skeletonIndex}
                    animate={{ opacity: [0.2, 0.4, 0.2] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: skeletonIndex * 0.2 }}
                    className="h-16"
                    style={{ background: 'rgba(0,77,241,0.04)', borderLeft: '2px solid rgba(0,77,241,0.15)' }}
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
                          className="pl-6 py-4"
                          style={{
                            borderLeft: '2px solid rgba(0,77,241,0.4)',
                            background: 'rgba(0,77,241,0.04)',
                          }}
                        >
                          <p className="text-display italic text-lg leading-relaxed" style={{ color: '#e6e6e6' }}>
                            {lore.text}
                          </p>
                        </motion.div>
                      ) : (
                        <motion.div
                          initial={{ opacity: 0.3 }}
                          animate={{ opacity: 0.3 }}
                          className="pl-6 py-4"
                          style={{
                            borderLeft: '1px solid rgba(0,77,241,0.15)',
                            background: 'rgba(0,77,241,0.02)',
                          }}
                        >
                          <div className="flex items-center gap-3 text-mono text-xs" style={{ color: 'rgba(0,77,241,0.45)' }}>
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
          <div
            className="p-8 max-w-3xl mx-auto"
            style={{ background: 'rgba(0,77,241,0.04)', border: '1px solid rgba(0,77,241,0.2)' }}
          >
            <div className="text-mono text-xs mb-4 tracking-widest text-center" style={{ color: 'rgba(0,77,241,0.6)' }}>
              RITUAL CHAMBERS
            </div>
            <div className="text-mono text-lg tracking-wide text-center" style={{ color: '#e6e6e6' }}>
              HARLEM, NY × WESTERN MASSACHUSETTS
            </div>
          </div>
        </motion.section>

        {/* Distribution channels */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="mb-20"
        >
          <div
            className="p-8 max-w-3xl mx-auto"
            style={{ background: 'rgba(0,77,241,0.04)', border: '1px solid rgba(0,77,241,0.2)' }}
          >
            <div className="text-mono text-xs mb-4 tracking-widest text-center" style={{ color: 'rgba(0,77,241,0.6)' }}>
              DISTRIBUTION CHANNELS
            </div>
            <div className="flex gap-6 text-mono text-sm justify-center">
              <span style={{ color: '#e6e6e6' }}>TIDAL</span>
              <span style={{ color: 'rgba(0,77,241,0.3)' }}>·</span>
              <span style={{ color: 'rgba(230,230,230,0.25)' }}>SUBVERT FM [PLANNED]</span>
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
          <p className="text-display italic text-2xl" style={{ color: 'rgba(230,230,230,0.7)' }}>
            "We are the witchier kind."
          </p>
        </motion.div>
      </main>
      <FooterWithResistance />
    </div>
  );
}
