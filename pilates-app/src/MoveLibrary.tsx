import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { supabase } from './supabaseClient';

interface Move {
  id: string;
  name: string;
  icon: string;
}

interface MoveLibraryProps {
  onAddToClass: (move: Move) => void;
}

const PILATES_ICONS = [
  {
    value: 'arms', label: 'Arms',
    svg: <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="#a8b5a2" strokeWidth="2" strokeLinecap="round">
      <circle cx="16" cy="5" r="3"/>
      <line x1="16" y1="8" x2="16" y2="16"/>
      <line x1="16" y1="12" x2="7" y2="9"/>
      <line x1="7" y1="9" x2="4" y2="14"/>
      <line x1="16" y1="12" x2="25" y2="9"/>
      <line x1="25" y1="9" x2="28" y2="14"/>
      <line x1="16" y1="16" x2="13" y2="26"/>
      <line x1="16" y1="16" x2="19" y2="26"/>
    </svg>
  },
  {
    value: 'legs', label: 'Legs',
    svg: <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="#a8b5a2" strokeWidth="2" strokeLinecap="round">
      <circle cx="16" cy="5" r="3"/>
      <line x1="16" y1="8" x2="16" y2="18"/>
      <line x1="10" y1="12" x2="22" y2="12"/>
      <line x1="16" y1="18" x2="11" y2="26"/>
      <line x1="11" y1="26" x2="8" y2="26"/>
      <line x1="16" y1="18" x2="21" y2="26"/>
      <line x1="21" y1="26" x2="24" y2="26"/>
    </svg>
  },
  {
    value: 'core', label: 'Core',
    svg: <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="#a8b5a2" strokeWidth="2" strokeLinecap="round">
      <circle cx="16" cy="5" r="3"/>
      <line x1="16" y1="8" x2="16" y2="18"/>
      <line x1="10" y1="12" x2="22" y2="12"/>
      <ellipse cx="16" cy="13" rx="5" ry="4" strokeDasharray="2 2"/>
      <line x1="16" y1="18" x2="13" y2="26"/>
      <line x1="16" y1="18" x2="19" y2="26"/>
    </svg>
  },
  {
    value: 'stretch', label: 'Stretch',
    svg: <svg viewBox="0 0 32 32" width="28" height="28" fill="none" stroke="#a8b5a2" strokeWidth="2" strokeLinecap="round">
      <circle cx="16" cy="5" r="3"/>
      <path d="M16 8 Q16 14 10 16"/>
      <path d="M16 8 Q16 14 22 16"/>
      <path d="M10 16 Q6 20 8 26"/>
      <path d="M22 16 Q26 20 24 26"/>
      <line x1="8" y1="26" x2="4" y2="26"/>
      <line x1="24" y1="26" x2="28" y2="26"/>
    </svg>
  },
];

export default function MoveLibrary({ onAddToClass }: MoveLibraryProps) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('arms');
  const [allMoves, setAllMoves] = useState<Move[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchMoves();
  }, []);

  async function fetchMoves() {
    setLoading(true);
    const { data, error } = await supabase.from('moves').select('*').order('id');
    if (error) console.error('Error fetching moves:', error);
    else if (data) setAllMoves(data);
    setLoading(false);
  }

  const handleSaveMove = async () => {
    if (!name.trim()) return alert('Please enter a move name');
    setSaving(true);
    const { data, error } = await supabase
      .from('moves')
      .insert([{ name: name.trim(), icon: selectedIcon }])
      .select();
    if (error) {
      alert('Error saving move: ' + error.message);
    } else if (data) {
      setAllMoves(prev => [...prev, data[0]]);
      setName('');
    }
    setSaving(false);
  };

  const iconMap = Object.fromEntries(PILATES_ICONS.map(i => [i.value, i.svg])) as Record<string, ReactElement>;

  return (
    <div style={{ background: 'white', borderRadius: '16px', padding: '20px', marginBottom: '20px' }}>
      <h3 style={{ margin: '0 0 16px 0', fontWeight: '500', fontSize: '16px' }}>Move Library</h3>

      <input
        type="text"
        placeholder="Move name (e.g. The Hundred)"
        value={name}
        onChange={e => setName(e.target.value)}
        style={{ width: '100%', padding: '10px 12px', borderRadius: '10px', border: '1px solid #e0e0e0', fontSize: '14px', marginBottom: '12px', boxSizing: 'border-box' }}
      />

      <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
        {PILATES_ICONS.map(icon => (
          <button
            key={icon.value}
            onClick={() => setSelectedIcon(icon.value)}
            title={icon.label}
            style={{
              flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: selectedIcon === icon.value ? '#eef2ed' : '#f7f7f7',
              outline: selectedIcon === icon.value ? '2px solid #a8b5a2' : 'none',
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px'
            }}
          >
            {icon.svg}
            <span style={{ fontSize: '10px', color: '#888' }}>{icon.label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={handleSaveMove}
        disabled={saving}
        style={{ width: '100%', background: '#a8b5a2', color: 'white', padding: '12px', border: 'none', borderRadius: '10px', fontWeight: '600', fontSize: '14px', cursor: 'pointer', marginBottom: '20px', opacity: saving ? 0.7 : 1 }}
      >
        {saving ? 'Saving...' : 'Save Move'}
      </button>

      <hr style={{ border: 'none', borderTop: '1px solid #f0f0f0', margin: '0 0 16px 0' }} />

      {loading ? (
        <p style={{ color: '#aaa', fontSize: '14px' }}>Loading moves...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {allMoves.map(move => (
            <div key={move.id} style={{ border: '1px solid #f0f0f0', borderRadius: '12px', padding: '12px', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '6px' }}>
                {iconMap[move.icon] ?? iconMap['arms']}
              </div>
              <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '8px' }}>{move.name}</div>
              <button
                onClick={() => onAddToClass(move)}
                style={{ background: '#f0f4ef', border: 'none', borderRadius: '6px', padding: '5px 10px', fontSize: '12px', cursor: 'pointer', color: '#4a7a5a' }}
              >
                + Add to Class
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}