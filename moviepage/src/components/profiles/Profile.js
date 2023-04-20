import Personaldetails from "./Personaldetails";
import Profactionaldetails from "./Profactionaldetails";
import { useMemo, useState } from "react";
import Usercontext from "../context/usercontext";
function Profile() {
    const [name, setName] = useState("Jahnavi")
    const [age, setAge] = useState(189)
    const value = useMemo(
        () =>({name,age}),[name]
    )
    return (<>
        <Usercontext.Provider value={{ value,setName}}>
            <h2>you are viewing profile of {name}</h2>
            <Personaldetails></Personaldetails>
            <h1>Profactionaldetails</h1>
            <Profactionaldetails></Profactionaldetails>
        </Usercontext.Provider>
    </>)
}
export default Profile;