// ====================
// DOM REFERENCES
// ====================
const wheel = document.getElementById("wheel");
const keySelect = document.getElementById("keySelect");
const chordSymbolSelect = document.getElementById("chordSymbolSelect");
const visibilityToggleButtonControls = document.getElementById("visibility-toggle-buttons");

// ====================
// APP STATE
// ====================
let currentRotation = 0;
let currentKey = "C";
let activeScaleDegree = 0;
let currentChordSymbolType = "triad";

// Which Notes appear visible on reload:
let visibility = {
    notes: true,
    numerals: true,
    chords: true,
    modes: true,
    degreeColours: false
};

// ====================
// CHROMATIC + KEY SYSTEM
// ====================
const chromaticScaleSharp = ["C", "C♯", "D", "D♯", "E", "F", "F♯", "G", "G♯", "A", "A♯", "B"];
const chromaticScaleFlat = ["C", "D♭", "D", "E♭", "E", "F", "G♭", "G", "A♭", "A", "B♭", "B"];
const sharpKeys = ["C", "G", "D", "A", "E", "B"];
const flatKeys = ["F", "B♭", "E♭", "A♭", "D♭", "G♭"];
const scalePatterns = {major: [0, 2, 4, 5, 7, 9, 11]};
const keyRoots = {C: 0, "D♭": 1, D: 2, "E♭": 3, E: 4, F: 5, "G♭": 6, G: 7, "A♭": 8, A: 9, "B♭": 10, B: 11};

// ====================
// MUSIC THEORY DATA
// ====================
const musicTheoryData = [
    {scaleDegree: 0, romanNumeral: "I", mode: "IONIAN",
        chordSymbols: {triad: "", seventh: "∆7", ninth: "∆9", eleventh: "∆11", thirteenth: "∆13"}},
    {scaleDegree: 1, romanNumeral: "ii", mode: "dorian",
        chordSymbols: {triad: "m", seventh: "m7", ninth: "m9", eleventh: "m11", thirteenth: "m13"}},
    {scaleDegree: 2, romanNumeral: "iii", mode: "phrygian",
        chordSymbols: {triad: "m", seventh: "m7", ninth: "m7(b9)", eleventh: "m11(b9)", thirteenth: "m11(b9,b13)"}},
    {scaleDegree: 3, romanNumeral: "IV", mode: "LYDIAN",
        chordSymbols: { triad: "", seventh: "∆7", ninth: "∆9", eleventh: "∆9(#11)", thirteenth: "∆13(#11)"}},
    {scaleDegree: 4, romanNumeral: "V", mode: "MIXOLYDIAN",
        chordSymbols: {triad: "", seventh: "7", ninth: "9", eleventh: "11", thirteenth: "13"}},
    {scaleDegree: 5, romanNumeral: "vi", mode: "aeolian",
        chordSymbols: {triad: "m", seventh: "m7", ninth: "m9", eleventh: "m11", thirteenth: "m11(b13)"}},
    {scaleDegree: 6, romanNumeral: "vii°", mode: "locrian",
        chordSymbols: {triad: "o", seventh: "m7(b5)", ninth: "m7(b5,b9)", eleventh: "m11(b5,b9)", thirteenth: "m11(b5,b9,b13)"}}
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

function degreesToRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// ====================
// KEY GENERATION
// ====================
function buildKey(rootIndex) {
        if (rootIndex === undefined) {
        console.error("Invalid rootIndex");
        return [];
    }
    
    const chromatic = sharpKeys.includes(currentKey)
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
        return chromaticScaleSharp;
    }
    return buildKey(rootIndex);
}

