import { useState } from 'react';
import { UserForm } from './components/UserForm';
import { UserTable } from './components/UserTable';
import './App.css';

function App() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Data Masking</h1>
      </header>
      <main className="app-main">
        <div className="left-panel">
          <UserForm onSuccess={handleSuccess} />
        </div>
        <div className="right-panel">
          <UserTable refreshKey={refreshKey} />
        </div>
      </main>
    </div>
  );
}

export default App;
