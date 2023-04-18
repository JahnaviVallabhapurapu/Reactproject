import { Button, Divider, Toolbar } from "@mui/material";
import Icon from "../images/icons8-icons8-16.png";
import '../css/Header.css';
import './SignIn'
const Header = () => {
    return (

        <div className="header-style">
            <Toolbar className="toolbar-edit">
                <div>
                    <img className="logo" src={Icon}></img>
                </div>
                <div className="aboutcontact" >
                    <a href="About us "  >
                        About us
                    </a>
                    /
                    <a href="contact us">Contact us </a>

                </div>
                <div>
                    <Button variant="contained" href="/SignIn">SignIn</Button>
                </div>
            </Toolbar>

        </div>
    )
}
export default Header;