// ====================
// NOTE CREATION
// ====================
function createNoteElement(
    noteData,
    index,
    keyNotes
    ) {

    // Main Bubble
    const noteBubble = document.createElement("div");
    noteBubble.className = "wheel-bubble";

    // Degree colours
    const scaleDegreeClasses = [
    "wheel-bubble--tonic",
    "wheel-bubble--supertonic",
    "wheel-bubble--mediant",
    "wheel-bubble--subdominant",
    "wheel-bubble--dominant",
    "wheel-bubble--submediant",
    "wheel-bubble--leading"
    ];

    noteBubble.classList.add(
        scaleDegreeClasses[noteData.scaleDegree]
    );

    // Bubble Content
    const noteBubbleContent = document.createElement("div");
    noteBubbleContent.className = "wheel-bubble__content";

    // Middle Row
    const middleRow = document.createElement("div");
    middleRow.className = "middle-row";

    // ====================
    // NOTE LETTER
    // ====================
    const noteLetter = document.createElement("div");
    noteLetter.className = "wheel-bubble__note";

    const noteText = keyNotes[noteData.scaleDegree];

    const natural = noteText[0];
    const accidental = noteText.slice(1);

    let accidentalClass = "";
    if (accidental === "♭") {
        accidentalClass = "wheel-bubble__note-flat";
    }

    if (accidental === "♯") {
        accidentalClass = "wheel-bubble__note-sharp";
    }

    noteLetter.innerHTML = `
        <span class="wheel-bubble__note-natural">
            ${natural}
        </span>

    ${accidental
            ? `<span class="${accidentalClass}">
                ${accidental}
                </span>`
            : ""}
    `;

    // ====================
    // ROMAN NUMERAL
    // ====================
    const romanNumeral = document.createElement("div");
    romanNumeral.className = "wheel-bubble__roman-numeral";
    romanNumeral.textContent = noteData.romanNumeral;

    // ====================
    // MODE
    // ====================
    const mode = document.createElement("div");
    mode.className = "wheel-bubble__mode";
    mode.textContent = noteData.mode;


    // ====================
    // CHORD
    // ====================
    const chord = document.createElement("div");
    chord.className = "wheel-bubble__chord-symbol";
    chord.textContent = noteData.chordSymbols[currentChordSymbolType];

    // ====================
    // BUILD STRUCTURE
    // ====================
    const chordStack = document.createElement("div");
    chordStack.className = "wheel-bubble__chord-stack";
    chordStack.appendChild(noteLetter);
    chordStack.appendChild(chord);
    middleRow.appendChild(chordStack);
    noteBubbleContent.appendChild(romanNumeral);
    noteBubbleContent.appendChild(middleRow);
    noteBubbleContent.appendChild(mode);
    noteBubble.appendChild(noteBubbleContent);
    return noteBubble;
    }

// ====================
// POSITION NOTES
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
    const allNotes = document.querySelectorAll(".wheel-bubble");
    allNotes.forEach(noteBubble => {noteBubble.classList.remove("active");
    });
    selectedNote.classList.add("active");
}

// ====================
// ROTATE WHEEL
// ====================
function rotateWheel(angle) {
    wheel.classList.add("wheel-spinning");

    const targetRotation = normalizeAngle(-angle - 90);

    const rotationDifference = normalizeAngle(targetRotation - currentRotation);

    currentRotation += rotationDifference;

    wheel.style.transform = `rotate(${currentRotation}deg)`;
    applyContentUprightRotation();

    // Remove animation class after spin finishes
    setTimeout(() => {
        wheel.classList.remove("wheel-spinning");
    }, 1400);
}

    // KEEP LABELS UPRIGHT //
function applyContentUprightRotation() {
    document.querySelectorAll(".wheel-bubble__content")
        .forEach(content => {
            content.style.transform = `rotate(${-currentRotation}deg)`;
        });
}

// ====================
// SET ROTATION
// ====================
function setWheelRotation(angle) {
    currentRotation =
        normalizeAngle(-angle - 90);
    wheel.style.transform =
        `rotate(${currentRotation}deg)`;
        applyContentUprightRotation();
}

// ====================
// CUSTOM DROPDOWNS (SIDEBAR)
// ====================
const dropdowns =
    document.querySelectorAll(".sidebar-dropdown");

dropdowns.forEach(dropdown => {

    const toggle =
        dropdown.querySelector(".dropdown-toggle");

    toggle.addEventListener("click", () => {

        dropdowns.forEach(d => {
    if (d !== dropdown) {
        d.classList.remove("open");
    }
});

dropdown.classList.toggle("open");

    });

});

// ====================
// KEY DROPDOWN OPTIONS
// ====================

document
    .querySelectorAll("[data-key]")
    .forEach(button => {

        button.addEventListener("click", () => {

            const newKey =
                button.dataset.key;

            changeKey(newKey);

            document
                .querySelectorAll("[data-key]")
                .forEach(btn =>
                    btn.classList.remove("active")
                );

            button.classList.add("active");

        });

    });

// ====================
// CHORD DROPDOWN OPTIONS
// ====================
document.querySelectorAll("[data-chord]")
    .forEach(button => {
        button.addEventListener("click", () => {
            currentChordSymbolType =
                button.dataset.chord;
            renderWheel();
            document.querySelectorAll("[data-chord]")
                .forEach(btn =>
                    btn.classList.remove("active")
                );
            button.classList.add("active");
        });
    });

