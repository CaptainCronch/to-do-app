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
  

function render() {
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
        $(".to-do").on('keypress', (key) => {
            if (key.keyCode == 13) {
                save()
                notes[current_id].list.push({item: "", checked: false})
                setTimeout(render, 0)
            }
        });
        $(".to-do").on('keydown', function(key) {
            if (key.keyCode == 8 && this.selectionStart == 0) {
                save()
                notes[current_id].list.splice($(note_body).index($(window.activeElement).parent()), 1)
                setTimeout(render, 0)
                console.log($(note_body).index($(window.activeElement).parent()))
            }
        })
    })

    $(".to-do").eq($(".to-do").length - 1).focus()
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
    $(document.activeElement).text($(this).text().replace(/[\r\n\v]+/g, ''));
    if (key.keyCode == 13) {
        notes[current_id].list.push({item: "", checked: false})
        setTimeout(render, 0)
    }
})




render()