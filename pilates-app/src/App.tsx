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

function App() {
  const [viewingRoutine, setViewingRoutine] = useState<Routine | null>(null);
  const [currentClassBuild, setCurrentClassBuild] = useState<Move[]>([]);
  const [savedRoutines, setSavedRoutines] = useState<Routine[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoutines();
  }, []);

  async function fetchRoutines() {
  setLoading(true);
  const { data, error } = await supabase
    .from('classes')
    .select('*')
    .order('created_at', { ascending: false });

  console.log('fetch result:', data, error);

  if (error) console.error('Error fetching routines:', error);
  else if (data) setSavedRoutines(data);
  setLoading(false);
}

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
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '300' }}>Pilates Studio</h1>
        <p style={{ opacity: 0.7 }}>Cloud Sync Active</p>
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