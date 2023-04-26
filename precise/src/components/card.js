import { React, useState, useEffect, useHistory } from "react";
import { Card, CardHeader, CardContent, CardMedia, Typography, CardActionArea, CardActions } from "@mui/material";
import axios from "axios";
import './viewmore';
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom"
import Link from '@mui/material/Link';
import { Cookie, useCookies } from "react-cookie";

const CardTile = (props) => {
    const [content, setcontent] = useState([]);
    const [thumbnail, setThumbnail] = useState('')
    const [cookie, setCookie] = useCookies()
    useEffect(() => {
        axios.get("https://app.findmementor.com/fmmnimda/webservices/news.php?page=1&pp=10").then((response) => {
            console.log('data', response.data.response.data.news)
            if (response.status == 200) {
                setcontent(response.data.response.data.news);
                setThumbnail(response.data.response.data.news[0].thumbnail)
            }

        });
    }, []);
    const navigation = useNavigate();

    const handleDetailsClick = () => {
        navigation("/viewmore");
    }

    // console.log('content', content[0].thumbnail)
    if (thumbnail == '') {
        return (<>
            Loading

        </>)
    } else {

        return (
            <>

                <Card sx={{ width: 345 }} >
                    <CardMedia
                        sx={{ height: 140, maxHeight: 140 }}
                        image={`https://app.findmementor.com/fmmnimda/uploads/thumbnail/${props.card.thumbnail}`}

                    />
                    <CardContent >
                        <Typography variant="h5" component="div">
                            Description:{props.card.long_desc}
                        </Typography>

                    </CardContent>

                    <CardActions>
                        <Button size="small" onClick={() => handleDetailsClick()} >Learn More</Button>
                    </CardActions>

                </Card>
            </>
        )

    }

}
export default CardTile;