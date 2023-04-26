import { useEffect, useState, useRef } from "react";

function Refcount() {
    const [count, setCount] = useState(0)
    const renderCount = useRef(0)
    const increment = () => {
        setCount(count + 1)
    }
    const decrement = () => {
        setCount(count - 1)
    }
    useEffect(() => {
        renderCount.current = renderCount.current + 1
    })

    return (
        <>
            Value of count is:{count}
            <button onClick={increment}>+</button>
            <button onClick={decrement}>-</button>
            {renderCount.current}
        </>
    )
}
export default Refcount;