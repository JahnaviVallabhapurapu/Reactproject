import { useContext } from "react";
import Usercontext from "../context/usercontext";

function Name(){
    const {name}=useContext(Usercontext)
    return(<>
        {name}
    </>)
}
export default Name;