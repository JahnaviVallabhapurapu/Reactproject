import React, { useEffect, useState} from "react"; 
import { Card, CardHeader } from '@mui/material';
import { styled } from '@mui/material/styles';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import '../css/Card.css';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import axios from "axios";
import './Moviedeatils';
import {useNavigate} from "react-router-dom"

const ExpandMore = styled((props) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})
const CardTile = () => {
    const [content, setcontent] = useState([]);
    const [imgUrl, setImgUrl] = useState('')
    useEffect(() => {
        axios.get("http://localhost:1337/api/movies?populate=*")
            .then(data => {
                console.log(data)
                setcontent(data)
                //setImgUrl(data.data.attributes.image.data.attributes.formats.thumbnail.url)
            });
    }, []);
    const navigation = useNavigate();

    const handleDetailsClick = (id) => {
        navigation(`/Moviedetails/${id}`);
    }

    //console.log(imgUrl)
    return (
        <>

            {content.status == 200 && content.data.data.map((obj, index) => (
                <Card sx={{ width: 345 }} key={index}>
                    <CardHeader action={<><IconButton><DeleteIcon></DeleteIcon></IconButton>
                        <IconButton><ModeEditIcon></ModeEditIcon></IconButton></>}></CardHeader>
                    <CardMedia
                        sx={{ height: 140, maxHeight: 140 }}
                        image={`http://localhost:1337${obj.attributes.image.data.attributes.url}`}

                    />
                    <CardContent >
                        <Typography variant="h5" component="div">

                            <Button variant="contained" onClick={()=>handleDetailsClick(obj.id)}>
                                title:{obj.attributes.title}
                            </Button>

                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            genre:{obj.attributes.genre}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            release_date:{obj.attributes.release_date}
                        </Typography>
                    </CardContent>

                </Card>
            ))}

        </>
        // }
        // else {
        //     {

        //         return (

        //             <Card sx={{ maxWidth: 345 }}>
        //                 <CardHeader action={<IconButton aria-label={DeleteIcon}><MoreVertIcon /></IconButton>}></CardHeader>
        //                 <CardMedia
        //                     sx={{ height: 140 }}
        //                     image={props.image}

        //                 />
        //                 <CardContent >
        //                     <Typography variant="h5" component="div">

        //                         <Button onClick={() => {
        //                             alert('Hello');
        //                         }
        //                         }
        //                         >
        //                             {props.title}
        //                         </Button>


        //                     </Typography>
        //                     <Typography variant="body2" color="text.secondary">
        //                         {props.field}
        //                     </Typography>
        //                     <Typography variant="body2" color="text.secondary">
        //                         {props.language}
        //                     </Typography>
        //                 </CardContent>


        //             </Card>
        //         )
        //     }
        // }
    )
}

// import { useEffect, useState } from "react";
// import { Cookie, useCookies } from "react-cookie";
// import axios, { Axios } from "axios";
// import Main from "./Main";

// import { cardActionAreaClasses } from "@mui/material";
// function CardTile() {
//     const [data, setData] = useState('')
//     const [newData, setNewData] = useState(0)
//     const [cookie, setCookie] = useCookies()
//     useEffect(() => {
//         setTimeout(() => {
//             axios.get('https://randomuser.me/api/').then(res => {
//                 setData(res.data.results['0'])
//                 console.log('Inside useeffect', res.data.results['0'])
//                 setCookie('name', res.data.results['0'].name.first)
//                 setCookie('id', 1)
//             })
//         }, 1000)
//     }, [newData])
//     const changeUser = () => {
//         if (newData == 0) {
//             setNewData(1)
//         }
//         else {
//             setNewData(0)
//         }
//     }
//     if (data == '') {
//         return (
//             <>
//                 loading ..
//             </>
//         )
//     } else {
//         return (
//             <>
//                 Name: {data.name.title}<br></br>
//                 <button onClick={changeUser}>get user</button>
//             </>
//         )
//     }

// }
export default CardTile;