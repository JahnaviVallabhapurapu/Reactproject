import React from 'react'
import '../css/Main.css';
import CardTile from './Card';
import coco from '../images/5386cf7f-bf8f-4882-b7af-c292c6ec6ceb.jpg';
import encoanto from '../images/p_encanto_homeent_22359_4892ae1c.jpeg';
import luca from '../images/p_luca_21670_3c13c611.webp';
import turningred from '../images/p_turningred_22797_1_c17f32af.jpeg';
import { CardContent } from '@mui/material';
import Grid from "@mui/material/Grid";
const
    Main = (props) => {

        return (
            <Grid container className="container">
           
                <CardTile  image={props.image} title={props.title} language={props.language} field={props.field} />
            </Grid>
        )
    }

export default Main;
