let notes = []
let note_title = $("#note h1")
let note_body = $("#note ul")
let aside = $("#notes-container")
let current_note_index = 0

// notes.push({
//     title: `New note ${current_note_index}`,
//     note: "Start typing...",
// })
// updateNote(notes[0])
// addAside(0)

$("#new-note").on("click", function() {
    current_note_index = Math.max(notes.length - 1, 0)
    notes.push({
        title: `New note ${current_note_index}`,
        note: "Start typing...",
    })
    updateNote()
    addAside()
    $(this).text(notes.length)
})

function updateNote() {
    $(note_body).children().each( function() {
        $(this).remove()
    })
    $(note_title).text(notes[current_note_index].title)

    let list = notes[current_note_index].note.split(/\n/)
    let i = 0
    list.forEach((element) => {
        $(note_body).append(`<li contenteditable>${element}</li>`)
    })
}

function addAside() {
    $(aside).append(`
    <div class="side-note mb-1">
        <button id="note-${current_note_index}" type="button" class="btn btn-link text-decoration-none text-light text-nowrap">Note ${current_note_index}</button>
    </div>
    `)
    
    $(`#note-${current_note_index}`).on("click", () => {
        current_note_index = parseInt($(this).attr("id").replace(/note-/, ""))
        updateNote()
    })
}

$("#delete").on("click", () => {
    if (notes.length <= 0) {return}
    notes.splice(current_note_index, 1)
    $(note_body).children().each( function() {
        $(this).remove()
    })
    $(note_title).text("")
    $(`#note-${current_note_index}`).parent().remove()
    if (current_note_index != 0) {current_note_index -= 1}
    updateNote()
})
