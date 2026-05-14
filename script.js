// ====================
// DOM REFERENCES
// ====================
const wheel = document.getElementById("wheel");

// ====================
// APP STATE
// ====================
let currentRotation = 0;
let currentKey = "C";
let activeScaleDegree = 0;

// Which Notes appear visible on reload:
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

// ========================
// CHROMATIC + KEY SYSTEM
// ========================
const chromaticScaleSharp = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const chromaticScaleFlat = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];

const sharpKeys = ["C", "G", "D", "A", "E", "B"];
const flatKeys = ["F", "Bb", "Eb", "Ab", "Db", "Gb"];

const scalePatterns = { major: [0, 2, 4, 5, 7, 9, 11] };

const keyRoots = { C: 0, Db: 1, D: 2, Eb: 3, E: 4, F: 5, Gb: 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11};

// ===============================
// MUSICAL DATA (STRUCTURE ONLY)
// ===============================
const musicTheoryData = [
    { scaleDegree: 0, romanNumeral: "I", mode: "IONIAN", triadChordSymbol: "" },
    { scaleDegree: 1, romanNumeral: "ii", mode: "dorian", triadChordSymbol: "m" },
    { scaleDegree: 2, romanNumeral: "iii", mode: "phrygian", triadChordSymbol: "m" },
    { scaleDegree: 3, romanNumeral: "IV", mode: "LYDIAN", triadChordSymbol: "" },
    { scaleDegree: 4, romanNumeral: "V", mode: "MIXOLYDIAN", triadChordSymbol: "" },
    { scaleDegree: 5, romanNumeral: "vi", mode: "aeolian", triadChordSymbol: "m" },
    { scaleDegree: 6, romanNumeral: "vii", mode: "locrian", triadChordSymbol: "°" }
];

// ====================
// HELPERS
// ====================
function normalizeAngle(angle) {
    angle = angle % 360;
    if (angle > 180) angle -= 360;
    if (angle < -180) angle += 360;
    return angle;
}

function degreesToRadians(deg) {
    return deg * Math.PI / 180;
}

// ====================
// KEY GENERATION
// ====================
function buildKey(rootIndex) {
    const chromatic =
        sharpKeys.includes(currentKey)
            ? chromaticScaleSharp
            : chromaticScaleFlat;
    return scalePatterns.major.map(interval =>
        chromatic[(rootIndex + interval) % 12]
    );
}

function getCurrentKeyNotes() {
    const rootIndex = keyRoots[currentKey];

    if (rootIndex === undefined) {
        console.error("Invalid key:", currentKey);
        return chromatic;
    }

    return buildKey(rootIndex);
}

// ====================
// NOTE CREATION
// ====================
function createNoteElement(noteData, index, keyNotes) {

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
    keyNotes[noteData.scaleDegree]

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
// POSITIONING
// ====================
function positionNotes(noteBubble, index) {
    const wheelSize = wheel.offsetWidth;
    const centerX = wheelSize / 2;
    const centerY = wheelSize / 2;
    const radius = wheelSize * 0.4;
    const angle = ((360 / musicTheoryData.length) * index) - 90;
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
// SET WHEEL ROTATION
// ====================
function setWheelRotation(angle) {

    currentRotation = normalizeAngle(-angle - 90);

    wheel.style.transform =
        `rotate(${currentRotation}deg)`;

    document.querySelectorAll(".note-bubble-content")
        .forEach(content => {

            content.style.transform =
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
// RENDER WHEEL (IMPORTANT)
// ====================
function renderWheel() {

    if (!wheel) return;

    wheel.innerHTML = "";

    const keyNotes = getCurrentKeyNotes();

    musicTheoryData.forEach((noteData, index) => {

        const noteBubble = document.createElement("div");
        noteBubble.className = "note";

        const noteBubbleContent = document.createElement("div");
        noteBubbleContent.className = "note-bubble-content";

        const middleRow = document.createElement("div");
        middleRow.className = "middle-row";

        const noteLetter = document.createElement("div");
        noteLetter.className = "note-letter";

        noteLetter.textContent =
    keyNotes[noteData.scaleDegree];

        const romanNumeral = document.createElement("div");
        romanNumeral.className = "roman-numeral";
        romanNumeral.textContent = noteData.romanNumeral;

        const mode = document.createElement("div");
        mode.className = "mode";
        mode.textContent = noteData.mode;

        const chord = document.createElement("div");
        chord.className = "triad-chord-symbol";
        chord.textContent = noteData.triadChordSymbol;

        middleRow.appendChild(noteLetter);
        middleRow.appendChild(chord);

        noteBubbleContent.appendChild(romanNumeral);
        noteBubbleContent.appendChild(middleRow);
        noteBubbleContent.appendChild(mode);

        noteBubble.appendChild(noteBubbleContent);
        wheel.appendChild(noteBubble);

        noteBubbleContent.style.transform =
    `rotate(${-currentRotation}deg)`;

        const angle = positionNotes(noteBubble, index);

    noteBubble.addEventListener("click", () => {
        activeScaleDegree = index;
        setActiveNote(noteBubble);
        rotateWheel(angle);
});
    });

    const allNotes = document.querySelectorAll(".note");
    const activeNote = allNotes[activeScaleDegree];
if (activeNote) {
    activeNote.classList.add("active");
}

const activeAngle =
    ((360 / musicTheoryData.length) * activeScaleDegree) - 90;

setWheelRotation(activeAngle);

}

// ====================
// KEY CHANGE
// ====================
function changeKey(newKey) {
    currentKey = newKey;
    renderWheel();
}

document.addEventListener("DOMContentLoaded", () => {
    renderWheel();
    updateVisibility();
});

// ====================
// INITIALISATION
// ====================
// renderWheel();
updateVisibility();

// ====================
// KEY DROPDOWN
// ====================
document.getElementById("keySelect").addEventListener("change", (e) => {
    changeKey(e.target.value);
});

// ====================
// RESIZE
// ====================
window.addEventListener("resize", () => {
    renderWheel();
});