const wheel = document.getElementById("wheel");
const notes = ["C", "D", "E", "F", "G", "A", "B"];
notes.forEach(function(noteName, index) {
    const note = document.createElement("div");
    const label = document.createElement("div"); // Creates a label for the note so that it can be rotated independently of the note container
    label.className = "label";
    label.textContent = noteName;
    note.appendChild(label);
    
    note.className = "note";
   
    note.addEventListener("click", function() {
    const allNotes = document.querySelectorAll(".note");
    allNotes.forEach(function(note) {
        note.classList.remove("active");
    });

    note.classList.add("active");
    const rotation = -angle - 90;
    wheel.style.transform = `rotate(${rotation}deg)`;
    const labels = document.querySelectorAll(".label");
    labels.forEach(function(label) {
        label.style.transform = `rotate(${-rotation}deg)`;
    });

});

    wheel.appendChild(note);
    const radius = 240;
    const centerX = 300;
    const centerY = 300;
    const angle = ((360 / notes.length) * index) - 90; // Starts C at the top (-90deg offset cause notes were snapping to 3 o'clock position)
    const radians = angle * (Math.PI / 180); // Converts angle to radians
    const x = centerX + radius * Math.cos(radians); // Calculates x position of notes
    const y = centerY + radius * Math.sin(radians); // Calculates y position of notes
    const noteSize = note.offsetWidth;
    note.style.left = (x - noteSize / 2) + "px";
    note.style.top = (y - noteSize / 2) + "px";
});

    const firstNote = document.querySelector(".note"); // Makes it so that the note top is Green on refresh, and the wheel is in the default position with C at the top
    firstNote.classList.add("active");