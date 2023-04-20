import { useContext } from "react";
import Usercontext from "../context/usercontext";

function Workdetails() {
    const { name, age, setName } = useContext(Usercontext)
    const ChangeName = () => {
        if (name == "jahnavi" ) {
            setName("lavanya")
        } else {
            setName("jahnavi")
        }

    }
    return (
        <>
            {name} is hard working employe
            <button onClick={ChangeName}>Change Name</button>
        </>
    )
}
export default Workdetails;