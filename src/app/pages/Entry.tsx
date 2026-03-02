import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';

export default function Entry() {
  const [stage, setStage] = useState<'idle' | 'acquiring' | 'typing' | 'ready'>('idle');
  const [text, setText] = useState('');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const navigate = useNavigate();
  const animationFrameRef = useRef<number>();
  const startTimeRef = useRef<number>(0);

  useEffect(() => {
    // Start signal acquisition after 500ms
    const timer = setTimeout(() => {
      setStage('acquiring');
      startTimeRef.current = Date.now();
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (stage !== 'acquiring') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const centerY = canvas.height / 2;
    let phase = 0;

    const animate = () => {
      const elapsed = Date.now() - startTimeRef.current;
      
      ctx.fillStyle = '#07070d';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = '#4fd1d1';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 10;
      ctx.shadowColor = '#4fd1d1';

      ctx.beginPath();
      
      for (let x = 0; x < canvas.width; x++) {
        // Start flat, then gradually increase amplitude
        const progress = Math.min(elapsed / 2000, 1);
        const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        
        const amplitude = 60 * eased;
        const frequency = 0.02;
        const noise = Math.sin(x * frequency + phase) * amplitude;
        
        // Add sharp spikes as signal locks
        const spike = Math.sin(x * 0.005 + elapsed * 0.003) > 0.98 ? 
          Math.random() * 40 * eased : 0;
        
        const y = centerY + noise + spike;
        
        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      
      ctx.stroke();
      
      phase += 0.05;

      // Transition to typing stage after 2 seconds
      if (elapsed > 2000 && stage === 'acquiring') {
        setStage('typing');
        return;
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [stage]);

  useEffect(() => {
    if (stage !== 'typing') return;

    const messages = [
      'SIGNAL ACQUIRED.',
      'FREQUENCY: EXIT.WAVE',
      '[ENTER]'
    ];

    let currentMessage = 0;
    let currentChar = 0;

    const typeNextChar = () => {
      if (currentMessage >= messages.length) {
        setStage('ready');
        return;
      }

      if (currentChar < messages[currentMessage].length) {
        setText(prev => prev + messages[currentMessage][currentChar]);
        currentChar++;
        setTimeout(typeNextChar, 50 + Math.random() * 50);
      } else {
        setText(prev => prev + '\n');
        currentMessage++;
        currentChar = 0;
        setTimeout(typeNextChar, 400);
      }
    };

    typeNextChar();
  }, [stage]);

  const handleEnter = () => {
    if (stage === 'ready') {
      navigate('/signal');
    }
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.key === 'Enter' || e.key === ' ') && stage === 'ready') {
        handleEnter();
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [stage]);

  return (
    <div className="fixed inset-0 bg-[#07070d] overflow-hidden">
      {/* Oscilloscope canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0"
        style={{ opacity: stage === 'acquiring' ? 1 : 0 }}
      />

      {/* Terminal text */}
      <AnimatePresence>
        {stage !== 'idle' && stage !== 'acquiring' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="text-mono">
              <pre className="text-[#4fd1d1] text-lg leading-relaxed tracking-wide glow-signal whitespace-pre-wrap">
                {text}
              </pre>
              
              {stage === 'ready' && (
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0.6, 1, 0.6] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  onClick={handleEnter}
                  className="mt-8 px-8 py-3 border border-[#4fd1d1] text-[#4fd1d1] hover:bg-[#4fd1d1] hover:text-[#07070d] transition-all duration-300 border-glow-signal block mx-auto"
                >
                  ENTER THE WAVE
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
