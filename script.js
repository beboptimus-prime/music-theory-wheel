// ====================
// DOM REFERENCES
// ====================
const wheel = document.getElementById("wheel");

// ====================
// APP STATE
// ====================
let currentRotation = 0;

let visibility = {
    note: true,
    numeral: true,
    chord: true,
    mode: true
};

// ====================
// CONFIG
// ====================
const wheelSize = wheel.offsetWidth;

const centerX = wheelSize / 2;
const centerY = wheelSize / 2;

const radius = wheelSize * 0.4;

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
// NOTE POSITIONING & RESIZING
// ====================
function positionNotes(noteBubble, index) {
    const wheelSize = wheel.offsetWidth;
    const centerX = wheelSize / 2;
    const centerY = wheelSize / 2;
    const radius = wheelSize * 0.4;
    const angle = ((360 / notes.length) * index) - 90;
    const radians = degreesToRadians(angle);
    const x = centerX + radius * Math.cos(radians);
    const y = centerY + radius * Math.sin(radians);
    const noteSize = noteBubble.offsetWidth;
    noteBubble.style.left = (x - noteSize / 2) + "px";
    noteBubble.style.top = (y - noteSize / 2) + "px";
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
// VISIBILITY TOGGLE
// ====================
function updateVisibility() {

    document.querySelectorAll(".note-letter")
        .forEach(el => el.style.display = visibility.note ? "block" : "none");
    document.querySelectorAll(".roman-numeral")
        .forEach(el => el.style.display = visibility.numeral ? "block" : "none");
    document.querySelectorAll(".triad-chord-symbol")
        .forEach(el => el.style.display = visibility.chord ? "block" : "none");
    document.querySelectorAll(".mode")
        .forEach(el => el.style.display = visibility.mode ? "block" : "none");
}
// ====================
// CREATING VISIBILITY TOGGLE BUTTONS
// ====================
function createToggleButton(labelText, key) {

    const toggleButtonWrapper = document.createElement("div");
    toggleButtonWrapper.className = "toggle-button-row";
    toggleButtonWrapper.classList.toggle("active-row", visibility[key]);
    toggleButtonWrapper.dataset.key = key;

    const visibilityToggleButton = document.createElement("div");
    visibilityToggleButton.className = "visibility-toggle-button";

    const visibilityToggleButtonText = document.createElement("div");
    visibilityToggleButtonText.className = "toggle-button-text";
    visibilityToggleButtonText.textContent = labelText;

    if (visibility[key]) {
        visibilityToggleButton.classList.add("active");
    }

    visibilityToggleButton.addEventListener("click", function () {
        visibility[key] = !visibility[key];
        visibilityToggleButton.classList.toggle("active");
        updateVisibility();
    });

    toggleButtonWrapper.appendChild(visibilityToggleButton);
    toggleButtonWrapper.appendChild(visibilityToggleButtonText);

    return toggleButtonWrapper;
}

const visibilityToggleButtonControls = document.getElementById("visibility-toggle-buttons");

visibilityToggleButtonControls.appendChild(createToggleButton("Note", "note"));
visibilityToggleButtonControls.appendChild(createToggleButton("Numerals", "numeral"));
visibilityToggleButtonControls.appendChild(createToggleButton("Chords", "chord"));
visibilityToggleButtonControls.appendChild(createToggleButton("Modes", "mode"));

function syncToggleUI() {
    document.querySelectorAll(".toggle-row").forEach(row => {
        const key = row.dataset.key;
        const button = row.querySelector(".visibility-toggle-button");
        if (visibility[key]) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
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

updateVisibility();

// ====================
// WINDOW RESIZE
// ====================
window.addEventListener("resize", function () {
    const noteBubbles = document.querySelectorAll(".note");
    noteBubbles.forEach(function(noteBubble, index) {
        positionNotes(noteBubble, index);
    });

});