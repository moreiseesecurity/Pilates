import { useState, useEffect } from 'react';
import type { ReactElement } from 'react';
import { supabase } from './supabaseClient';

interface Move {
  id: string;
  name: string;
  icon: string;
}

interface Routine {
  id: string;
  title: string;
  duration: number;
  intensity: string;
  moves: Move[];
}

interface ClassDetailProps {
  routine: Routine;
  onBack: () => void;
  onUpdated: (updated: Routine) => void;
  onDeleted: (id: string) => void;
}

const ICON_SVG: Record<string, ReactElement> = {
  arms: <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="#a8b5a2" strokeWidth="2" strokeLinecap="round">
    <circle cx="16" cy="5" r="3"/>
    <line x1="16" y1="8" x2="16" y2="16"/>
    <line x1="16" y1="12" x2="7" y2="9"/>
    <line x1="7" y1="9" x2="4" y2="14"/>
    <line x1="16" y1="12" x2="25" y2="9"/>
    <line x1="25" y1="9" x2="28" y2="14"/>
    <line x1="16" y1="16" x2="13" y2="26"/>
    <line x1="16" y1="16" x2="19" y2="26"/>
  </svg>,
  legs: <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="#a8b5a2" strokeWidth="2" strokeLinecap="round">
    <circle cx="16" cy="5" r="3"/>
    <line x1="16" y1="8" x2="16" y2="18"/>
    <line x1="10" y1="12" x2="22" y2="12"/>
    <line x1="16" y1="18" x2="11" y2="26"/>
    <line x1="11" y1="26" x2="8" y2="26"/>
    <line x1="16" y1="18" x2="21" y2="26"/>
    <line x1="21" y1="26" x2="24" y2="26"/>
  </svg>,
  core: <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="#a8b5a2" strokeWidth="2" strokeLinecap="round">
    <circle cx="16" cy="5" r="3"/>
    <line x1="16" y1="8" x2="16" y2="18"/>
    <line x1="10" y1="12" x2="22" y2="12"/>
    <ellipse cx="16" cy="13" rx="5" ry="4" strokeDasharray="2 2"/>
    <line x1="16" y1="18" x2="13" y2="26"/>
    <line x1="16" y1="18" x2="19" y2="26"/>
  </svg>,
  stretch: <svg viewBox="0 0 32 32" width="22" height="22" fill="none" stroke="#a8b5a2" strokeWidth="2" strokeLinecap="round">
    <circle cx="16" cy="5" r="3"/>
    <path d="M16 8 Q16 14 10 16"/>
    <path d="M16 8 Q16 14 22 16"/>
    <path d="M10 16 Q6 20 8 26"/>
    <path d="M22 16 Q26 20 24 26"/>
    <line x1="8" y1="26" x2="4" y2="26"/>
    <line x1="24" y1="26" x2="28" y2="26"/>
  </svg>,
};

const INTENSITY_OPTIONS = ['Low', 'Medium', 'High'];

