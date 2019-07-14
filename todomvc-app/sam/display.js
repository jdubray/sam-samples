
export const display = (stateRepresentation) => {
    Object.keys(stateRepresentation).forEach(function (el) {
        document.getElementById(el).innerHTML = stateRepresentation[el]
    });

    // clean up edited field
    // document.getElementById('new-todo').value = ''
}

