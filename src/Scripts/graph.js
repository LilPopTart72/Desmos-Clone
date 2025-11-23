// graph.js
const PLOTS = [
    ['plot1', 'blue',  '1'],
    ['plot2', 'green', '2'],
    ['plot3', 'red',   '3'],
    ['plot4', 'purple','4'],
    ['plot5', 'orange','5']
];

function drawAxes() {
    if (!Number.isFinite(step) || step <= 0) {
        step = 1;
    }

    // how many "units" (grid cells of 100px) fit horizontally/vertically
    const unitsX = Width / 100;
    const unitsY = Height / 100;

    // half on each side
    const halfUnitsX = unitsX / 2;
    const halfUnitsY = unitsY / 2;

    // snap to whole units, then scale by step
    xMin = Math.floor(-halfUnitsX) * step;
    xMax = Math.ceil(halfUnitsX) * step;
    yMin = Math.floor(-halfUnitsY) * step;
    yMax = Math.ceil(halfUnitsY) * step;

    // update core range state
    GraphCore.setRange(xMin, xMax, yMin, yMax, step);

    // 🔴 was: clearCanvas();
    GraphUtils.clearCanvas();

    ctx.strokeStyle = 'maroon';
    ctx.lineWidth = 2;
    ctx.font = '18px Arial';

    // tiny grid lines
    for (let x = xMin; x <= xMax; x += step / 4) {
        GraphUtils.drawLine(x, yMin, x, yMax, 'lightgray', 1);
    }

    for (let y = yMin; y <= yMax; y += step / 4) {
        GraphUtils.drawLine(xMin, y, xMax, y, 'lightgray', 1);
    }

    // y-pixel of the x-axis (world y = 0)
    const axisY = GraphUtils.toCanvasY(0);

    // First multiple of step >= xMin
    let xStart = Math.ceil(xMin / step) * step;

    for (let x = xStart; x <= xMax + 1e-9; x += step) {
        GraphUtils.drawLine(x, yMin, x, yMax, 'black', 1);

        if (step >= 1) {
            ctx.fillText(x, GraphUtils.toCanvasX(x), axisY - 2);
        } else {
            ctx.fillText(x.toFixed(4), GraphUtils.toCanvasX(x), axisY - 2);
        }
    }

    // --- Major horizontal lines + y labels ---
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // x-pixel of the y-axis (world x = 0)
    const axisX = GraphUtils.toCanvasX(0);

    let yStart = Math.ceil(yMin / step) * step;

    for (let y = yStart; y <= yMax + 1e-9; y += step) {
        GraphUtils.drawLine(xMin, y, xMax, y, 'black', 1);

        if (y === 0) continue;

        if (step >= 1) {
            ctx.fillText(y, axisX, GraphUtils.toCanvasY(y) - 6);
        } else {
            ctx.fillText(y.toFixed(2), axisX, GraphUtils.toCanvasY(y) - 6);
        }
    }

    if (xMin <= 0 && xMax >= 0) {
        GraphUtils.drawLine(0, yMin, 0, yMax, 'maroon', 2);
    }

    if (yMin <= 0 && yMax >= 0) {
        GraphUtils.drawLine(xMin, 0, xMax, 0, 'maroon', 2);
    }
}

function plotLine(eq, color, size, num) {

    const txt1 = 'a$slider'.replace('$', num);
    const txt2 = 'b$slider'.replace('$', num);
    const txt3 = 'c$slider'.replace('$', num);

    eq = eq.replace(/\ba\b/g, document.getElementById(txt1).value);
    eq = eq.replace(/\bb\b/g, document.getElementById(txt2).value);
    eq = eq.replace(/\bc\b/g, document.getElementById(txt3).value);

    const f = GraphUtils.makeFunc(eq);

    let prev = null;

    for (let x = xMin; x <= xMax; x += step / 500) {
        const y = f(x);
        if (prev) {
            GraphUtils.drawLine(prev.x, prev.y, x, y, color, 2);
        }
        prev = { x, y };
    }
}

function plotMethod(input, color, num) {
    if (input.includes(',')) {
        const p = GraphUtils.parsePoint(input);
        GraphUtils.plotPoint(p.x, p.y, color);
    } else if (input.includes('y') || input.includes('x')) {
        const eq = GraphUtils.parseLine(input);
        plotLine(eq, color, 2, num);
    }
}

function updateGraph() {
    drawAxes();

    PLOTS.forEach(([id, color, num]) => {
        const el = document.getElementById(id);
        if (!el || !el.value || el.value.trim() === '') return;

        const sliderLabelId = `slider${num}text`;
        const aId = `a${num}slider`;
        const bId = `b${num}slider`;
        const cId = `c${num}slider`;

        const labelEl = document.getElementById(sliderLabelId);
        if (labelEl) {
            labelEl.textContent =
                `A: ${document.getElementById(aId).value}  ` +
                `B: ${document.getElementById(bId).value}  ` +
                `C: ${document.getElementById(cId).value}`;
        }

        plotMethod(el.value, color, num);
    });
}

function resizeCanvas() {
    GraphCore.setSize(canvas.clientWidth, canvas.clientHeight);
    canvas.width  = GraphCore.Width;
    canvas.height = GraphCore.Height;
    updateGraph();
}

window.Graph = {
    updateGraph,
    resizeCanvas
};
