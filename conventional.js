"use strict";

const LABEL_OPTIONS = [
    'praise',
    'nitpick',
    'suggestion',
    'issue',
    'todo',
    'question',
    'thought',
    'chore',
    'note',
    'typo',
    'polish',
    'quibble',
]

const DECORATION_OPTIONS = [
    'non-blocking',
    'blocking',
    'if-minor',
]

const MD_BOLD = '**'

const LABEL_WITH_DECO_REGEX = new RegExp(/^\*?\*?[a-z]+\*?\*? \([a-z,\-\*]+\):/)
const LABEL_NO_DECO_REGEX = new RegExp(/^\*?\*?[a-z]+\*?\*?:/)

const SUGGESTION_HOLDER_STYLE = `
#ConventionCommentsSuggestions {
    width: 140px;
    background-color: whitesmoke;
    display: inline;
    position: absolute;
    top: 35%;
    left: 5%;
    padding: 5px 24px;
    z-index: 10;
    border: solid 1px black;
}

#ConventionCommentsSuggestions ol > li:hover {
  text-decoration: underline;
  cursor: pointer;
}
`

let IS_INIT = false

/**
 * @type EventListener
 * @param {InputEvent} ev 
 */
function handleInput(ev) {
    console.log("Input updated", ev)
    /**
     * @type HTMLTextAreaElement
     */
    const comment_box = ev.target

    // Bail, unless the new character is a '(' or ','
    if (ev.data !== '(' && ev.data !== ',') {
        return
    }

    // Bail if we already have a label:
    if (LABEL_WITH_DECO_REGEX.test(ev.target.value)) {
        return
    }

    // Bail if we've already got a complete label:
    if (LABEL_NO_DECO_REGEX.test(ev.target.value)) {
        return
    }

    const suggestion_holder = document.createElement('div')
    suggestion_holder.id = 'ConventionCommentsSuggestions'
    // Move label suggestions a bit further over:
    suggestion_holder.style.left = '20%';

    const list = document.createElement('ol')
    for (const label_text of DECORATION_OPTIONS) {
        const label = document.createElement('li')
        label.textContent = label_text
        label.addEventListener('click', (ev) => {
            ev.preventDefault()

            comment_box.value = comment_box.value + MD_BOLD + label_text + MD_BOLD + '): '
            suggestion_holder.remove()
            comment_box.focus()
        })

        list.appendChild(label)
    }
    suggestion_holder.appendChild(list)
    comment_box.parentElement.appendChild(suggestion_holder)
}

function handleClick(ev) {
    console.log("I was clicked", ev)

    if (!IS_INIT) {
        const style = document.createElement('style')
        style.innerHTML = SUGGESTION_HOLDER_STYLE

        document.body.appendChild(style)
        IS_INIT = true
    }

    // Try to find the comment box:
    const comment_box = document.querySelector(".CommentBox-input:focus")
    if (!comment_box) {
        return;
    }
    console.log(comment_box)

    if (comment_box.value.length > 0) {
        console.log("Not showing because box isn't empty")
        return
    }

    const suggestion_holder = document.createElement('div')
    suggestion_holder.id = 'ConventionCommentsSuggestions'

    const list = document.createElement('ol')
    for (const label_text of LABEL_OPTIONS) {
        const label = document.createElement('li')
        label.textContent = label_text
        label.addEventListener('click', (ev) => {
            ev.preventDefault()

            comment_box.value = MD_BOLD + label_text + MD_BOLD
            suggestion_holder.remove()
            comment_box.focus()
        })

        list.appendChild(label)
    }
    suggestion_holder.appendChild(list)

    comment_box.parentElement.appendChild(suggestion_holder)

    comment_box.addEventListener('input', handleInput, { passive: true })
}

document.body.addEventListener('click', handleClick, {
    passive: true
})

document.body.addEventListener('keydown', (ev) => {
    if (ev.code === 'Escape') {
        // See if we have a suggestion box, and if we do, trash it:
        const suggestion_holder = document.querySelector("#ConventionCommentsSuggestions")
        if (suggestion_holder) {
            suggestion_holder.remove()
        }
    }
}, { passive: true })