const canvas = document.getElementById('graph');
const ctx = canvas.getContext('2d');

const Width = canvas.width;
const Height = canvas.height

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

    xMin = parseInt(document.getElementById('xMin').value);
    xMax = parseInt(document.getElementById('xMax').value);
    yMin = parseInt(document.getElementById('yMin').value);
    yMax = parseInt(document.getElementById('yMax').value);
    step = parseInt(document.getElementById('step').value);

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

    for(let x = xMin; x<= xMax; x += step){
        drawLine(x, yMin, x, yMax, 'black', 1);
        ctx.fillStyle = 'black'
        ctx.fillText(x, toCanvasX(x + 0.05), toCanvasY(0.05));
    }


    for(let y = yMin; y<= yMax; y += step){
        drawLine(xMin, y, xMax, y, 'black', 1);
        ctx.fillStyle = 'black'
        ctx.fillText(y, toCanvasX(0.05), toCanvasY(y + 0.05));
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

function plotLine(eq, color, size, num){
    prev = 0
    txt1 = 'a$slider'.replace('$', num);
    txt2 = 'b$slider'.replace('$', num);
    txt3 = 'c$slider'.replace('$', num);
    eq = eq.replace(/\ba\b/g, document.getElementById(txt1).value );
    eq = eq.replace(/\bb\b/g, document.getElementById(txt2).value );
    eq = eq.replace(/\bc\b/g, document.getElementById(txt3).value );

    for (let x = xMin; x <= xMax; x += step/20){
        y = eval(eq);
        //plotPoint(x, y, color, size);

        if (prev !== 0){
            drawLine(prev.x, prev.y, x, y, color, 2);
        }
        prev = {x, y};
    }
}


function updateGraph(){
    drawAxes();

    [['plot1', 'blue', '1'], ['plot2', 'green', '2'], ['plot3', 'red', '3'], ['plot4', 'purple', '4'], ['plot5', 'orange', '5']].forEach(([id, color, num]) => {
    const el = document.getElementById(id);
        if (el && el.value == undefined) {console.log('el ', el.value)}
        else if (el && el.value.trim() !== '') {
            txt = 'slider$text'.replace('$', num);
            txt1 = 'a$slider'.replace('$', num);
            txt2 = 'b$slider'.replace('$', num);
            txt3 = 'c$slider'.replace('$', num);
            document.getElementById(txt).textContent = "A: " + document.getElementById(txt1).value + "  B: " + document.getElementById(txt2).value + "  C: " + document.getElementById(txt3).value;
            plotMethod(el.value, color, num);
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

updateGraph();

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