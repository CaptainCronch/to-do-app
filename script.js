let notes = {
    0: {
        name: "My List",
        list: [
            {
                item: "Click here to start typing...",
                checked: true,
            },
            {
                item: "second item",
                checked : false,
            }
        ],
    },
}

let note_title = $("#note h1")
let note_body = $("#note ul")
let aside = $("#notes-container")
let current_note_index = 0


function render() {
    console.log("hello")
    $(aside).children().each(function() {
        $(this).remove()
    })

    Object.values(notes).forEach((element) => {
        $(aside).append(`
    <div class="side-note mb-1">
        <button id="i${element.key}" type="button" class="btn btn-link text-decoration-none text-light text-nowrap">${element.name}</button>
    </div>
    `)
    })

    $(note_title).text(notes[current_note_index].name)

    $(note_body).children().each(function() {
        $(this).remove()
    })

    notes[current_note_index].list.forEach((element) => {
        if (element.checked){
            $(note_body).append(`
            <li>
                <input class="form-check-input" type="checkbox" value="" aria-label="Checkbox for following text input" checked>
                <p contenteditable class="d-inline-block">${element.item}</p>
            </li>
            `)
        }
        else {
            $(note_body).append(`
            <li>
                <input class="form-check-input" type="checkbox" value="" aria-label="Checkbox for following text input">
                <p contenteditable class="d-inline-block">${element.item}</p>
            </li>
            `)
        }
    })
}



render()