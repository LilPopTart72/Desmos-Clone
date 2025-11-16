# Changelog
All notable changes to this project will be documented in this file.

## [Unreleased]

## [1.0.0] - 2025-11-16
### Added
- None

### Changed
- Updated `drawAxes` to display major gridlines (step lines) in black and four minor gridlines between each step in light gray.
- Reordered the rendering pipeline in `drawAxes` to:  
  1. draw minor gridlines  
  2. draw major gridlines  
  3. draw axis labels  
  4. draw axes  
  5. draw points and plotted functions  
  This ensures proper layering and visual clarity.

### Fixed
- None