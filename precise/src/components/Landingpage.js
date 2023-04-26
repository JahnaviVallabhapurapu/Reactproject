import { React, useState, useEffect } from "react";
import axios from "axios";
import { Button } from "@mui/material";
import CardTile from './card'
import category from "./category";
import '../css/Landing page.css';

const Landingpage = () => {
    const [content, setcontent] = useState([]);
    const [cards, setCards] = useState([])
    const [id, setid] = useState()
    useEffect(() => {
        axios.get("https://app.findmementor.com/fmmnimda/webservices/category.php").then((response) => {
            console.log('data', response.data.response.data.category)
            setcontent(response.data.response.data.category);
            handleCategory(response.data.response.data.category[0].id);
        });

    }, []);

    const handleCategory = (id) => {
        console.log(id);

        axios.get("https://app.findmementor.com/fmmnimda/webservices/category-wise-news.php?id=" + id + "&page=1&pp=10").then((response) => {
            console.log('data', response.data.response.data.news)
            setCards(response.data.response.data.news)
            // setcontent(response.data.response.data.news);
            // setThumbnail(response.data.response.data.news[0].thumbnail)
        });
    }

    return (
        <>
            {content.map((obj, index) => (
                <Button key={index} onClick={(e) => handleCategory(obj.id)}  >{obj.category_name}</Button>

            ))}
            <div className="maincontainer">
                {cards && cards.map((card, index) => (
                    <CardTile card={card} />
                ))}
            </div>


        </>
    )
}
export default Landingpage;