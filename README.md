# Desmos Clone (v1.2)

A lightweight, infinitely scalable graphing calculator built entirely with **Vanilla JavaScript**, **HTML**, and **CSS**.  
This project emulates core Desmos functionality while remaining modular, hackable, and dependency-free. It showcases dynamic DOM manipulation, custom state management, mathematical expression parsing, and high-performance HTML5 Canvas rendering.

---

# 📸 Preview
<img width="2559" height="1439" alt="image" src="./assets/preview.png" />

---

# ✨ Features (v1.2)

### 🎨 High-Performance Canvas Rendering
- Dynamic coordinate mapping between "world space" and canvas pixels.
- X/Y axes with adjustable bounds and responsive scaling.
- Precision gridlines that dynamically adjust density based on zoom level.
- Scroll-to-zoom functionality centered directly on the graph viewport.
- Window resize listeners that automatically recalculate the drawing buffer to prevent stretching.

### 🧮 Advanced Expression Parsing
- Parses and graphs algebraic expressions dynamically.
- **Implicit Multiplication:** Automatically handles math syntax like `2x`, `3(x+1)`, or `a*sin(x)`.
- **Dynamic Variable Detection:** A regex-based engine automatically scans equations for unique variables (ignoring reserved math terms like `sin` or `log`) and generates UI controls for them on the fly.

### 🎚️ Reactive & "Self-Cleaning" UI
- **Infinite Equation Workspace:** Add as many functions as you need; the UI scales automatically.
- **Smart Sliders:** Variables automatically generate a "Control Module" with a precise range slider, current value readout, and adjustable min/max/step boundaries.
- **State Preservation:** A custom `sliderCache` memory object remembers your variable settings even if you temporarily delete a variable from your equation.
- **Self-Cleaning:** Empty equation cards automatically remove themselves when you click away, keeping the workspace tidy while always providing a fresh input at the bottom.

---

# 🧱 Tech Stack
**100% Vanilla**
- HTML5 
- CSS3 (Flexbox/Grid Layouts)
- Vanilla JavaScript (ES6+)
- HTML5 Canvas API

---

# 📦 Modular Architecture

The monolithic script has been refactored into a clean, separation-of-concerns architecture:

```text
index.html
style.css
src/
  |- Scripts/
      |- core.js         # Central state management (GraphCore), dimensions, and ranges
      |- graphUtils.js   # Math parsing, coordinate transforms, and canvas drawing helpers
      |- graph.js        # Axes generation, grid plotting, and the main update loop
      |- listeners.js    # DOM event bindings, scroll-wheel logic, and resize handling
tests/                 # Future unit testing suite
CHANGELOG.md           # Version history
README.md
LICENSE