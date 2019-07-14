import { render } from 'https://unpkg.com/lit-html@1.1.1/lit-html.js'

export const display = (stateRepresentation) => {
    Object.keys(stateRepresentation).forEach(function (el) {
        stateRepresentation[el] && render(stateRepresentation[el], document.getElementById(el))
    });
}

