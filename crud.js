const fs = require('fs');
const path = require('path');

let btnCreate = document.getElementById('btnCreate');
let noteTitle = document.getElementById('noteTitle');
let noteContent = document.getElementById('noteContent');
let notesList = document.getElementById('notesList');

// Ensure Files directory exists
let pathName = path.join(__dirname, 'Files');
if (!fs.existsSync(pathName)) {
    fs.mkdirSync(pathName);
}

// Create note
document.getElementById('noteForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission
    createNote();
});

// Create Note Function
function createNote() {
    let title = noteTitle.value.trim();
    let content = noteContent.value.trim();
    let filePath = path.join(pathName, `${title}.txt`);

    if (title && content) {
        fs.writeFile(filePath, content, (err) => {
            if (err) {
                console.error(err);
                return;
            }
            displayNotes();
            noteTitle.value = '';
            noteContent.value = '';
            console.log(`${title} note was created.`);
        });
    } else {
        alert("Both title and content are required.");
    }
}

// Display notes
function displayNotes() {
    notesList.innerHTML = '';
    fs.readdir(pathName, (err, files) => {
        if (err) {
            console.error(err);
            return;
        }
        files.forEach((file) => {
            let noteDiv = document.createElement('div');
            noteDiv.classList.add('note');

            let noteTitleElement = document.createElement('h3');
            noteTitleElement.textContent = file.replace('.txt', '');
            noteDiv.appendChild(noteTitleElement);

            let noteContentElement = document.createElement('p');
            let filePath = path.join(pathName, file);
            fs.readFile(filePath, 'utf8', (err, data) => {
                if (err) {
                    console.error(err);
                    return;
                }
                noteContentElement.textContent = data;
            });
            noteDiv.appendChild(noteContentElement);

            // Create Update Button
            let btnUpdate = document.createElement('button');
            btnUpdate.textContent = 'Update';
            btnUpdate.classList.add('btn');
            btnUpdate.addEventListener('click', () => {
                // Populate the input fields with the current note's title and content
                noteTitle.value = file.replace('.txt', '');
                noteContent.value = noteContentElement.textContent;
                // Remove the note after updating
                deleteNoteContent(file);
            });
            noteDiv.appendChild(btnUpdate);

            // Create Delete Button
            let btnDelete = document.createElement('button');
            btnDelete.textContent = 'Delete';
            btnDelete.classList.add('btn');
            btnDelete.addEventListener('click', () => deleteNoteContent(file));
            noteDiv.appendChild(btnDelete);

            notesList.appendChild(noteDiv);
        });
    });
}

// Delete note
function deleteNoteContent(file) {
    let filePath = path.join(pathName, file);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        displayNotes();
        console.log(`${file} was deleted.`);
    });
}

// Initial load
displayNotes();