import logo from './logo.svg';
import './App.css';
import CardTile from './components/card';
import Header from './components/Header';
import Landingpage from './components/Landingpage';
import Viewmore from './components/viewmore';
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {
  return (
    <BrowserRouter>
      <div>
        <Header></Header>
        <Routes>
          <Route Path='/' element={<Landingpage></Landingpage>}></Route>
          <Route index element={<Landingpage></Landingpage>}></Route>
          <Route path='/CardTile' element={<Landingpage></Landingpage>}></Route>
          <Route path='/Viewmore' element={<Viewmore></Viewmore>}></Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;
