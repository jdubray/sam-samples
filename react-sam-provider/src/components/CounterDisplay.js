import React, { useContext } from "react";
import { SAMContext, useInitializedContext } from "../lib/SAMProvider";


function CounterDisplay() {
    const { isLoading, intents, state } = useInitializedContext(useContext(SAMContext));

    if (isLoading) {
        return <div>Loading...</div>;
    }

    const [incrementByOne, incrementByTwo] = intents

    return (
        <div>
            <div className="card-header py-3 d-flex justify-content-between bg-transparent border-bottom-0">
                <h6 className="mb-0 fw-bold ">Count: {state.counter}</h6>
            </div>
            <div className="card-body">
                <button onClick={() => incrementByOne()}>Increment by 1</button>
                <button onClick={() => incrementByTwo()}>Increment by 2</button>
            </div>
        </div>
    )
}

export default CounterDisplay;
