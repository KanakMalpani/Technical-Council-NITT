# Technical Council Induction - Requirements Alignment Audit

This audit compares the generated work against the four task PDFs.

## Design and Publicity

### PDF Requirements

- Ideate a new Campus Development Initiative.
- Give it a distinctive name and 2-4 line description.
- Create a hype poster as PNG/JPEG and editable source file.
- Create either a 4+ slide Instagram carousel or 30-45 second animated reel.
- Maintain innovation, visual appeal, clarity, consistency, and professional execution.

### Completed Locally

- CDI name: `CampusPulse`.
- Description and design rationale: `Design and Publicity/Campuspulse Assets/design_brief.md`.
- Hype poster export: `Design and Publicity/Campuspulse Assets/campuspulse_hype_poster.png`.
- Hype poster editable source: `Design and Publicity/Campuspulse Assets/campuspulse_hype_poster.svg`.
- 4-slide carousel exports: `carousel_slide_1.png` to `carousel_slide_4.png`.
- Carousel editable sources: `carousel_slide_1.svg` to `carousel_slide_4.svg`.
- Generation source: `generate_design_assets.py`.

### Status

Aligned. Ready to submit after optionally reviewing the visuals once on your own screen.

## Hardware

### PDF Requirements

- Ideate a feasible hardware event/initiative and submit details as a PDF.
- Electronics: Wokwi Arduino simulation for LCD infinite runner, with report and link.
- Mechanics: CAD scissor mechanism files, report, rendered video, and Google Drive link.

### Completed Locally

- Hardware report Markdown: `Hardware/hardware_solution_report.md`.
- Hardware report PDF: `Hardware/hardware_solution_report.pdf`.
- Full ideation guide PDF: `Hardware/NITT_Hardware_Foundry_Ultimate_Guide.pdf`.
- Arduino code: `Hardware/Electronics_Infinite_Runner/sketch.ino`.
- Wokwi diagram: `Hardware/Electronics_Infinite_Runner/diagram.json`.
- Electronics README: `Hardware/Electronics_Infinite_Runner/README.md`.
- OpenSCAD CAD source: `Hardware/Mechanics_Scissor_Lift/scissor_mechanism.scad`.
- Mechanics README: `Hardware/Mechanics_Scissor_Lift/README.md`.
- Local motion study animation: `Hardware/Mechanics_Scissor_Lift/scissor_motion_study.gif`.
- Motion study preview: `Hardware/Mechanics_Scissor_Lift/scissor_motion_study_preview.png`.

### Still Needed Before Final Submission

- Create the Wokwi project online using `sketch.ino` and `diagram.json`.
- Paste the Wokwi link into `Hardware/hardware_solution_report.md`.
- Regenerate `Hardware/hardware_solution_report.pdf`.
- Upload CAD/project files and the generated motion study GIF to Google Drive, set access to anyone with the link, and paste the Drive link into the report.

### Status

Mostly aligned locally. External Wokwi and Google Drive links still need your account action.

## Marketing and Content

### PDF Requirements

- Identify 10 companies realistic for Technical Council sponsorship/collaboration.
- Provide 2 contact points each with LinkedIn, email ID, and phone number.
- Draft a concise sponsorship proposal from Technical Council's perspective.
- Write a catchy SMC for a major past Technical Council event.
- Submit tasks as a PDF containing leads, 18-20 page sponsorship proposal, and SMC.

### Completed Locally

- Lead sheet: `Marketing and Content/Sponsorship_Package/sponsorship_leads.csv`.
- SMC source: `Marketing and Content/Sponsorship_Package/smc_caption.md`.
- Generated PDF: `Marketing and Content/Sponsorship_Package/technical_council_marketing_submission.pdf`.
- PDF page count verified: 20 pages.

### Note

Some companies do not publish direct public phone numbers or individual emails for all teams. The lead sheet uses official company-level contact routes and official forms where needed instead of inventing private details. This is more professional, but if the evaluators strictly require a literal email and phone in every row, those rows should be manually enriched with verified contacts before submission.

### Status

Aligned in structure and page count. Contact completeness should be reviewed once manually before sending.

## Software

### PDF Requirements

- Conceptualize a new CDI.
- Identify the problem and introduce the solution.
- Optional Figma file.
- Develop a complete solution.
- Dockerize and deploy using any cloud hosting service.
- Push repository to public GitHub.
- Add README with setup instructions, endpoints, and features.

### Completed Locally

- Software deliverables are kept only in the Software folder.
- Ready packet: `..\Software\READY_TO_SEND`.
- Ready zip: `..\Software\READY_TO_SEND\Software_CampusPulse_READY_TO_SEND.zip`.
- Software-specific audit: `..\Software\READY_TO_SEND\software_requirements_alignment_audit.md`.

### Still Needed Before Final Submission

- Push `..\Software\READY_TO_SEND\campuspulse` or `..\Software\campuspulse` to a public GitHub repository.
- Deploy it to a cloud host such as Render, Railway, Fly.io, or similar.
- Add the public GitHub link and live deployment link to the final submission form.
- Optional: create a Figma mockup if you want extra design polish, though the PDF marks it optional.

### Status

Ready locally. GitHub and deployment require your account action.

## Overall

The generated work aligns with the task PDFs as local solution drafts. The only remaining gaps are external submission links that require authenticated services: Wokwi, Google Drive, GitHub, and cloud hosting.
