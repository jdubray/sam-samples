
/**
 * Renders state representation into DOM elements via innerHTML.
 * SECURITY: All user-supplied content (todo titles, etc.) must be HTML-escaped
 * by the template/representation layer before being passed to this function.
 */
export const display = (stateRepresentation) => {
    Object.keys(stateRepresentation).forEach(function (el) {
        document.getElementById(el).innerHTML = stateRepresentation[el]
    });

    // clean up edited field
    // document.getElementById('new-todo').value = ''
}