export default function ClassDetail({ routine, onBack, onUpdated, onDeleted }: ClassDetailProps) {
  const [moves, setMoves] = useState<Move[]>(routine.moves ?? []);
  const [title, setTitle] = useState(routine.title);
  const [intensity, setIntensity] = useState(routine.intensity);
  const [saving, setSaving] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);

  const removeMove = (index: number) => {
    setMoves(prev => prev.filter((_, i) => i !== index));
  };

  const moveUp = (index: number) => {
    if (index === 0) return;
    setMoves(prev => {
      const next = [...prev];
      [next[index - 1], next[index]] = [next[index], next[index - 1]];
      return next;
    });
  };

  const moveDown = (index: number) => {
    if (index === moves.length - 1) return;
    setMoves(prev => {
      const next = [...prev];
      [next[index], next[index + 1]] = [next[index + 1], next[index]];
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    const updated = { title, intensity, moves, duration: moves.length * 2 };
    const { data, error } = await supabase
      .from('classes')
      .update(updated)
      .eq('id', routine.id)
      .select();
    if (error) {
      alert('Error saving: ' + error.message);
    } else if (data) {
      onUpdated(data[0]);
      onBack();
    }
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm(`Delete "${title}"?`)) return;
    const { error } = await supabase.from('classes').delete().eq('id', routine.id);
    if (error) alert('Error deleting: ' + error.message);
    else onDeleted(routine.id);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f9f5f2', paddingBottom: '100px' }}>
      <div style={{ background: 'white', padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: '1px solid #f0f0f0', position: 'sticky', top: 0, zIndex: 10 }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', padding: '4px', color: '#4a4a4a' }}>←</button>
        {editingTitle ? (
          <input
            autoFocus
            value={title}
            onChange={e => setTitle(e.target.value)}
            onBlur={() => setEditingTitle(false)}
            style={{ flex: 1, fontSize: '18px', fontWeight: '500', border: 'none', borderBottom: '2px solid #a8b5a2', outline: 'none', background: 'transparent', padding: '2px 0' }}
          />
        ) : (
          <h2 onClick={() => setEditingTitle(true)} style={{ flex: 1, margin: 0, fontSize: '18px', fontWeight: '500', cursor: 'text' }}>{title}</h2>
        )}
        <button onClick={handleDelete} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#ccc' }}>🗑</button>
      </div>

      <div style={{ padding: '20px' }}>
        <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          {[
            { label: 'Moves', value: moves.length },
            { label: 'Est. Duration', value: `${moves.length * 2} min` },
          ].map(s => (
            <div key={s.label} style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
              <div style={{ fontSize: '22px', fontWeight: '500', color: '#4a4a4a' }}>{s.value}</div>
              <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
          <div style={{ flex: 1, background: 'white', borderRadius: '12px', padding: '14px', textAlign: 'center' }}>
            <select
              value={intensity}
              onChange={e => setIntensity(e.target.value)}
              style={{ fontSize: '15px', fontWeight: '500', border: 'none', background: 'transparent', color: '#4a4a4a', textAlign: 'center', cursor: 'pointer', width: '100%' }}
            >
              {INTENSITY_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
            <div style={{ fontSize: '12px', color: '#aaa', marginTop: '2px' }}>Intensity</div>
          </div>
        </div>

        <h4 style={{ margin: '0 0 12px 0', fontWeight: '500', fontSize: '14px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Class Flow</h4>

        {moves.length === 0 && (
          <p style={{ color: '#ccc', fontSize: '14px', textAlign: 'center', padding: '30px 0' }}>No moves in this class</p>
        )}

        {moves.map((move, idx) => (
          <div key={`${move.id}-${idx}`} style={{
            background: 'white', borderRadius: '12px', padding: '14px 16px',
            marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px'
          }}>
            <span style={{ fontSize: '13px', color: '#ccc', minWidth: '20px', textAlign: 'right' }}>{idx + 1}</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#f0f4ef', borderRadius: '8px', flexShrink: 0 }}>
              {ICON_SVG[move.icon] ?? ICON_SVG['arms']}
            </div>
            <span style={{ flex: 1, fontSize: '15px', fontWeight: '500' }}>{move.name}</span>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <button onClick={() => moveUp(idx)} disabled={idx === 0} style={{ background: 'none', border: 'none', cursor: 'pointer', color: idx === 0 ? '#eee' : '#aaa', fontSize: '14px', padding: '2px' }}>▲</button>
              <button onClick={() => moveDown(idx)} disabled={idx === moves.length - 1} style={{ background: 'none', border: 'none', cursor: 'pointer', color: idx === moves.length - 1 ? '#eee' : '#aaa', fontSize: '14px', padding: '2px' }}>▼</button>
            </div>
            <button onClick={() => removeMove(idx)} style={{ background: 'none', border: 'none', fontSize: '18px', color: '#ddd', cursor: 'pointer', padding: '4px' }}>✕</button>
          </div>
        ))}
      </div>

      <div style={{ position: 'fixed', bottom: 0, left: 0, right: 0, padding: '16px 20px calc(16px + env(safe-area-inset-bottom))', background: 'white', borderTop: '1px solid #f0f0f0' }}>
        <button
          onClick={handleSave}
          disabled={saving}
          style={{ width: '100%', background: '#a8b5a2', color: 'white', border: 'none', padding: '16px', borderRadius: '14px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', opacity: saving ? 0.7 : 1 }}
        >
          {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}