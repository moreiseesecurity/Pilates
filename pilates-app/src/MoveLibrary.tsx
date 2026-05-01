import { useState } from 'react';

// Define the interface to match App.tsx
interface Move {
  id: string;
  name: string;
  icon: string;
}

interface MoveLibraryProps {
  onAddToClass: (move: Move) => void;
}

export default function MoveLibrary({ onAddToClass }: MoveLibraryProps) {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🧘');
  
  // Local state to simulate your database for now
  const [allMoves, setAllMoves] = useState<Move[]>([
    { id: '1', name: 'The Hundred', icon: '🧘' },
    { id: '2', name: 'Leg Circles', icon: '🤸' }
  ]);

  const handleSaveMove = () => {
    if (!name) return alert("Please enter a move name");
    
    const newMove: Move = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      icon
    };

    setAllMoves([...allMoves, newMove]);
    setName('');
    alert(`${name} added to library!`);
  };

  return (
    <div style={{ padding: '20px', background: 'white', borderRadius: '15px', margin: '10px' }}>
      <h3>Add New Pilates Move</h3>
      <input 
        type="text" 
        placeholder="Move Name (e.g. The Hundred)" 
        value={name}
        onChange={(e) => setName(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc' }}
      />

      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        {['🧘', '💪', '🤸', '✨'].map(emoji => (
          <button 
            key={emoji}
            onClick={() => setIcon(emoji)}
            style={{ 
              fontSize: '24px', 
              background: icon === emoji ? '#a8b5a2' : '#f0f0f0',
              border: 'none', borderRadius: '8px', padding: '10px'
            }}
          >
            {emoji}
          </button>
        ))}
      </div>

      <button 
        onClick={handleSaveMove}
        style={{ width: '100%', background: '#a8b5a2', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontWeight: 'bold' }}
      >
        Save to Moves Database
      </button>

      <hr style={{ margin: '20px 0', border: '0.5px solid #eee' }} />

      <h4>Available Moves</h4>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        {allMoves.map((move) => (
          <div key={move.id} style={{ border: '1px solid #eee', padding: '10px', borderRadius: '10px', textAlign: 'center' }}>
            <div style={{ fontSize: '24px' }}>{move.icon}</div>
            <div style={{ fontSize: '14px', margin: '5px 0' }}>{move.name}</div>
            <button 
              onClick={() => onAddToClass(move)}
              style={{ background: '#f0f4ef', border: 'none', borderRadius: '5px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer' }}
            >
              Add to Class ➕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}