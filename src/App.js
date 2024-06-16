import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Search from './components/Search';
import DrugDetails from './components/DrugDetails';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Search />} /> {/* /drugs/search as landing page */}
          <Route path="/drugs/search" element={<Search />} />
          <Route path="/drugs/:rxcui" element={<DrugDetails />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
