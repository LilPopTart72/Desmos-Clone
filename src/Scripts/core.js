// core.js
const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

// Internal shared state
let Width = 0;
let Height = 0;

let xMin = -10;
let xMax = 10;
let yMin = -10;
let yMax = 10;
let step = 1;

// Global object for all other files to use
window.GraphCore = {
    canvas,
    ctx,

    // width / height
    get Width() { return Width; },
    get Height() { return Height; },
    setSize(w, h) {
        Width = w;
        Height = h;
    },

    // range
    setRange(xmin, xmax, ymin, ymax, s) {
        xMin = xmin;
        xMax = xmax;
        yMin = ymin;
        yMax = ymax;
        step = s;
    },

    get step() { return step; },
    get xMin() { return xMin; },
    get xMax() { return xMax; },
    get yMin() { return yMin; },
    get yMax() { return yMax; }
};
