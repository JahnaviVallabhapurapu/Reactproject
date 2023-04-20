import logo from '../logo.svg';
// import '../App.css';
import '../css/Landingpage.css';
import { Button, Card, CardContent, Container, Grid } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import CardTile from './Card';
// import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
import coco from '../images/5386cf7f-bf8f-4882-b7af-c292c6ec6ceb.jpg';
import encoanto from '../images/p_encanto_homeent_22359_4892ae1c.jpeg';
import luca from '../images/p_luca_21670_3c13c611.webp';
import turningred from '../images/p_turningred_22797_1_c17f32af.jpeg';
import { Grade, Padding } from '@mui/icons-material';


function Landingpage() {
  const data = [
    {
      title: "coco",
      field: "disney",
      language: "german",
      image: coco
    },
    {
      title: "encanto",
      field: "disney",
      language: "german",
      image: encoanto
    },
    {
      title: "luca",
      field: "disney",
      language: "german",
      image: luca
    },
    {
      title: "Truningred",
      field: "Pixer",
      language: "english",
      image: turningred
    },
    {
      title: "coco",
      field: "disney",
      language: "german",
      image: coco
    },
    {
      title: "encanto",
      field: "disney",
      language: "german",
      image: encoanto
    },
    {
      title: "luca",
      field: "disney",
      language: "german",
      image: luca
    },
    {
      title: "Truningred",
      field: "Pixer",
      language: "english",
      image: turningred
    },
    {
      title: "coco",
      field: "disney",
      language: "german",
      image: coco
    },
    {
      title: "encanto",
      field: "disney",
      language: "german",
      image: encoanto
    },
    {
      title: "luca",
      field: "disney",
      language: "german",
      image: luca
    },
    {
      title: "Truningred",
      field: "Pixer",
      language: "english",
      image: turningred
    },
    {
      title: "coco",
      field: "disney",
      language: "german",
      image: coco
    },
    {
      title: "encanto",
      field: "disney",
      language: "german",
      image: encoanto
    },
    {
      title: "luca",
      field: "disney",
      language: "german",
      image: luca
    },
    {
      title: "Truningred",
      field: "Pixer",
      language: "english",
      image: turningred
    },
  ]
  return (
    <div className="App">
      <Header>

      </Header>
      <div style={{padding:30}} className='maincontainer'>
        
        {data.map(card => (<CardTile title={card.title} field={card.field} language={card.language} image={card.image}></CardTile>))}
      </div>
      <Footer>

      </Footer>

    </div>
  );
}

export default Landingpage;
