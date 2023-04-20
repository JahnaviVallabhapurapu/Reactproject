import logo from './logo.svg';
import './App.css';
import { Button, Card, CardContent } from '@mui/material';
import Header from './components/Header';
import Footer from './components/Footer';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landingpage from './components/Landingpage';
import Aboutus from './components/Aboutus';
import Calculator from './components/Calucalteor';
import Formcontent from './components/Formcontent';
import Textswitch from './components/textswitch';
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Profile from './components/profiles/Profile';
function App() {

  return (
    <div className="App">
      {/* <Header></Header> */}
      <BrowserRouter>
        <Routes>
          <Route Path='/' element={<Landingpage></Landingpage>}></Route>
          <Route index element={<Landingpage></Landingpage>}></Route>
          <Route path='Loginpage' element={<SignIn></SignIn>}></Route>
          <Route path='SignUp' element={<SignUp></SignUp>}></Route>
          <Route path='SignIn' element={<SignIn></SignIn>}></Route>
          <Route path='Profile' element={<Profile></Profile>}></Route>
          {/* <Route Path='Aboutus' element={<Aboutus></Aboutus>}></Route>
          <Route path='calculator' element={<Calculator></Calculator>}></Route>
          <Route path='Formcontent' element={<Formcontent></Formcontent>}></Route>
          <Route path='Textswitch' element={<Textswitch></Textswitch>}></Route> */}
        </Routes>
      </BrowserRouter>
      {/* <Footer></Footer> */}

    </div>
  );
}

export default App;
