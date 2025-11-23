// listeners.js

const inputs = [
    "plot1", "plot2", "plot3", "plot4", "plot5",
    "xMin", "xMax", "yMin", "yMax", "step",
    "a1slider", "b1slider", "c1slider",
    "a2slider", "b2slider", "c2slider",
    "a3slider", "b3slider", "c3slider",
    "a4slider", "b4slider", "c4slider",
    "a5slider", "b5slider", "c5slider"
];

window.addEventListener("DOMContentLoaded", () => {
    // Make sure Graph exists
    if (!window.Graph) {
        console.error("Graph is not defined – check that graph.js is loaded before listeners.js");
        return;
    }

    // Hook up input listeners
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        el.addEventListener("input", Graph.updateGraph);
    });

    window.addEventListener("resize", Graph.resizeCanvas);
    
    // Mouse wheel zoom
    GraphCore.canvas.addEventListener("wheel", e => {
        e.preventDefault();

        let s = GraphCore.step;

        if (e.deltaY < 0) {
            // Zoom in
            s *= 0.9;
            if (s >= 1) s = Math.floor(s);
        } else {
            // Zoom out
            s *= 1.1;
            if (s >= 1) s = Math.ceil(s);
            else if (s > 0.91) s = 1;
        }

        if (s < 0.0001) s = 0.0001;

        GraphCore.setRange(
            GraphCore.xMin,
            GraphCore.xMax,
            GraphCore.yMin,
            GraphCore.yMax,
            s
        );

        Graph.resizeCanvas();
    }, { passive: false });

    // Initial draw
    Graph.resizeCanvas();
});
