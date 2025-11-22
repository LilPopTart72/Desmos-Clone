const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

Width = 0;
Height = 0;

let xMax, xMin, yMax, yMin, step;

function clearCanvas() {
    ctx.clearRect(0,0, Width, Height)
}

function toCanvasX(x){
    return ( (x - xMin) * (Width / (xMax - xMin)))
}

function toCanvasY(y){
    return ( (yMax - y) * (Height / (yMax - yMin)))
}

function drawLine(x1, y1, x2, y2, color = 'black', lineWidth = 2, dashed = false){
        ctx.strokeStyle = color
        ctx.fillStyle = color
        ctx.lineWidth = lineWidth;
        ctx.setLineDash(dashed ? [10, 5] : []);
        ctx.beginPath();
        ctx.moveTo(toCanvasX(x1), toCanvasY(y1));
        ctx.lineTo(toCanvasX(x2), toCanvasY(y2));
        ctx.stroke();
}

function drawAxes() {
    step = parseFloat(document.getElementById('step').value);

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

    clearCanvas();

    ctx.strokeStyle = 'maroon'
    ctx.lineWidth = 2;
    ctx.font = '18px Arial'

   for(let x = xMin; x<= xMax; x += step/4){
            drawLine(x, yMin, x, yMax, 'lightgray', 1);
    } 
    
    for(let y = yMin; y<= yMax; y += step/4){
        drawLine(xMin, y, xMax, y, 'lightgray', 1);
        
    } 

   // y-pixel of the x-axis (world y = 0)
    const axisY = toCanvasY(0);

    // First multiple of step >= xMin
    let xStart = Math.ceil(xMin / step) * step;

    for (let x = xStart; x <= xMax + 1e-9; x += step) {
        drawLine(x, yMin, x, yMax, 'black', 1);

        // label directly under the axis, 4px down
        ctx.fillText(x.toFixed(2), toCanvasX(x) + 4, axisY);
    }

    // --- Major horizontal lines + y labels ---

    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';

    // x-pixel of the y-axis (world x = 0)
    const axisX = toCanvasX(0);

    let yStart = Math.ceil(yMin / step) * step;

    for (let y = yStart; y <= yMax + 1e-9; y += step) {
        drawLine(xMin, y, xMax, y, 'black', 1);

        // label to the right of the y-axis, 4px right
        ctx.fillText(y.toFixed(2), axisX + 4, toCanvasY(y));
    }

    if (xMin <= 0 && xMax >= 0){
        // Y Axis
        drawLine(0, yMin, 0, yMax, 'maroon', 2);
    }

    if (yMin <= 0 && yMax >= 0){
    // X Axis
        drawLine(xMin, 0, xMax, 0, 'maroon', 2);
    }
}

function plotPoint(x, y, color = 'red', size = 10){
    const cx = toCanvasX(x);
    const cy = toCanvasY(y);

    ctx.fillStyle = color;
    ctx.fillRect(cx - size / 2, cy - size / 2, size, size)
}

function makeFunc(eq) {
    return new Function('x', `return ${eq};`);
}

function plotLine(eq, color, size, num){
    txt1 = 'a$slider'.replace('$', num);
    txt2 = 'b$slider'.replace('$', num);
    txt3 = 'c$slider'.replace('$', num);
    eq = eq.replace(/\ba\b/g, document.getElementById(txt1).value );
    eq = eq.replace(/\bb\b/g, document.getElementById(txt2).value );
    eq = eq.replace(/\bc\b/g, document.getElementById(txt3).value );

    const f = makeFunc(eq);
    let prev = null;

    for (let x = xMin; x <= xMax; x += step/50){
        const y = f(x);
        if (prev){
            drawLine(prev.x, prev.y, x, y, color, 2);
        }
        prev = {x, y};
    }
}


