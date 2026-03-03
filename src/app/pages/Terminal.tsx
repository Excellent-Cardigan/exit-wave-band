import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import Footer from '../components/Footer';

interface GameState {
  currentRoom: string;
  inventory: string[];
  visitedRooms: Set<string>;
}

const rooms = {
  lobby: {
    name: "Decommissioned Lobby",
    description: "You stand in a dusty corporate lobby. Fluorescent lights flicker overhead. A DESK sits against the wall. Hallways lead NORTH and EAST.",
    items: ["keycard"],
    exits: { north: "ritual-chamber", east: "archive-room" }
  },
  "ritual-chamber": {
    name: "Ritual Chamber",
    description: "Candles line the walls of this repurposed conference room. A CIRCLE is drawn on the floor in chalk. Strange SYMBOLS cover the walls.",
    items: ["candle"],
    exits: { south: "lobby" }
  },
  "archive-room": {
    name: "Archive Room",
    description: "Filing cabinets line the walls. One drawer is slightly ajar, revealing TAPES marked with dates and frequencies.",
    items: ["tape"],
    exits: { west: "lobby" }
  }
};

export default function Terminal() {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ type: 'input' | 'output', text: string }>>([
    { type: 'output', text: '█ EXIT.WAVE TERMINAL v0.14.0' },
    { type: 'output', text: '█ FREQUENCY DETECTED... CHANNEL OPEN' },
    { type: 'output', text: '' },
    { type: 'output', text: 'You have found a secret place.' },
    { type: 'output', text: '' },
    { type: 'output', text: 'Type "help" for available commands.' },
  ]);
  const [gameState, setGameState] = useState<GameState>({
    currentRoom: 'lobby',
    inventory: [],
    visitedRooms: new Set(['lobby'])
  });

  const inputRef = useRef<HTMLInputElement>(null);
  const historyEndRef = useRef<HTMLDivElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    historyEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const addOutput = (text: string) => {
    setHistory(prev => [...prev, { type: 'output', text }]);
  };

  const handleCommand = (cmd: string) => {
    const command = cmd.toLowerCase().trim();
    setHistory(prev => [...prev, { type: 'input', text: `> ${cmd}` }]);

    const room = rooms[gameState.currentRoom as keyof typeof rooms];

    if (command === 'help') {
      addOutput('');
      addOutput('AVAILABLE COMMANDS:');
      addOutput('  look - Examine your surroundings');
      addOutput('  examine [object] - Inspect an object closely');
      addOutput('  take [object] - Add item to inventory');
      addOutput('  inventory - View your items');
      addOutput('  go [direction] - Move to another room');
      addOutput('  clear - Clear terminal');
      addOutput('  exit - Return to main site');
      addOutput('');
    } else if (command === 'look') {
      addOutput('');
      addOutput(room.name.toUpperCase());
      addOutput(room.description);
      if (room.items.length > 0) {
        const remainingItems = room.items.filter(item => !gameState.inventory.includes(item));
        if (remainingItems.length > 0) {
          addOutput(`Items: ${remainingItems.join(', ')}`);
        }
      }
      addOutput('');
    } else if (command.startsWith('examine ')) {
      const object = command.replace('examine ', '');
      if (object === 'desk') {
        addOutput('A standard corporate desk. Lumon Industries branded. Empty.');
      } else if (object === 'keycard') {
        addOutput('A security keycard labeled “SEVERANCE WING - AUTHORIZED PERSONNEL ONLY”');
      } else if (object === 'circle') {
        addOutput('Ritual markings in white chalk. Five points. One for each member.');
      } else if (object === 'symbols') {
        addOutput('Occult sigils mixed with corporate efficiency charts. Something about synergy.');
      } else if (object === 'candle' || object === 'candles') {
        addOutput('Black candles. Still warm. Someone was here recently.');
      } else if (object === 'tape' || object === 'tapes') {
        addOutput('Cassette tapes marked “EXIT.WAVE - DO NOT ERASE - 128 BPM”');
      } else {
        addOutput(`You don’t see anything special about “${object}”`);
      }
      addOutput('');
    } else if (command.startsWith('take ')) {
      const item = command.replace('take ', '');
      if (room.items.includes(item) && !gameState.inventory.includes(item)) {
        setGameState(prev => ({
          ...prev,
          inventory: [...prev.inventory, item]
        }));
        addOutput(`Taken: ${item}`);
      } else {
        addOutput(`Cannot take "${item}"`);
      }
      addOutput('');
    } else if (command === 'inventory' || command === 'inv' || command === 'i') {
      addOutput('');
      if (gameState.inventory.length === 0) {
        addOutput('Your inventory is empty.');
      } else {
        addOutput('INVENTORY:');
        gameState.inventory.forEach(item => addOutput(`  - ${item}`));
      }
      addOutput('');
    } else if (command.startsWith('go ')) {
      const direction = command.replace('go ', '');
      if (room.exits[direction as keyof typeof room.exits]) {
        const newRoom = room.exits[direction as keyof typeof room.exits] as string;
        setGameState(prev => ({
          ...prev,
          currentRoom: newRoom,
          visitedRooms: new Set([...prev.visitedRooms, newRoom])
        }));
        const nextRoom = rooms[newRoom as keyof typeof rooms];
        addOutput('');
        addOutput(nextRoom.name.toUpperCase());
        addOutput(nextRoom.description);
        addOutput('');
      } else {
        addOutput('You cannot go that way.');
        addOutput('');
      }
    } else if (command === 'clear') {
      setHistory([]);
    } else if (command === 'exit') {
      navigate('/');
    } else if (command === 'map') {
      addOutput('');
      addOutput('FACILITY MAP:');
      addOutput('  [RITUAL CHAMBER]');
      addOutput('         |');
      addOutput('         N');
      addOutput('         |');
      addOutput('  [LOBBY] --E-- [ARCHIVE]');
      addOutput('');
    } else {
      addOutput(`Unknown command: "${command}"`);
      addOutput('Type "help" for available commands.');
      addOutput('');
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      handleCommand(input);
      setInput('');
    }
  };

  return (
    <div className="min-h-screen bg-[#07070d] text-[#4fd1d1] flex flex-col">
      {/* Terminal Content */}
      <div className="flex-1 container mx-auto max-w-4xl px-8 py-16">
        {/* Terminal Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8 pb-4 border-b border-[#4fd1d1]/30"
        >
          <div className="text-mono text-sm text-[#4fd1d1]/70">
            █ SECRET TERMINAL ACCESSED
          </div>
          <div className="text-mono text-xs text-[#4fd1d1]/50 mt-1">
            Connection established to EXIT.WAVE internal systems
          </div>
        </motion.div>

        {/* Terminal Output */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-6 space-y-1 text-mono text-sm"
        >
          {history.map((entry, index) => (
            <div 
              key={index}
              className={
                entry.type === 'input' 
                  ? 'text-[#8b7fd4]' 
                  : 'text-[#4fd1d1]/90'
              }
            >
              {entry.text}
            </div>
          ))}
          <div ref={historyEndRef} />
        </motion.div>

        {/* Terminal Input */}
        <form onSubmit={handleSubmit} className="flex items-center gap-2 sticky bottom-8">
          <span className="text-mono text-sm text-[#8b7fd4]">{'>'}</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent border-none outline-none text-mono text-sm text-[#4fd1d1] caret-[#4fd1d1]"
            spellCheck={false}
            autoComplete="off"
          />
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-[#4fd1d1]"
          >
            █
          </motion.span>
        </form>

        {/* Help hint */}
        <div className="mt-8 text-mono text-xs text-[#4fd1d1]/40">
          Hint: You are in a text adventure. Try examining your surroundings.
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}