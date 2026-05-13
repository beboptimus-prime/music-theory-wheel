// ====================
// DOM REFERENCES
// ====================
const wheel = document.getElementById("wheel");

// ====================
// APP STATE
// ====================
let currentRotation = 0;

// ====================
// CONFIG
// ====================
const radius = 240;
const centerX = 300;
const centerY = 300;

// ====================
// MUSICAL DATA
// ====================
const notes = [
    {
        note: "C",
        romanNumeral: "I",
        mode: "IONIAN",
        triadChordSymbol: "",
        seventhChordSymbol: "MAJ7"
    },

    {
        note: "D",
        romanNumeral: "ii",
        mode: "dorian",
        triadChordSymbol: "m",
        seventhChordSymbol: "m7"
    },

    {
        note: "E",
        romanNumeral: "iii",
        mode: "phrygian",
        triadChordSymbol: "m",
        seventhChordSymbol: "m7"
    },

    {
        note: "F",
        romanNumeral: "IV",
        mode: "LYDIAN",
        triadChordSymbol: "",
        seventhChordSymbol: "MAJ7"
    },

    {
        note: "G",
        romanNumeral: "V",
        mode: "MIXOLYDIAN",
        triadChordSymbol: "",
        seventhChordSymbol: "7"
    },

    {
        note: "A",
        romanNumeral: "vi",
        mode: "aeolian",
        triadChordSymbol: "m",
        seventhChordSymbol: "m7"
    },

    {
        note: "B",
        romanNumeral: "vii°",
        mode: "locrian",
        triadChordSymbol: "°",
        seventhChordSymbol: "ø7"
    }

];

// ====================
// HELPER FUNCTIONS
// ====================
function normalizeAngle(angle) {
    angle = angle % 360;
    if (angle > 180) {
        angle -= 360;
    }
    if (angle < -180) {
        angle += 360;
    }
    return angle;
}

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// ====================
// NOTE CREATION
// ====================
function createNoteElement(noteData) {
    // Create main note bubble
    const noteBubble = document.createElement("div");
    noteBubble.className = "note";

    const noteBubbleContent = document.createElement("div");
    noteBubbleContent.className = "note-bubble-content";

    const middleRow = document.createElement("div");
    middleRow.className = "middle-row";

    // Create note label
    const noteLetter = document.createElement("div");
    noteLetter.className = "note-letter";
    noteLetter.textContent = noteData.note;

    // Create roman numeral
    const romanNumeral = document.createElement("div");
    romanNumeral.className = "roman-numeral";
    romanNumeral.textContent = noteData.romanNumeral;

    // Create mode
    const mode = document.createElement("div");
    mode.className = "mode";
    mode.textContent = noteData.mode;

    // Create chord symbol
    const triadChordSymbol = document.createElement("div");
    triadChordSymbol.className = "triad-chord-symbol";
    triadChordSymbol.textContent = noteData.triadChordSymbol;

    // Add all text elements to note bubble
    middleRow.appendChild(noteLetter);
    middleRow.appendChild(triadChordSymbol);
    noteBubbleContent.appendChild(romanNumeral);
    noteBubbleContent.appendChild(middleRow);
    noteBubbleContent.appendChild(mode);
    noteBubble.appendChild(noteBubbleContent);

    // Return completed note
    return noteBubble;
}
 
// ====================
// NOTE POSITIONING
// ====================
function positionNotes(noteBubble, index) {
    const angle = ((360 / notes.length) * index) - 90; // Starts C at the top (-90deg offset cause notes were snapping to 3 o'clock position)
    const radians = degreesToRadians(angle); // Converts angle to radians for trig functions
    const x = centerX + radius * Math.cos(radians); // Calculates x position of notes
    const y = centerY + radius * Math.sin(radians); // Calculates y position of notes
    const noteSize = noteBubble.offsetWidth;
    noteBubble.style.left = (x - noteSize / 2) + "px";
    noteBubble.style.top = (y - noteSize / 2) + "px";

    // Return angle because rotation logic needs it
    return angle;
}

// ====================
// ACTIVE NOTE
// ====================
function setActiveNote(selectedNote) {

    const allNotes = document.querySelectorAll(".note");
    allNotes.forEach(function(noteBubble) {
        noteBubble.classList.remove("active");
    });
    selectedNote.classList.add("active");
}

// ====================
// WHEEL ROTATION
// ====================
function rotateWheel(angle) {
    const targetRotation = normalizeAngle(-angle - 90);
    let rotationDifference = normalizeAngle(targetRotation - currentRotation);
    currentRotation += rotationDifference;
    wheel.style.transform = `rotate(${currentRotation}deg)`;

    // Keep Labels Upright
    const noteBubbleContents =
    document.querySelectorAll(".note-bubble-content");
    noteBubbleContents.forEach(function(noteBubbleContent) {
        noteBubbleContent.style.transform =
        `rotate(${-currentRotation}deg)`;

});

}

// ====================
// MAIN APP LOGIC
// ====================
notes.forEach(function(noteData, index) {

    // Create note
    const noteBubble = createNoteElement(noteData);

    // Add note into wheel FIRST
    // so browser can measure size
    wheel.appendChild(noteBubble);

    // Position note
    const angle = positionNotes(noteBubble, index);

    // Add click event listener to note
    noteBubble.addEventListener("click", function() {
        setActiveNote(noteBubble);
        rotateWheel(angle);
    });
});

// ====================
// INITIALISATION
// ====================
    const firstNote = document.querySelector(".note"); // Makes it so that the note top is Green on refresh, and the wheel is in the default position with C at the top
    firstNote.classList.add("active");
    
    
    
