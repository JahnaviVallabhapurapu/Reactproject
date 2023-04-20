import { useContext } from "react";
import Usercontext from "../context/usercontext";
import { Description } from "@mui/icons-material";

function Personaldetails(){
    const {name,age}=useContext(Usercontext)
    return(<>
        <name></name>
        <Description></Description>
    </>)
}
export default Personaldetails;