import { useState } from "react";
import { increment, decrement, initCount, incrementByAmount, incrementAsync } from "./Counterslice";
import { useSelector, useDispatch } from "react-redux";

function Counter() {
    const count = useSelector(initCount)
    const dispatch = useDispatch()
    const [incrementAmount, setincrementAmount] = useState()

    return (
        <>
            <button onClick={() => dispatch(increment())}>+</button>

            <button onClick={() => dispatch(decrement())}>-</button>
            <br></br>
            {count}
            <input value={incrementAmount} onChange={e => setincrementAmount(e.target.value)} />
            <button onClick={() => dispatch(incrementByAmount(Number(incrementAmount) || 0))}> Add Amount</button>
            <button onClick={() => dispatch(incrementAsync(Number(incrementAmount) || 0))}> Add Async</button>
        </>
    )
}
export default Counter;