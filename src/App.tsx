import './App.css';
import Build from './pages/Build';
import Manage from './pages/Manage';

import { Route, Routes } from 'react-router-dom';

function App() {
  return (
    <Routes>
      <Route path='/' element={<Manage />}></Route>
      <Route path='/build/:itineraryID' element={<Build />}></Route>
    </Routes>
  );
}

export default App;
