# Mechanics Task - Parallel Dual Scissor Mechanism

This folder contains an OpenSCAD source model for the scissor mechanism task.

## Implemented

- Single scissor link with dimensions `150 mm x 30 mm`.
- Three `10 mm` pivot holes per link: two end holes and one center hole.
- Parametric pins sized at `9.8 mm` for practical clearance in `10 mm` holes.
- Rectangular base plate with fixed pivot holes and linear slots for sliding pivots.
- Rectangular top platform with corresponding pivot holes.
- Two parallel X-units connected by bracing rods.

## How To Use

1. Open `scissor_mechanism.scad` in OpenSCAD.
2. Press F5 for preview or F6 for full render.
3. Export STL files for individual parts if fabrication is required.
4. Use the included GIF for the local motion study, or recreate the assembly in Fusion 360/SolidWorks for a stricter joint-based CAD animation.

## Suggested Motion Study

For a CAD motion study in Fusion 360 or SolidWorks:

1. Import or recreate the link, pin, base, and platform parts.
2. Add revolute joints at all circular pivots.
3. Add slider joints for the base and platform slotted pivots.
4. Drive one slider joint from `0 mm` to approximately `75 mm`.
5. Render a 10-15 second animation showing lift extension and retraction.

This folder also includes a generated local motion study:

- `scissor_motion_study.gif`
- `scissor_motion_study_preview.png`

## Submission Note

The final task PDF asks for a Google Drive link containing project files and the rendered animation. This folder is ready to upload. Add the Drive link to the final hardware report after uploading.
