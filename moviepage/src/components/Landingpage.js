import logo from '../logo.svg';
// import '../App.css';
import '../css/Landingpage.css';
import { Button, Card, CardContent, Container, Grid } from '@mui/material';
import Header from './Header';
import Footer from './Footer';
import Main from './Main';
import CardTile from './Card';
import content from './Card';
// import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
// import CardContent from '@mui/material/CardContent';
import coco from '../images/5386cf7f-bf8f-4882-b7af-c292c6ec6ceb.jpg';
import encoanto from '../images/p_encanto_homeent_22359_4892ae1c.jpeg';
import luca from '../images/p_luca_21670_3c13c611.webp';
import turningred from '../images/p_turningred_22797_1_c17f32af.jpeg';
import { Grade, Padding } from '@mui/icons-material';
import axios, { Axios } from "axios";
import { useEffect, useState } from 'react';

function Landingpage(image, title, genre, release_date) {


  return (
    <div>
      <div style={{ padding: 30 }} className='maincontainer'>
        <CardTile image={image} title={title} genre={genre} release_date={release_date} />
        {/* {content && content.map((card) => (<CardTile title={card.title} gener={card.release_date} language={card.gener} image={card.image}></CardTile>))} */}
        {/* <Main title release_date={release_date} gener={gener} image={image}></Main> */}
        {/* <Main></Main> */}
      </div>
    </div>
  );
}

export default Landingpage;
