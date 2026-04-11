# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.2.0] - 2026-04-11
### Added
- Implemented an infinite dynamic card generator to replace the hardcoded 5-slot limit.
- Added a regex-based variable parser (`/[a-z]/gi`) that automatically detects custom variables in equations (ignoring reserved words like `sin`, `cos`, `x`, `y`) and generates UI sliders for them.
- Built a state management system (`sliderCache`) to preserve user-defined values, limits (min/max), and step sizes while actively typing or editing equations.
- Added "Self-Cleaning" UI logic: empty equation cards automatically delete themselves when they lose focus, ensuring the sidebar stays uncluttered while always preserving one empty card at the bottom.

### Changed
- Redesigned the variable slider UI into a vertical "Control Module" using Flexbox, placing the variable value above the slider and the min/max/step settings cleanly below.
- Refactored the graphing engine (`updateGraph` and `plotLine`) to abandon the hardcoded `PLOTS` array; it now dynamically scans the DOM for `.card` elements and renders them.
- Updated equation string replacement to pull values directly from the `sliderCache` memory object rather than hunting for hardcoded DOM IDs.
- Stripped the massive, hardcoded `inputs` array out of `listeners.js`; event listeners are now attached dynamically at the moment of element creation.

### Fixed
- Fixed critical script initialization crashes ("canvas is null") by removing conflicting `async` attributes and strictly using `defer` for proper load order.
- Fixed a slider "snapping" bug that rounded decimals to integers by strictly assigning the HTML `step` attribute before `min`, `max`, and `value`.
- Prevented duplicate sliders from generating when a variable is typed multiple times in one equation (e.g., `y=ax+a`) by passing matches through a unique `Set`.
- Fixed the canvas not redrawing on new cards by properly binding `Graph.updateGraph()` to all dynamically generated text inputs and range sliders.

## [1.1.0] - 2025-11-22
### Added
- Created a new `src/` folder to organize all project source files.
- Moved all JavaScript modules into `src/Scripts/`:
  - `core.js` — central canvas/range state, exposed via `GraphCore`.
  - `graphUtils.js` — drawing helpers, coordinate transforms, point plotting, equation parsing.
  - `graph.js` — axes rendering, grid generation, plotting logic, `updateGraph` / `resizeCanvas`.
  - `listeners.js` — DOM input handlers, resize listener, scroll-wheel zoom.
- Added a `test/` directory for future automated tests (unit tests, integration tests, regression tests, etc.).
- Added project-level files:
  - `.gitignore` — ignoring build artifacts, OS clutter, and editor junk.
  - `LICENSE` — project licensing file.
  - `README.md` — documentation for setup, usage, and project structure.
- Added scroll-wheel zooming that automatically adjusts graph step size.
- Added centralized global objects (`GraphCore` and `Graph`) to be shared cleanly across modules.

### Changed
- Refactored the original monolithic `script.js` into four maintainable modules with clear responsibilities.
- Rebuilt grid rendering so major/minor gridlines use `step` and `step / 4` for consistent resolution.
- Updated Y-axis labeling logic:
  - Skip labels near zero using `if (y < step && y > -step)` to remove clutter.
  - Use decimal precision (`toFixed(2)` / `toFixed(4)`) when zoomed in.
- Improved resizing behavior: canvas size and drawing buffer now update dynamically to prevent blur/stretching.
- Consolidated all plot configuration (`PLOTS` array) inside `graph.js`.

### Fixed
- Eliminated race conditions where listeners loaded before the graph system, which caused errors like `Graph is not defined`.
- Fixed global namespace conflicts from mixing `GraphState`, `GraphCore`, `Graph`.
- Fixed implicit function parsing inconsistencies by improving equation normalization in `graphUtils.js`.
- Ensured consistent world-to-canvas coordinate mapping after zooming or resizing.


## [1.0.5] - 2025-11-21

### Added
- Ability to zoom in and ouut with scroll wheel on the graph.

### Changed
- Update general Ui look and remove Settings bar.


### Fixed
- Small variables and structures for the new scroll method

## [1.0.4] - 2025-11-21

### Changed
- Updated axis range calculations (xMin, xMax, yMin, yMax) to use parseFloat and Math.floor/ceil instead of parseInt to fully support decimal step sizes.
- Reworked major gridline loops to increment directly by step rather than iterating by integers and using modulo checks.
- Axis label positions now use fixed pixel offsets relative to the actual axis location (toCanvasX(0) / toCanvasY(0)), preventing labels from drifting when using fractional steps or dynamic canvas sizes.

### Fixed
- Resolved freezing/crashing caused by invalid or zero step values by adding validation and fallback handling.
- Fixed axis labels drifting upward/downward when using decimal steps due to world-space offsets; labels now remain stable across all zoom levels.
- Fixed floating-point stepping issues by adding small epsilon (1e-9) to loop end conditions to avoid infinite loops or skipped lines.

## [1.0.3] - 2025-11-16
### Added
- Dynamic window resize listener to keep the graph updated automatically.

### Changed
- Updated UI placeholder values and variable names.
- Increased minor gridline density for smoother curve rendering.

### Fixed
- General minor issues.

## [1.0.2] - 2025-11-16
### Added
- Scrollbar support for the .settings panel.

### Changed
- Updated .settings layout and overflow behavior to better match the plotter panel.

### Fixed
- Fixed clipping issues where .settings content could be cut off on certain screen sizes.

## [1.0.1] - 2025-11-16
### Added
- Added a resizeCanvas() function that dynamically recalculates canvas width and height based on viewport changes.
- Implemented fully responsive graph scaling (recalculates scale, offsets, and redraws on window resize).

### Changed
- Updated CSS layout so the canvas correctly fills the remaining viewport height (vh) and scales proportionally at all window sizes.
- Modified script.js pathways to ensure proper dynamic scaling, preventing stretching/squishing of drawn elements.
- Updated coordinate-mapping logic to use unified scaling and viewport offsets for pixel-accurate rendering.
- Improved layout structure so the graph area and function panel resize independently without overflowing.

### Fixed
- Fixed canvas squishing/stretching issues caused by mismatched aspect ratios during resize.
- Fixed broken height behavior when shrinking the browser window.
- Fixed resolution mismatch when the canvas size changed, ensuring clean and accurate redraws.


## [1.0.0] - 2025-11-16
### Added
- added a resize graph function

### Changed
- Updated `drawAxes` to display major gridlines (step lines) in black and four minor gridlines between each step in light gray.
- Reordered the rendering pipeline in `drawAxes` to:  
  1. draw minor gridlines  
  2. draw major gridlines  
  3. draw axis labels  
  4. draw axes  
  5. draw points and plotted functions  
  This ensures proper layering and visual clarity.
- updated css to allow the canvas to scale to vh size acuratly
-

### Fixed
- None