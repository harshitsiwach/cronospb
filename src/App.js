import './App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from './component/Header';
import HomePage from './component/HomePage';

function App() {
  return (
    <div className="App">
      <BrowserRouter>      
          <Header/>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
