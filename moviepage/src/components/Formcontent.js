
import React, { useState } from "react";

function Fromcontent() {
    const [inputValue, setInputValue] = useState({
        name: 'PKd'
    })
    const inputHandler = (e) => {
        setInputValue({ [e.target.name]: e.target.value })
        console.log(inputValue.name)
    }
    const submitval = () => {
        alert(inputValue.name)
    }
    return (
            <form>
                <label>
                    Name:
                    <input type="text"
                        name="name"
                        placeholder="your name"
                        value={inputValue.name}
                        onChange={inputHandler}>
                        </input>
                </label>
                <input type="submit" value="submit" onClick={submitval}></input>
            </form>
        
    )
}
export default Fromcontent;