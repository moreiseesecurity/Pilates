import { useState } from 'react';

export default function MoveLibrary() {
  const [name, setName] = useState('');
  const [icon, setIcon] = useState('🧘'); // Default icon

  const handleSaveMove = () => {
    if (!name) return alert("Please enter a move name");
    
    // For now, we'll log it. Later, this is where the Supabase 'insert' goes.
    console.log("Saving Move:", { name, icon });
    
    alert(`${name} added to library!`);
    setName(''); // Clear form
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
    </div>
  );
}