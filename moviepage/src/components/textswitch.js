import { useState } from "react";

function Textswitch () {
    const [text1, inputtext1] = useState({ text: "this is from text1" })
    const [text2, inputtext2] = useState({ text1: "this is from text2" })
    const inputHandler = (e) => {
        inputtext1({ [e.target.name]: e.target.value })
        console.log(text1.name)
    }
    const onbutton1 = () => {
        alert(inputtext1.name)
    }
    return (
        <>
            <button >Text1</button>
            <button >text2</button>
            <div>
                <input type="text"
                    name="text"
                    value={text1.value}
                    onChange={inputHandler}>
                </input>
            </div>
            <input type="test1" value="text1" onClick={onbutton1}></input>
            {/* take 2 buttons and testbox if u click onbutton1 itshoud print button1text */}
        </>
    )
}
export default Textswitch;