import { useState } from 'react'
import MoveLibrary from './MoveLibrary' // Fixed the path here

function App() {
  const [activeRoutine, setActiveRoutine] = useState<string | null>(null);

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
      color: '#4a4a4a' 
    }}>
      <header style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: '300' }}>Pilates Studio</h1>
        <p style={{ opacity: 0.7 }}>Ready for your session?</p>
      </header>

      <main>
        {/* --- ADD THIS NEW SECTION BELOW --- */}
        <MoveLibrary /> 
        
        <div style={{ margin: '40px 0 20px 0', fontWeight: 'bold', fontSize: '18px' }}>
          Your Saved Classes
        </div>
        {/* ---------------------------------- */}

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

      {activeRoutine && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          right: '20px',
          background: '#a8b5a2',
          color: 'white',
          padding: '15px', // Use standard padding here if safe-area is in index.html
          borderRadius: '12px',
          textAlign: 'center',
          fontWeight: 'bold',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
        }}>
          Starting {activeRoutine}...
        </div>
      )}
    </div>
  )
}

export default App