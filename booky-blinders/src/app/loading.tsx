// src/app/loading.tsx
export default function Loading() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#0a0a0a' }}>
      <p style={{ color: '#b87333', fontFamily: 'serif', letterSpacing: '0.2em' }}>
        LOADING THE ARCHIVES...
      </p>
    </div>
  );
}