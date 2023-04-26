import { React, useState, useEffect } from "react";
import { Card, CardHeader, CardContent, CardMedia, Typography } from "@mui/material";
import axios from "axios";

const CardTile = () => {
    const [content, setcontent] = useState([]);
    const [thumbnail, setThumbnail] = useState()
    useEffect(() => {
        axios.get(" https://app.findmementor.com/fmmnimda/webservices/category-wise-news.php?id=&page=&pp=").then((response) => {
            console.log('data', response.data.response.data.news)
            setcontent(response.data.response.data.news);
            setThumbnail(response.data.response.data.news[0].thumbnail)
        });
    }, []);

    // console.log('content', content[0].thumbnail)


    if (thumbnail == '') {
        return (<>
            Loading

        </>)
    } else {

        return (
            <>

                {content.status == 200 && content.map((obj =>
                    <Card sx={{ width: 345 }} >
                        <CardMedia
                            sx={{ height: 140, maxHeight: 140 }}
                            image={`https://app.findmementor.com/fmmnimda/uploads/thumbnail/${obj.thumbnail}`}

                        />
                        <CardContent >
                            <Typography variant="h5" component="div">
                                Descroption:{obj.long_desc}
                            </Typography>

                        </CardContent>

                    </Card>
                ))}
            </>
        )

    }

}
export default CardTile;