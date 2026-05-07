import { useState, useEffect } from 'react'
import { supabase } from './supabaseClient'
import MoveLibrary from './MoveLibrary'
import ClassDetail from './ClassDetail'

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

const CORRECT_PIN = '0609';

function PinScreen({ onUnlock }: { onUnlock: () => void }) {
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);

  const handleDigit = (digit: string) => {
    if (pin.length >= 4) return;
    const next = pin + digit;
    setPin(next);
    setError(false);
    if (next.length === 4) {
      if (next === CORRECT_PIN) {
        sessionStorage.setItem('pilates_unlocked', 'true');
        onUnlock();
      } else {
        setTimeout(() => { setPin(''); setError(true); }, 400);
      }
    }
  };

  const handleDelete = () => setPin(prev => prev.slice(0, -1));

  return (
    <div style={{
      minHeight: '100vh', background: '#f9f5f2', display: 'flex',
      flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px 20px'
    }}>
      <h1 style={{ fontSize: '26px', fontWeight: '300', marginBottom: '8px', color: '#4a4a4a' }}>Pilates Studio</h1>
      <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '48px' }}>Enter your PIN to continue</p>

      {/* Dots */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
        {[0,1,2,3].map(i => (
          <div key={i} style={{
            width: '16px', height: '16px', borderRadius: '50%',
            background: i < pin.length ? (error ? '#e88' : '#a8b5a2') : '#ddd',
            transition: 'background 0.15s'
          }}/>
        ))}
      </div>

      {error && <p style={{ color: '#e88', fontSize: '13px', marginBottom: '24px', marginTop: '-36px' }}>Incorrect PIN</p>}

      {/* Keypad */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 72px)', gap: '12px' }}>
        {['1','2','3','4','5','6','7','8','9','','0','⌫'].map((d, i) => (
          <button
            key={i}
            onClick={() => d === '⌫' ? handleDelete() : d !== '' ? handleDigit(d) : null}
            disabled={d === ''}
            style={{
              width: '72px', height: '72px', borderRadius: '50%', border: 'none',
              background: d === '' ? 'transparent' : 'white',
              fontSize: d === '⌫' ? '20px' : '22px',
              fontWeight: '400', color: '#4a4a4a', cursor: d === '' ? 'default' : 'pointer',
              boxShadow: d === '' ? 'none' : '0 2px 8px rgba(0,0,0,0.08)'
            }}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

function App() {
  const [unlocked, setUnlocked] = useState(false);
  const [viewingRoutine, setViewingRoutine] = useState<Routine | null>(null);
  const [currentClassBuild, setCurrentClassBuild] = useState<Move[]>([]);
  const [savedRoutines, setSavedRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (sessionStorage.getItem('pilates_unlocked') === 'true') {
      setUnlocked(true);
    }
  }, []);

  useEffect(() => {
    if (unlocked) fetchRoutines();
  }, [unlocked]);

  async function fetchRoutines() {
    setLoading(true);
    const { data, error } = await supabase
      .from('classes')
      .select('*')
      .order('id', { ascending: false });

    console.log('fetch result:', data, error);
    if (error) console.error('Error fetching routines:', error);
    else if (data) setSavedRoutines(data);
    setLoading(false);
  }

  const handleLock = () => {
    sessionStorage.removeItem('pilates_unlocked');
    setUnlocked(false);
  };

  const handleAddToClass = (move: Move) => {
    setCurrentClassBuild((prev) => [...prev, move]);
  };

  const removeFromClass = (index: number) => {
    setCurrentClassBuild((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveClass = async () => {
    const className = prompt("Name this class:", `Flow ${savedRoutines.length + 1}`);
    if (!className) return;

    const newRoutine = {
      title: className,
      duration: currentClassBuild.length * 2,
      intensity: 'Medium',
      moves: currentClassBuild
    };

    const { data, error } = await supabase
      .from('classes')
      .insert([newRoutine])
      .select();

    if (error) {
      alert("Error saving class: " + error.message);
    } else if (data && data.length > 0) {
      setSavedRoutines([data[0], ...savedRoutines]);
      setCurrentClassBuild([]);
    }
  };

  if (!unlocked) return <PinScreen onUnlock={() => setUnlocked(true)} />;

  if (viewingRoutine) {
    return (
      <ClassDetail
        routine={viewingRoutine}
        onBack={() => setViewingRoutine(null)}
        onUpdated={(updated) => {
          setSavedRoutines(prev => prev.map(r => r.id === updated.id ? updated : r));
          setViewingRoutine(null);
        }}
        onDeleted={(id) => {
          setSavedRoutines(prev => prev.filter(r => r.id !== id));
          setViewingRoutine(null);
        }}
      />
    );
  }

  return (
    <div style={{
      fontFamily: 'sans-serif', padding: '20px', backgroundColor: '#f9f5f2',
      minHeight: '100vh', color: '#4a4a4a',
      paddingBottom: currentClassBuild.length > 0 ? '420px' : '40px',
      transition: 'padding-bottom 0.3s ease'
    }}>
      <header style={{ marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ fontSize: '28px', fontWeight: '300', margin: 0 }}>Pilates Studio</h1>
          <p style={{ opacity: 0.7, margin: '4px 0 0 0', fontSize: '14px' }}>Madhuri</p>
        </div>
        <button
          onClick={handleLock}
          title="Lock app"
          style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', opacity: 0.4 }}
        >
          🔒
        </button>
      </header>

      <main>
        <MoveLibrary onAddToClass={handleAddToClass} />

        <div style={{ margin: '40px 0 20px 0', fontWeight: 'bold', fontSize: '18px' }}>
          Your Saved Classes
        </div>

        {loading ? (
          <p>Loading your library...</p>
        ) : savedRoutines.length === 0 ? (
          <p style={{ color: '#aaa', fontSize: '14px' }}>No classes saved yet. Build one above!</p>
        ) : (
          savedRoutines.map((r) => (
            <div
              key={r.id}
              onClick={() => setViewingRoutine(r)}
              style={{
                background: 'white', padding: '20px', borderRadius: '15px', marginBottom: '15px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                border: '2px solid transparent',
                cursor: 'pointer'
              }}
            >
              <h3 style={{ margin: '0 0 5px 0' }}>{r.title}</h3>
              <div style={{ fontSize: '14px', opacity: 0.6 }}>
                <span>{r.duration} min</span> • <span>{r.intensity} Intensity</span> • <span>{r.moves?.length ?? 0} moves</span>
              </div>
            </div>
          ))
        )}
      </main>

      {currentClassBuild.length > 0 && (
        <div style={{
          position: 'fixed', bottom: '0', left: '0', right: '0', background: 'white',
          borderTopLeftRadius: '24px', borderTopRightRadius: '24px',
          padding: '20px 20px calc(20px + env(safe-area-inset-bottom))',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.12)', maxHeight: '60vh',
          display: 'flex', flexDirection: 'column', zIndex: 1000
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '15px' }}>
            <h3 style={{ margin: 0 }}>Class Flow ({currentClassBuild.length})</h3>
            <button onClick={() => setCurrentClassBuild([])} style={{ color: '#ff6b6b', border: 'none', background: 'none', fontWeight: 'bold' }}>Clear</button>
          </div>

          <div style={{ overflowY: 'auto', flexGrow: 1, marginBottom: '15px' }}>
            {currentClassBuild.map((move, idx) => (
              <div key={`${move.id}-${idx}`} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px', background: '#f8fafa', borderRadius: '12px', marginBottom: '8px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ opacity: 0.4, fontSize: '12px' }}>{idx + 1}</span>
                  <span style={{ fontWeight: '500' }}>{move.name}</span>
                </div>
                <button onClick={() => removeFromClass(idx)} style={{ border: 'none', background: 'none', fontSize: '20px', color: '#ccc' }}>✕</button>
              </div>
            ))}
          </div>

          <button
            onClick={handleSaveClass}
            style={{
              width: '100%', background: '#a8b5a2', color: 'white', border: 'none',
              padding: '16px', borderRadius: '14px', fontWeight: 'bold', fontSize: '16px'
            }}
          >
            Save to Cloud Database
          </button>
        </div>
      )}
    </div>
  );
}

export default App