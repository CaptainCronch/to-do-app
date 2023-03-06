let notes = {
    "0000": {
        name: "My List",
        list: [
            {
                item: "Press enter to add new to-do",
                checked: true,
            },
            {
                item: "Press backspace to remove",
                checked : false,
            },
        ],
    },
}

const default_note = {
    item: "",
    checked: false,
}

let note_title = $("#note h1")
let note_body = $("#note ul")
let aside = $("#notes-container")
let current_id = "0000"


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

        $(".to-do").on('keyup', function(key) {
            let active_index = [...document.activeElement.parentElement.parentElement.children].indexOf(document.activeElement.parentElement)
            save()

            if (key.code == "Escape" && this.selectionStart == 0 && notes[current_id].list.length > 1) {
                notes[current_id].list.splice(active_index, 1)
                setTimeout(render, 0, active_index - 1)
            }

            else if (key.code == "Enter") {
                notes[current_id].list.splice(active_index + 1, 0, {item: "", checked: false})
                setTimeout(render, 0, active_index + 1)
            }

            else if (key.code == "ArrowUp" && active_index > 0) {
                active_index --
                $(".to-do").eq(active_index).focus()
            }

            else if (key.code == "ArrowDown" && active_index < notes[current_id].list.length - 1) {
                active_index ++
                $(".to-do").eq(active_index).focus()
            }
        })
    })

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

$("h1").on("keypress", (key) => {
    if (key.code = "Enter") {key.preventDefault()}
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
    notes[current_id].list.forEach((element, index) => {
        if (element.checked) {
            notes[current_id].list.splice(index, 1) // modifying array while iterating it is causing the deletion of every other element!!!!
            can_render = true
        }
    })
    console.log(notes[current_id].list.length)
    if (notes[current_id].list.length == 0) {
        notes[current_id].list.push(default_note)
    }
    if (can_render) {setTimeout(render, 0)}
})

setTimeout(render, 0)