// ====================
// VISIBILITY DROPDOWN
// ====================
function updateVisibility() {

    // ====================
    // BASIC VISIBILITY
    // ====================

    document
        .querySelectorAll(".wheel-bubble__note")
        .forEach(el => {
            el.style.display =
                visibility.notes ? "block" : "none";
        });

    document
        .querySelectorAll(".wheel-bubble__roman-numeral")
        .forEach(el => {
            el.style.display =
                visibility.numerals ? "block" : "none";
        });

    document
        .querySelectorAll(".wheel-bubble__chord-symbol")
        .forEach(el => {
            el.style.display =
                visibility.chords ? "block" : "none";
        });

    document
        .querySelectorAll(".wheel-bubble__mode")
        .forEach(el => {
            el.style.display =
                visibility.modes ? "block" : "none";
        });

    // ====================
    // DEGREE COLOURS
    // ====================

    if (visibility.degreeColours) {
        wheel.classList.add("show-degree-colours");
    } else {
        wheel.classList.remove("show-degree-colours");
    }

    // ====================
    // CHORD TYPE CLASSES
    // ====================

    wheel.classList.remove(
        "show-triads",
        "show-sevenths",
        "show-ninths",
        "show-elevenths",
        "show-thirteenths"
    );

    switch (currentChordSymbolType) {

        case "triad":
            wheel.classList.add("show-triads");
            break;

        case "seventh":
            wheel.classList.add("show-sevenths");
            break;

        case "ninth":
            wheel.classList.add("show-ninths");
            break;

        case "eleventh":
            wheel.classList.add("show-elevenths");
            break;

        case "thirteenth":
            wheel.classList.add("show-thirteenths");
            break;
    }
}

// ====================
// VISIBILITY TOGGLES
// ====================
function createToggleSwitch(label, key) {

    const row = document.createElement("div");
    row.className = "toggle-row";

    const text = document.createElement("span");
    text.className = "label";
    text.textContent = label;

    const labelWrap = document.createElement("label");
    labelWrap.className = "switch";

    const input = document.createElement("input");
    input.type = "checkbox";
    input.dataset.visibility = key;
    input.checked = visibility[key];

    const slider = document.createElement("span");
    slider.className = "slider round";

    input.addEventListener("change", () => {
        visibility[key] = input.checked;
        updateVisibility();
    });

    labelWrap.appendChild(input);
    labelWrap.appendChild(slider);

    row.appendChild(text);
    row.appendChild(labelWrap);

    return row;
}

// ====================
// CREATE TOGGLES
// ====================
visibilityToggleButtonControls.appendChild(
    createToggleSwitch("Notes", "notes")
);

visibilityToggleButtonControls.appendChild(
    createToggleSwitch("Numerals", "numerals")
);

visibilityToggleButtonControls.appendChild(
    createToggleSwitch("Chords", "chords")
);

visibilityToggleButtonControls.appendChild(
    createToggleSwitch("Modes", "modes")
);

visibilityToggleButtonControls.appendChild(
    createToggleSwitch("Colours", "degreeColours")
);

// ====================
// RENDER WHEEL
// ====================
function renderWheel() {

    if (!wheel) return;

    wheel.innerHTML = "";

    const keyNotes =
        getCurrentKeyNotes();

    musicTheoryData.forEach((noteData, index) => {

        const noteBubble =
            createNoteElement(
                noteData,
                index,
                keyNotes
            );

        wheel.appendChild(noteBubble);

        const angle =
            positionNotes(noteBubble, index);

        noteBubble.addEventListener("click", () => {
            activeScaleDegree = index;
            setActiveNote(noteBubble);
            rotateWheel(angle);
        });
    });

    const allNotes =
        document.querySelectorAll(".wheel-bubble");

    const activeNote =
        allNotes[activeScaleDegree];

    if (activeNote) {
        activeNote.classList.add("active");
    }

// Keep current active note highlighted
const activeAngle =
    ((360 / musicTheoryData.length)
    * activeScaleDegree) - 90;

// Instantly keep wheel at current position
wheel.style.transform = `rotate(${currentRotation}deg)`;

// Instantly keep text upright
applyContentUprightRotation();

updateVisibility();
}

// ====================
// CHANGE KEY
// ====================
function changeKey(newKey) {
    currentKey = newKey;
    renderWheel();
}

// ====================
// CHANGE CHORD TYPE
// ====================
function changeChordSymbolType(type) {
    currentChordSymbolType = type;
    renderWheel();
}

function updateChordSymbols() {
    const keyNotes = getCurrentKeyNotes();

    document.querySelectorAll(".wheel-bubble").forEach((noteEl, index) => {
        const chordEl = noteEl.querySelector(".wheel-bubble__chord-symbol");
        const noteData = musicTheoryData[index];

        chordEl.textContent =
            noteData.chordSymbols[currentChordSymbolType];
    });
}

// ====================
// DEBUG LAYOUT TOGGLE
// ====================
const debugToggle = document.getElementById("debugToggle");
debugToggle.addEventListener("click", () => {
    // Toggle body debug mode
    document.body.classList.toggle("debug-layout");

    // Toggle button active state
    debugToggle.classList.toggle("active");
});

// ====================
// INITIALISATION
// ====================
renderWheel();
updateVisibility();

// ====================
// RESIZE
// ====================
window.addEventListener("resize", () => {

    renderWheel();
});