function updateGraph(){
    drawAxes();

    [['plot1', 'blue', '1'], ['plot2', 'green', '2'], ['plot3', 'red', '3'], ['plot4', 'purple', '4'], ['plot5', 'orange', '5']].forEach(([id, color, num]) => {
    const el = document.getElementById(id);
        if (el && el.value == undefined) {}
        else if (el && el.value.trim() !== '') {
            txt = 'slider$text'.replace('$', num);
            txt1 = 'a$slider'.replace('$', num);
            txt2 = 'b$slider'.replace('$', num);
            txt3 = 'c$slider'.replace('$', num);
            document.getElementById(txt).textContent = "A: " + document.getElementById(txt1).value + "  B: " + document.getElementById(txt2).value + "  C: " + document.getElementById(txt3).value;
            plotMethod(el.value, color, num);
            document.getElementById('stepCounter').textContent = "Step: " + document.getElementById('step').value;
        }
    });
    //plotPoint(1, 3);
    //plotLine('2*x+3', 'green', 10);
    
}

function parsePoint(input){
    const parts = input.split(',').map(part => part.replace('(', '').replace(')', '').trim());
    return { x: parseFloat(parts[0]), y: parseFloat(parts[1]) };
}

function parseLine(eq) {
    // 1. Remove spaces
    eq = eq.replace(/\s+/g, '');

    // 2. Keep only RHS if there's an '='
    if (eq.includes('=')) {
        eq = eq.split('=')[1];
    }

    // 3. Replace ^ with ** for exponent
    eq = eq.replace(/\^/g, '**');

    // 4. Implicit multiplication around functions (BEFORE mapping to Math.*)

    // 4a. Handle "asin(x)" / "bsin(x)" / "csin(x)" → "a*sin(x)" etc.
    //     i.e. [a|b|c] immediately followed by sin(...), cos(...), etc.
    eq = eq.replace(/([abc])(?=(sin|cos|tan|ln|log|sqrt|abs)\()/g, '$1*');

    // 4b. Handle "sin(x)a" → "sin(x)*a" (and same for b, c)
    eq = eq.replace(/\)([abc])/g, ')*$1');

    // 5. Map functions to Math.* (NOW do this)
    eq = eq.replace(/\bln\(/g, 'Math.log(')
           .replace(/\blog\(/g, 'Math.log10(')
           .replace(/\bsin\(/g, 'Math.sin(')
           .replace(/\bcos\(/g, 'Math.cos(')
           .replace(/\btan\(/g, 'Math.tan(')
           .replace(/\bsqrt\(/g, 'Math.sqrt(')
           .replace(/\babs\(/g, 'Math.abs(');

    // 6. Implicit multiplication for numbers and variables

    // 6a. number followed by variable or '(' : 2x -> 2*x, 3(x+1) -> 3*(x+1)
    eq = eq.replace(/(\d)([a-zA-Z(])/g, '$1*$2');

    // 6b. variable followed by variable: xy → x*y, abx^2 → a*b*x**2
    //     Don't touch inside things like "Math.sin" (we skip when previous is a letter or '.')
    eq = eq.replace(/(?<![A-Za-z\.])([a-z])([a-z])/g, '$1*$2');

    return eq;
}

function plotMethod(input, color, num){
    if (input.includes(',')){
        const point = parsePoint(input);

        plotPoint(point.x, point.y, color);
    }
    else if (input.includes('y') || input.includes('x')){
        const eq = parseLine(input);

        plotLine(eq, color, 2, num);
    }

}
function resizeCanvas() {
    // Match internal size to CSS layout size
    canvas.width  = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    // Update our globals
    Width  = canvas.width;
    Height = canvas.height;
    updateGraph();
}
resizeCanvas();

const controlIds = [
    'xMin', 'xMax', 'yMin', 'yMax', 'step',
    'plot1', 'plot2', 'plot3', 'plot4', 'plot5',
    'a1slider', 'b1slider', 'c1slider',
    'a2slider', 'b2slider', 'c2slider',
    'a3slider', 'b3slider', 'c3slider'
];

controlIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', updateGraph);
    }
});

window.addEventListener('resize', resizeCanvas);