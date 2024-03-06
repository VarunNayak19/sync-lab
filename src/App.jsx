import React from 'react';
import './App.css';
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './pages/Home/Home';
import EditorPage from './pages/EditorPage/EditorPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
      <>
        <Toaster></Toaster>
      </>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editor/:roomId" element={<EditorPage />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
