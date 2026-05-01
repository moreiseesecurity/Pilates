import { useState } from 'react'
import MoveLibrary from './MoveLibrary'

// Define the Move interface to keep data consistent across components
interface Move {
  id: string;
  name: string;
  icon: string;
}

function App() {
  const [activeRoutine, setActiveRoutine] = useState<string | null>(null);
  
  // State for the moves Madhuri is currently selecting for a new class
  const [currentClassBuild, setCurrentClassBuild] = useState<Move[]>([]);

  // Handlers for building the class
  const handleAddToClass = (move: Move) => {
    setCurrentClassBuild((prev) => [...prev, move]);
  };

  const removeFromClass = (index: number) => {
    setCurrentClassBuild((prev) => prev.filter((_, i) => i !== index));
  };

  const routines = [
    { id: '1', title: 'Morning Flow', duration: '15 min', intensity: 'Low' },
    { id: '2', title: 'Core Power', duration: '30 min', intensity: 'High' },
    { id: '3', title: 'Reformer Style Mat', duration: '45 min', intensity: 'Medium' },
  ];

  return (
    <div style={{ 
      fontFamily: 'sans-serif', 
      padding: '20px', 
      backgroundColor: '#f9f5f2', 
      minHeight: '100vh',
      color: '#4a4a4a',
      // Added extra bottom padding so the drawer doesn't hide the library content
      paddingBottom: currentClassBuild.length > 0 ? '300px' : '40px',
      transition: 'padding-bottom 0.3s ease'
    }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '300' }}>Pilates Studio</h1>
        <p style={{ opacity: 0.7 }}>Ready for your session, Madhuri?</p>
      </header>

      <main>
        {/* Pass the handler to the library component */}
        <MoveLibrary onAddToClass={handleAddToClass} /> 
        
        <div style={{ margin: '40px 0 20px 0', fontWeight: 'bold', fontSize: '18px' }}>
          Your Saved Classes
        </div>

        {routines.map((r) => (
          <div 
            key={r.id}
            onClick={() => setActiveRoutine(r.title)}
            style={{
              background: 'white',
              padding: '20px',
              borderRadius: '15px',
              marginBottom: '15px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              border: activeRoutine === r.title ? '2px solid #a8b5a2' : '2px solid transparent',
              cursor: 'pointer'
            }}
          >
            <h3 style={{ margin: '0 0 5px 0' }}>{r.title}</h3>
            <div style={{ fontSize: '14px', opacity: 0.6 }}>
              <span>{r.duration}</span> • <span>{r.intensity} Intensity</span>
            </div>
          </div>
        ))}
      </main>

      {/* --- VERTICAL CLASS BUILDER DRAWER --- */}
      {currentClassBuild.length > 0 && (
        <div style={{
          position: 'fixed',
          bottom: '0',
          left: '0',
          right: '0',
          background: 'white',
          borderTopLeftRadius: '24px',
          borderTopRightRadius: '24px',
          padding: '20px 20px calc(20px + env(safe-area-inset-bottom))', // Safe area for mobile
          boxShadow: '0 -10px 40px rgba(0,0,0,0.12)',
          maxHeight: '60vh',
          display: 'flex',
          flexDirection: 'column',
          zIndex: 1000,
          border: '1px solid #eee'
        }}>
          {/* Header section with Clear All */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3 style={{ margin: 0, fontSize: '18px' }}>Class Flow ({currentClassBuild.length})</h3>
            <button 
              onClick={() => setCurrentClassBuild([])}
              style={{ color: '#ff6b6b', border: 'none', background: 'none', fontWeight: 'bold', cursor: 'pointer' }}
            >
              Clear
            </button>
          </div>
          
          {/* Scrollable List Area */}
          <div style={{ overflowY: 'auto', flexGrow: 1, marginBottom: '15px' }}>
            {currentClassBuild.map((move, idx) => (
              <div 
                key={`${move.id}-${idx}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '12px',
                  background: '#f8fafa',
                  borderRadius: '12px',
                  marginBottom: '8px',
                  border: '1px solid #f0f0f0'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ opacity: 0.4, fontSize: '12px', width: '15px' }}>{idx + 1}</span>
                  <span style={{ fontSize: '20px' }}>{move.icon}</span>
                  <span style={{ fontWeight: '500' }}>{move.name}</span>
                </div>
                <button 
                  onClick={() => removeFromClass(idx)}
                  style={{ border: 'none', background: 'none', fontSize: '20px', color: '#ccc', cursor: 'pointer' }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button style={{
            width: '100%',
            background: '#a8b5a2',
            color: 'white',
            border: 'none',
            padding: '16px',
            borderRadius: '14px',
            fontWeight: 'bold',
            fontSize: '16px',
            boxShadow: '0 4px 12px rgba(168, 181, 162, 0.4)'
          }}>
            Save as New Class
          </button>
        </div>
      )}

      {/* Starting Routine Toast (Only shows if builder is empty) */}
      {activeRoutine && currentClassBuild.length === 0 && (
        <div style={{
          position: 'fixed',
          bottom: '30px',
          left: '20px',
          right: '20px',
          background: '#a8b5a2',
          color: 'white',
          padding: '18px',
          borderRadius: '14px',
          textAlign: 'center',
          fontWeight: 'bold',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          zIndex: 999
        }}>
          Starting {activeRoutine}...
        </div>
      )}
    </div>
  )
}

export default App