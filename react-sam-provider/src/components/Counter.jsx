import React from "react";
import { SAMProvider, useLocalStorage } from "../lib/SAMProvider";
import CounterDisplay from "./CounterDisplay";

function Counter({ counterName }) {

    const initialState = {
        counter: 0
    }

    const components = {
        actions: [
            () => ({ incBy: 1 }),
            ['LABELED_ACTION', () => ({ incBy: 2 })]
        ],
        acceptors: [
            model => proposal => {
                model.counter += proposal.incBy || 1
            }
        ]
    }

    return (
        <div className="card">
            <SAMProvider
                persisted={useLocalStorage(initialState)}
                initialState={initialState}
                components={components}
                instanceName={counterName || 'counter'}>
                <CounterDisplay />
            </SAMProvider>
        </div>
    )
}

export default Counter;
