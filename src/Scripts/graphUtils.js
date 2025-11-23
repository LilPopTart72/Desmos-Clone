// graphUtils.js

// Clear everything
function clearCanvas() {
    ctx.clearRect(0, 0, GraphCore.Width, GraphCore.Height);
}

// Convert graph → canvas coordinates
function toCanvasX(x) {
    return (x - GraphCore.xMin) * (GraphCore.Width / (GraphCore.xMax - GraphCore.xMin));
}
function toCanvasY(y) {
    return (GraphCore.yMax - y) * (GraphCore.Height / (GraphCore.yMax - GraphCore.yMin));
}

function plotPoint(x, y, color = 'red', size = 10){

    const cx = toCanvasX(x);
    const cy = toCanvasY(y);

    ctx.fillStyle = color;
    ctx.fillRect(cx - size / 2, cy - size / 2, size, size)
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
        ctx.setLineDash([]);
}

function parsePoint(input){
    let clean = input.replace(/[()]/g, '').replace(/\s+/g, '');
    const [x, y] = clean.split(',').map(Number);
    return { x, y };
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
    eq = eq.replace(/\blog\(/g, 'Math.log10(')
            .replace(/\bln\(/g, 'Math.log(')
           .replace(/\bsin\(/g, 'Math.sin(')
           .replace(/\bcos\(/g, 'Math.cos(')
           .replace(/\btan\(/g, 'Math.tan(')
           .replace(/\bsqrt\(/g, 'Math.sqrt(')
           .replace(/\babs\(/g, 'Math.abs(');

    // 6. Implicit multiplication for numbers and variables

   // 6a. number followed by variable or '(' : 2x -> 2*x, 3(x+1) -> 3*(x+1)
    eq = eq.replace(/(\d)([a-zA-Z(])/g, '$1*$2');

    // 🔧 Fix cases like "Math.log10*(x)" and "Math.log*(x)" caused by the rule above
    eq = eq.replace(/Math\.log10\*\(/g, 'Math.log10(');
    eq = eq.replace(/Math\.log\*\(/g, 'Math.log(');


    // 6b. variable followed by variable: xy → x*y, ab → a*b
    // BUT do NOT touch Math.something or function names like sin, log, tan...
    eq = eq.replace(/\b([abcx])([abcx])\b/g, '$1*$2');
    

    return eq;
}

function makeFunc(eq) {
    console.log("makeFunc final eq: " + eq);
    return new Function('x', `return ${eq};`);
}

// export helpers
window.GraphUtils = {
    clearCanvas,
    toCanvasX,
    toCanvasY,
    drawLine,
    plotPoint,
    parsePoint,
    parseLine,
    makeFunc
};