import { useMemo, useState } from "react";
import { useMatch } from "react-router-dom";

function Memocalculator(){
    const [number,setNnumber]=useState(0)
    const [theme,setTheme] = useState(false)
    // const doubleNumber = superSlowFunction(number)
    const doubleNumber = useMemo(()=>{
        return superSlowFunction(number)
    },[number])
    const somestyling = {
        backgroundColor: theme ? 'red' :'yellow'
    }
    return(
        <>
        <input type="number" value={number} onChange={e =>setNnumber(parseInt(e.target.value))}>
        </input>
        <div style={somestyling}>Double Number is:{doubleNumber}
        </div>
        <button onClick={() => setTheme(!theme)}>Change Them</button>
        </>
    )
}
function superSlowFunction(num){
    console.log('we are inside superSlowFunction')
    for(let i=0;i<900000000;i++){
        return num*2;
    }
}
export default Memocalculator;
