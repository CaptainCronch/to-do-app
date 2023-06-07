const empty_note = {
    item: "",
    checked: false,
}

const default_notes = [
    {
        item: "Press enter to add new task",
        checked: true,
    },
    {
        item: "Press backspace to remove task",
        checked : false,
    },
    {
        item: "Right click to remove list",
        checked : false,
    },
]

let current_list = "List 1"
let old_notes = {
    [current_list]: {
        name: "My List",
        list: default_notes
    },
}

let current_id = 0
let notes = [
    {
        name: "My List",
        list: default_notes
    },
]

let note_title = $("#note h1")
let note_body = $("#note ul")
let aside = $("#notes-container")

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
    // Both are inclusive
}

function render(recent_index = notes[current_id].list.length - 1) {
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

    $(aside).children().each(function(index, element) {
        $(element).on("click", ".btn", () => {
            current_id = index
            render()
        })
        $(element).on("contextmenu", ".btn", (event) => {
            event.preventDefault()
            $(element).remove()
            notes.splice(current_id, 1)
            current_id -= 1
            render()
        })
    })

    $(note_title).text(notes[current_id].name)

    $(note_body).children().each(function() {
        $(this).remove()
    })

    notes[current_id].list.forEach((element) => {
        if (element.checked){
            $(note_body).append(`
            <li>
                <input class="mark form-check-input align-middle" type="checkbox" value="" aria-label="Checkbox for following text input" checked>
                <input type="text" class="to-do form-control form-control-sm d-inline-block form-control-plaintext ms-1 ps-1" placeholder="Start typing..." value="${element.item}" aria-label="Text input with checkbox">
            </li>
            `)
        }
        else {
            $(note_body).append(`
            <li>
                <input class="mark form-check-input align-middle" type="checkbox" value="" aria-label="Checkbox for following text input">
                <input type="text" class="to-do form-control form-control-sm d-inline-block form-control-plaintext ms-1 ps-1" placeholder="Start typing..." value="${element.item}" aria-label="Text input with checkbox">
            </li>
            `)
        }
    })

    let active_index = recent_index

    if ($(document.activeElement).hasClass("to-do")) { // check which list element is focused every render
        active_index = [...document.activeElement.parentElement.parentElement.children].indexOf(document.activeElement.parentElement)
    }

    $(".to-do").on('keyup', function(key) {
        console.log(active_index)
        save()

        if (key.code == "Backspace" && this.selectionStart == 0 && notes[current_id].list.length > 1) {
            notes[current_id].list.splice(active_index, 1)
            setTimeout(render, 0, active_index - 1)
        }

        else if (key.code == "Enter") {
            notes[current_id].list.splice(active_index + 1, 0, empty_note)
            setTimeout(render, 0, active_index + 1)
        }
    })

    // $(note_body).on("keyup", function(key) { //so the movement only happens once
    //     save()

    //     if (key.code == "ArrowUp" && active_index > 0) {
    //         active_index -= 1
    //         $(".to-do").eq(active_index).focus()
    //     }

    //     else if (key.code == "ArrowDown" && active_index < notes[current_id].list.length - 1) {
    //         active_index += 1
    //         $(".to-do").eq(active_index).focus()
    //     }

    //     console.log(active_index)
    // })

    $(".to-do").eq(recent_index).focus()
}

function save() {
    notes[current_id].name = $(note_title).text()
    
    notes[current_id].list = []
    $("li").each((index, element) => {
        notes[current_id].list.push({
            item: $(element).children(".to-do").val(),
            checked: $(element).children(".mark").prop('checked'),
        })
    })
}

$(note_title).on("keydown", (key) => {
    if (key.code == "Enter") {key.preventDefault()}
    save()
    //setTimeout(() => {$(this).text($(this).text().replace(/[\r\n\v]+/g, ''))}, 0) remove newlines
})

$("#all").on("click", function() {
    let result = false // if any element isn't checked, make all checked, otherwise make all unchecked
    notes[current_id].list.forEach((element) => {
        if (!element.checked) {
            result = true
        }
    })
    notes[current_id].list.forEach((element) => {
        element.checked = result
    })
    setTimeout(render, 0)
})

$("#delete").on("click", function() {
    let can_render = false
    
    for (let i = notes[current_id].list.length - 1; i >= 0; i--) { // iterate backwards so it doesnt skip elements
        if (notes[current_id].list[i].checked) {
            notes[current_id].list.splice(i, 1) // modifying array while iterating it is causing the deletion of every other element!!!!
            can_render = true
        }
    }

    if (notes[current_id].list.length == 0) {
        notes[current_id].list.push(empty_note)
    }

    if (can_render) {setTimeout(render, 0)}
})

$("#save").on("click", () => {
    window.localStorage.setItem("notes", JSON.stringify(notes))
})

$("#load").on("click", () => {
    notes = JSON.parse(window.localStorage.getItem("notes"))
    render()
})

$("#new-note").on("click", () => {
    notes.push({name: "New List", list: default_notes})
    current_id = notes.length - 1
    render()
})

setTimeout(render, 0)