import { useContext } from "react";
import Usercontext from "../context/usercontext";

function Description() {
    const { name, age } = useContext(Usercontext)
    return (<>
        get {name}detain in description
    </>)
}
export default Description;