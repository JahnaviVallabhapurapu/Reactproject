import { Toolbar } from '@mui/material';
import Icon from "../images/icons8-icons8-16.png";
import React from 'react'
import '../css/Footer.css';

const Footer = () => {
    return (
        <div className='Footer-styles'>

            <Toolbar className='Footertoolbaredit'>
                <div>
                    <img src={Icon}></img>
                </div>
                <div className='Aboutdetails'>

                    <a href="About us "  >
                        About us
                    </a>
                    <span>moviereviwers</span>

                </div>
                <div className='contactdetails'>
                    <a href="Contact us "  >
                        Contact us
                    </a>
                    <span>phone no:1234567890</span>
                </div>


            </Toolbar>
        </div>
    )
}

export default Footer;