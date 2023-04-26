import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HeaderBar from './components/Headerbar';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <HeaderBar />
        <Routes>
          <Route></Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
