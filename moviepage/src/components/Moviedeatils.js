import React, { useEffect, useState } from "react";
import './Card'
import axios from "axios";
import '../css/Moviedetails.css';
import { Height, Image } from "@mui/icons-material";
import { CardContent, CardMedia, Container } from "@mui/material";
import { useParams } from "react-router-dom";

const Moviedetails = () => {
    const [content, setcontent] = useState(null);
    const { id } = useParams()
    useEffect(() => {
        axios.get("http://localhost:1337/api/movies/" + id + "?populate=*")
            .then(data => {
                console.log(data)
                setcontent(data.data.data.attributes)
                // debugger;
                console.log(content.data.attributes.image.data.attributes.formats.thumbnail.url)

            });
    }, []);

    return (
        <div className="moviedetails">
            {content != null && (
                <>
                    <img src={`http://localhost:1337${content.image.data.attributes.formats.thumbnail.url}`} />

                    <h2>Title:{content.title}</h2>
                    <h2>Gener:{content.genre}</h2>
                    <h2>Description:{content.description}</h2>
                </>)
            }
        </div>
    )
}
export default Moviedetails;