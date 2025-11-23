# Desmos Clone (Alpha v1.0)

A lightweight graphing calculator built entirely with **vanilla JavaScript**, **HTML**, and **CSS**.  
This project is designed to emulate core Desmos functionality while staying simple, understandable,  
and hackable — perfect for learning graphical math programming, canvas rendering, expression parsing,  
and interactive UI design.

---

# 📸 Preview
*(Optional screenshot here — I can generate one for you if you want.)*

---

# ✨ Features (v1.0)

### 🎨 Canvas-Based Rendering
- Fully dynamic graph rendering using HTML `<canvas>`
- X/Y axes with adjustable bounds
- Major gridlines (dark) + minor gridlines (light)
- Automatic redrawing on input changes
- Supports arbitrary graph sizes and responsive layouts

### 🧮 Expression Evaluation
- Parse and graph basic algebraic expressions
- Supports `x`, powers (e.g., `x^2`), constants, and simple arithmetic
- Replaces `a`, `b`, `c` with slider values dynamically

### 🎚️ Interactive UI
- Dynamic cards with:
  - Text input for equation
  - Sliders for parameters (`a`, `b`, `c`)
  - Live-updating UI text
- Expandable “settings panel”
- Scroll-to-zoom (centered on the graph)

### ⚙️ Utility Functions
- Coordinate transforms (`toCanvasX`, `toCanvasY`)
- Line drawing utilities
- Automatic scaling & resizing handlers

---

# 🧱 Tech Stack
**Current Version Uses:**
- HTML  
- CSS  
- Vanilla JavaScript  
- HTML Canvas API  
- DOM-based UI

**Planned for v2+**
- React  
- React Hooks  
- React Context  
- Vite or Next.js  
- Modular parser  
- Unit tests (Jest)  
- E2E tests (Playwright)  

---

# 📦 Folder Structure (v1)

index.html
src/
  |- script.js
  |- style.css
  |- utils/
  |- parser/
tests/
docs/
CHANGELOG.md
README.md
LICENSE
.gitignore

---

# 🧪 **6. Comprehensive Testing Suite**
Projects like this *shine* with testing — and React makes it easier.

### Planned Tools:
- **Jest** — unit tests for math & parsing
- **React Testing Library** — render + interaction tests
- **Playwright** — end-to-end browser testing

### What to test:
- Parser correctness
- Plot accuracy
- UI interactions
- Slider → equation updates
- Major/minor gridline spacing correctness

---

# 🎨 **7. UI Enhancement & Next-Level Polish**
- Full mobile support
- Better responsive scaling
- Animations using CSS or Framer Motion
- Draggable cards
- Collapsible menu
- Undo / redo history

---

# 🔌 **8. Plugin Architecture for Functions (Optional v3 idea)**
Imagine allowing users to write their own functions:

f(x) = sin(2x) + g(x)


Custom definitions require:
- User function registry
- Dependency tracking
- Recursive AST resolution

---

# 🧠 Notes on Long-Term Vision (v3+)
- Add 3D graphing (`z = f(x,y)`)
- Add parametric mode (`x(t)`, `y(t)`)
- Add piecewise functions
- Add inequalities shading
- Add polar coordinates
- Add Riemann sums, integrals, derivative visualization

---

# 🛠️ Running the Project (v1)

1. Clone the repo:
- git clone <Desmos-Clone>

2. Open the HTML file:
index.html

No build steps required.

---

# 📜 License
MIT License — free to use, modify, distribute, and learn from.

---

# ✨ Author
Created by **Riley Thompson**  
College CS major | Python + JavaScript Developer | UI/Canvas Rendering Enthusiast

---

