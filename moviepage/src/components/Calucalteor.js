import { useState } from "react";
import '../css/Calculateor.css';
function Calculator() {
    const [value, setval] = useState(7)
    const [num, setnum] = useState(9)
    const [theme, setTheme] = useState("dark")
    const increment1 = () => {
        setval(value + 1)
    }
    const decrment1 = () => {
        setval(value - 1)
    }
    const increment2 = () => {
        setnum(num + 1)
    }
    const decrment2 = () => {
        setnum(num - 1)
    }
    return (
        <div className={theme}>
            <button onClick={() => {
                if (theme === 'dark') {
                    setTheme('light')
                }
                else { setTheme('dark') }
            }
            }>change theme</button>
            <h2> value 1:</h2>
            <button onClick={increment1}>+</button>
            <button onClick={decrment1}>-</button>
            <h1>{value}</h1>

            <button onClick={increment2}>+</button>
            <button onClick={decrment2}>-</button>
            <h1>{num}</h1>

            <br></br>
            <h1>Sum:{value + num}</h1>
        </div>
    )
}
export default Calculator;