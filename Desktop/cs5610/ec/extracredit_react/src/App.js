import React from 'react';
import './App.css';

function App() {
  return (
    <div className="container">
      <header>
        <h1>Chi Gong's Website</h1>
      </header>
      <aside>
        <p>This is leftbar</p>
      </aside>
      <main>
        This is main content and box content
        <div className="box">Hover</div>
      </main>
      <aside>
        <p>This is rightbar</p>
      </aside>
      <footer>
        This is footer content
      </footer>
    </div>
  );
}

export default App;
