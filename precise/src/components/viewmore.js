import { React, useState, useEffect, useHistory } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Viewmore = (props) => {
    const [card, setCard] = useState('');
    const [thumbnail, setThumbnail] = useState('')
    const { id } = useParams()

    axios.get("https://app.findmementor.com/fmmnimda/webservices/category-wise-news.php?id=" + id + "&page=1&pp=10").then((response) => {
        console.log('data', response.data.response.data.news)
        setCard(response.data.response.data.news)
    });
    return (
        <div>
            {card && (
                <>
                    {/* <img src={`https://app.findmementor.com/fmmnimda/uploads/thumbnail/${props.card.thumbnail}`} />
                    <h2>Description:{props.long_desc}</h2> */}
                </>

            )}
        </div>
    )

}
export default Viewmore;