import { useState, useEffect } from 'react';
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
  { value: 'spine', label: 'Spine', svg: <svg viewBox="0 0 32 32" width="28" height="28"><ellipse cx="16" cy="6" rx="4" ry="4" fill="none" stroke="#a8b5a2" strokeWidth="2"/><line x1="16" y1="10" x2="16" y2="26" stroke="#a8b5a2" strokeWidth="2.5" strokeLinecap="round"/><line x1="16" y1="14" x2="12" y2="17" stroke="#a8b5a2" strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="18" x2="20" y2="21" stroke="#a8b5a2" strokeWidth="2" strokeLinecap="round"/><line x1="16" y1="22" x2="12" y2="25" stroke="#a8b5a2" strokeWidth="2" strokeLinecap="round"/></svg> },
  { value: 'legs', label: 'Legs', svg: <svg viewBox="0 0 32 32" width="28" height="28"><ellipse cx="16" cy="5" rx="4" ry="3" fill="none" stroke="#a8b5a2" strokeWidth="2"/><path d="M12 8 Q10 16 11 26" stroke="#a8b5a2" strokeWidth="2.5" fill="none" strokeLinecap="round"/><path d="M20 8 Q22 16 21 26" stroke="#a8b5a2" strokeWidth="2.5" fill="none" strokeLinecap="round"/></svg> },
  { value: 'core', label: 'Core', svg: <svg viewBox="0 0 32 32" width="28" height="28"><ellipse cx="16" cy="16" rx="10" ry="13" fill="none" stroke="#a8b5a2" strokeWidth="2"/><ellipse cx="16" cy="16" rx="5" ry="7" fill="none" stroke="#a8b5a2" strokeWidth="1.5" strokeDasharray="3 2"/></svg> },
  { value: 'stretch', label: 'Stretch', svg: <svg viewBox="0 0 32 32" width="28" height="28"><ellipse cx="16" cy="6" rx="3" ry="3" fill="none" stroke="#a8b5a2" strokeWidth="2"/><line x1="16" y1="9" x2="16" y2="18" stroke="#a8b5a2" strokeWidth="2.5" strokeLinecap="round"/><path d="M8 13 L16 15 L24 13" stroke="#a8b5a2" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M16 18 Q13 24 11 29" stroke="#a8b5a2" strokeWidth="2" fill="none" strokeLinecap="round"/><path d="M16 18 Q19 24 21 29" stroke="#a8b5a2" strokeWidth="2" fill="none" strokeLinecap="round"/></svg> },
];

export default function MoveLibrary({ onAddToClass }: MoveLibraryProps) {
  const [name, setName] = useState('');
  const [selectedIcon, setSelectedIcon] = useState('spine');
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

  const iconMap = Object.fromEntries(PILATES_ICONS.map(i => [i.value, i.svg]));

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
                {iconMap[move.icon] ?? iconMap['spine']}
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