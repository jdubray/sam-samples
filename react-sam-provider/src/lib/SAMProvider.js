import React, { createContext, useState, useEffect } from 'react';
import { createInstance, api } from 'sam-pattern';

export const SAMContext = createContext(null);

export const useInitializedContext = (context) => {
    const { intents, state } = context;
    const isLoading = !intents || !state;
    return { isLoading, intents, state };
}

export const useLocalStorage = (initialState) => ({
    setState: (state, instanceName) => {
        localStorage.setItem(`__SAMState_${instanceName}`, JSON.stringify(state));
    },
    getState: (instanceName) => {
        const state = localStorage.getItem(`__SAMState_${instanceName}`);
        return state ? JSON.parse(state) : initialState;
    }
});

let SAMInstances = {};

export const SAMProvider = ({ persisted, initialState, components, children, instanceName = '__main' }) => {
    const savedState = persisted ? persisted.getState(instanceName) : initialState;
    const [state, setState] = useState(savedState);
    const [intents, setIntents] = useState(null);

    useEffect(() => {
        const instance = createInstance({ instanceName, clone: true });
        const { addInitialState, addComponent, setRender } = api(instance);

        addInitialState(savedState);
        const newInstance = addComponent(components);

        setRender(setState);

        setIntents(newInstance.intents);
        SAMInstances[instanceName] = { state, intents: newInstance.intents };


        return () => {
            persisted && persisted.setState(SAMInstances[instanceName].state, instanceName);
            delete SAMInstances[instanceName];
        };
    }, []);

    useEffect(() => {
        if (SAMInstances[instanceName]) {
            SAMInstances[instanceName].state = state;
        }
    }, [state]);


    return (
        <SAMContext.Provider value={{ intents, state }}>
            {children}
        </SAMContext.Provider>
    );
};
