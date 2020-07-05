import React from 'react';
import Navbar from './components/NavBar';
import ChartPage from './components/ChartPage';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  return (
    <div>
      <Navbar />
      <ChartPage />
    </div>
  )
}

export default App;