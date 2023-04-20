import React from "react";
import './Card'
import  CardTile from './Card';
function moviedetails(props){

    return(
        <div>
            <CardTile image={props.image}></CardTile>
        </div>
    )
}
export default moviedetails;