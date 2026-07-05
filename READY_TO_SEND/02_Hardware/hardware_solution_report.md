# Hardware Domain Solution Report

Technical Council Inductions 2026

## Submission Links

| Required Link | Status |
|---|---|
| Wokwi simulation link | https://wokwi.com/projects/468694734454226945 |
| Google Drive mechanics folder link | https://drive.google.com/drive/folders/1sCTAR8JlW_sERKaiwveZCUeVjWEQhshm?usp=sharing |

The local solution files are complete and organized. The links above point to the working Wokwi electronics simulation and the shared Google Drive folder for the mechanics/CAD files.

## Task 1 - Ideation

### Initiative Name

NIT-T Hardware Foundry

### One-Line Pitch

NIT-T Hardware Foundry is a 300-student beginner-to-builder prototype accelerator where first-years turn curiosity into working campus hardware solutions, then grow into the next generation of Technical Council builders and mentors.

### Problem

Many first-year students are curious about electronics, robotics, embedded systems, CAD, mechanisms, and product design, but hardware often feels intimidating because mistakes are physical. A beginner may face loose wiring, sensor noise, unclear power connections, bad tolerances, tool safety, or the fear of damaging components.

This prevents many capable students from even trying hardware early.

The Foundry addresses three barriers:

- They do not know where to begin.
- They are afraid of failing or breaking things.
- They do not have a safe, exciting, guided path from curiosity to a working prototype.

### Solution

Hardware Foundry combines live demos, reusable hardware kits, studio-cluster build sessions, mentor clinics, campus-problem project tracks, failure logs, documentation, and a public prototype expo.

The goal is not to make every student build the same circuit. The goal is to give students a safe technical boundary and then let their own ideas flow. Teams choose problems, propose solutions, simplify them into minimum working prototypes, and receive support whenever they get stuck.

The full end-to-end plan is included separately as:

- `NITT_Hardware_Foundry_Ultimate_Guide.pdf`
- `NITT_Hardware_Foundry_Ultimate_Guide.md`

### Target Audience

- 300 first-year students in Year 1.
- Students from all branches, including absolute beginners.
- Students interested in electronics, robotics, embedded systems, CAD, sustainability, accessibility, product design, or campus problem-solving.
- Students who may become future Technical Council hardware contributors and mentors.

### Scale and Three-Year Goal

| Year | Student Reach | Teams | Goal |
|---|---:|---:|---|
| Year 1 | 300 | 60 | Prove the studio-cluster model and create the first Foundry Fellows |
| Year 2 | 500 | 100 | Expand through trained Fellows, better kits, and more tracks |
| Year 3 | 700 | 140 | Make Hardware Foundry a campus-wide beginner hardware pipeline |

### Operating Model

The event uses a distributed studio system instead of trying to place all 300 students into one build room.

- 300 students.
- 60 teams.
- 5 students per team.
- 10 studio clusters.
- 6 teams per studio cluster.
- All teams attend the launch and expo.
- Hands-on build sessions happen in staggered studio clusters.

### Core Organizing Team

The initiative can be conducted by fewer than 20 core organizers.

| Role | Count | Responsibility |
|---|---:|---|
| Program Director | 1 | Overall ownership, permissions, final quality |
| Operations Lead | 1 | Calendar, venue schedule, participant flow |
| Electronics Stream Leads | 3 | Sensors, Arduino/ESP32, displays, debugging |
| Mechanics/CAD Stream Leads | 3 | CAD, mechanisms, mounting, enclosures |
| Systems Integration Leads | 2 | Power, wiring, reliability, test plans |
| Safety and Inventory Leads | 2 | Kits, component checkout, safety |
| Studio Managers | 3 | Coordinate studio clusters and clinics |
| Documentation and Design Leads | 2 | Project cards, posters, reports, demo storytelling |
| Expo and Outreach Lead | 1 | Publicity, final showcase, guest coordination |
| Total | 18 | Under the 20-person task limit |

### Venue Plan

All venues are permission-dependent candidates and must be confirmed officially before execution.

| Venue Type | Candidate | Use |
|---|---|---|
| Launch venue | Orion / Lecture Hall Complex | Opening, demo night, safety briefing |
| CAD/simulation venue | Octagon / computer facilities | CAD, Wokwi, documentation, BOM clinics |
| Fabrication exposure | Central Workshop | Supervised fabrication demo and prototype guidance |
| Build rooms | Department classrooms / seminar rooms | Studio-cluster build sessions |
| Public expo | SAC / student activity space | Final prototype showcase |
| Continuation support | CEDI / incubation ecosystem | Optional support for promising prototypes |

### Timeline

| Phase | Work |
|---|---|
| Preparation, 3 weeks | Permissions, venues, publicity, registrations, kits, project handbook |
| Week 1 | Opening, safety, live demos, first circuit and sensor sessions |
| Week 2 | Sensors, actuators, CAD, system thinking, debugging basics |
| Week 3 | Idea flow week: campus problem walk, team proposal, mentor review |
| Week 4 | Build sprint: electronics, CAD, systems, and documentation clinics |
| Week 5 | Reliability, enclosure/mounting, test logs, demo rehearsal |
| Week 6 | Foundry Expo, awards, archive, Fellow selection |

### Budget Estimate

| Tier | Estimated Cost | Use Case |
|---|---:|
| Lean | INR 60,000 | Basic reusable kits and minimal fabrication |
| Recommended | INR 1,20,000 | Strong 300-student execution with 60 reusable team kits |
| Premium | INR 2,00,000 | Sponsorship-backed version with better tools, displays, enclosures, and awards |

The cost is feasible because the kits are reusable and become the inventory base for Year 2 and Year 3.

### Project Tracks

- Hostel Intelligence.
- Lab Helper Devices.
- Campus Sustainability.
- Accessibility and Inclusion.
- Micro-Automation.
- Open Wildcard for strong student-originated ideas.

### Final Prototype Family

The broad project family is called `Campus Utility Sentinel`.

Each team builds a small hardware system that:

- Senses one physical condition.
- Makes one decision.
- Communicates one useful output.
- Has a safe enclosure or mounting plan.
- Includes a bill of materials.
- Includes a failure log and next-version plan.

### Expected Outcomes

- 300 first-year students experience hands-on hardware.
- 60 project teams present working or partially working prototypes.
- 60 project folders are archived for future cohorts.
- 30 students are selected as Foundry Fellows for the next year.
- 10 prototypes are shortlisted for continuation.
- The initiative grows toward 700 students per year by Year 3.

### Why It Fits Technical Council

Hardware Foundry directly supports Technical Council's goal of making technology accessible. It is beginner-friendly, economically feasible through reusable kits, scalable through a Fellow pipeline, and capable of creating future hardware leaders rather than one-time workshop attendees.

## Task 2 - Electronics

### Project Name

LCD Campus Runner

### Files

| File | Purpose |
|---|---|
| `Electronics_Infinite_Runner/sketch.ino` | Arduino game code |
| `Electronics_Infinite_Runner/diagram.json` | Wokwi circuit |
| `Electronics_Infinite_Runner/wokwi.toml` | Wokwi project config |
| `Electronics_Infinite_Runner/README.md` | Import steps, pin map, notes |

### What It Does

LCD Campus Runner is a two-button infinite runner game on a non-I2C 16x2 LCD. The player is shown as `#`, obstacles are shown as `*`, and the player changes row using the lane button. The start/restart button starts the game, restarts after game over, and is the only wake source after power-down sleep.

### Controls

| Control | Arduino Pin | Function |
|---|---:|---|
| Lane button | 2 | Toggle player between upper and lower LCD row |
| Start/restart button | 3 | Start game, restart game, wake MCU from sleep |

### LCD Pin Map

| LCD Pin | Arduino Pin |
|---|---:|
| RS | 12 |
| E | 11 |
| D4 | 5 |
| D5 | 4 |
| D6 | 7 |
| D7 | 8 |

### Requirement Mapping

| Requirement | Status | Notes |
|---|---|---|
| Level 0: LCD wiring | Complete | Non-I2C 4-bit LCD wiring is used. Serial Monitor text is echoed to the LCD before the game starts. |
| Level 1: controllable object | Partially adapted | Final task needs only row switching, so the final build uses one lane button instead of four direction buttons. Input is interrupt-based and non-blocking. |
| Level 2: obstacle runner | Complete | Obstacles move right to left, collision detection is implemented, and the game stops on collision. |
| Level 2: no unavoidable two-row wall | Complete | Only one obstacle is active at a time, so the player always has a possible safe row. |
| Level 2/3: power-down mode | Complete | After game over, the MCU enters power-down sleep and the lane interrupt is disabled, so only the restart button wakes it. |
| Level 3: game-over screen | Complete | LCD shows `Game Over!` plus score and high score. |
| Level 3: high score retained while powered | Complete | High score is stored in RAM and preserved while the MCU remains powered. |
| Level 3: true random number attempt | Implemented with limitation | The seed combines floating analog-pin LSB samples with timer jitter. A real circuit can improve this with a physical noise source. |
| Brownie: non-I2C LCD | Complete | Uses `LiquidCrystal` with parallel pins, not an I2C backpack. |
| Brownie: non-blocking buttons | Complete | Buttons use external interrupts; frame timing uses `millis()`. |
| Brownie: manual LCD control without library | Not attempted | I chose `LiquidCrystal` to keep the final solution simple and reliable. |

### Challenges and Solutions

| Challenge | Solution |
|---|---|
| Avoiding blocking button reads | Used interrupts on pins 2 and 3. |
| Preventing impossible obstacle patterns | Generated only one obstacle at a time. |
| Waking only by restart button | Detached the lane interrupt before entering power-down sleep and reattached it after wake. |
| Randomness in simulation | Combined analog noise sampling with timer jitter and documented the Wokwi limitation. |

### Wokwi Instructions

1. Open Wokwi and create an Arduino Uno project.
2. Replace the generated `sketch.ino` with `Electronics_Infinite_Runner/sketch.ino`.
3. Replace `diagram.json` with `Electronics_Infinite_Runner/diagram.json`.
4. Run the simulation.
5. Paste the Wokwi share link in the Submission Links table at the top of this report before uploading.

## Task 3 - Mechanics

### Project Name

Parallel Dual Scissor Lift

### Files

| File | Purpose |
|---|---|
| `Mechanics_Scissor_Lift/scissor_mechanism.scad` | Parametric OpenSCAD CAD model |
| `Mechanics_Scissor_Lift/scissor_motion_study.gif` | Local rendered motion study animation |
| `Mechanics_Scissor_Lift/scissor_motion_study_preview.png` | Preview image |
| `Mechanics_Scissor_Lift/generate_motion_study.py` | Script used to generate the GIF |
| `Mechanics_Scissor_Lift/README.md` | CAD usage and upload instructions |

### Requirement Mapping

| Requirement | Status | Notes |
|---|---|---|
| Level 1: single scissor link | Complete | Link is `150 mm x 30 mm` with `10 mm` end and center pivot holes. |
| Level 1: pins | Complete | Pin module is included with `9.8 mm` practical clearance for `10 mm` holes. |
| Level 2: rectangular base plate | Complete | Base includes fixed pivot holes and linear slots for sliding pivots. |
| Level 2: top platform | Complete | Top platform includes corresponding pivot holes. |
| Level 2: dual parallel X-units | Complete | CAD assembly includes two X-units and bracing rods. |
| Level 3: motion study | Complete locally | A rendered GIF demonstrates extension and retraction. |
| Google Drive upload | Complete | The shared Drive folder link is included in the Submission Links table above. |

### CAD Design Notes

- Link dimensions: `150 mm x 30 mm x 6 mm`.
- Pivot hole diameter: `10 mm`.
- Pin diameter: `9.8 mm` for assembly clearance.
- Base plate: rectangular plate with two fixed pivot locations and two slotted guide paths.
- Top platform: rectangular plate with upper pivot mounting points.
- Cross bracing: rods connect the parallel units to keep the mechanism synchronized.

### Motion Study

The included GIF shows a simple kinematic extension and retraction sequence. For a stricter CAD-software motion study, the same geometry can be recreated or imported into Fusion 360/SolidWorks, using revolute joints at circular pivots and slider joints at the slotted pivots.

### Google Drive Instructions

The mechanics folder has been uploaded and shared through the link in the Submission Links table. The local `Mechanics_Scissor_Lift/` folder remains included with this packet so the evaluator can also inspect the editable CAD/source files directly.

## Final Checklist

| Item | Status |
|---|---|
| Ideation document content | Complete |
| Electronics Wokwi-ready circuit and code | Complete |
| Electronics implementation report | Complete |
| Mechanics CAD source | Complete |
| Mechanics motion study GIF | Complete |
| Wokwi link pasted into report | Complete |
| Google Drive link pasted into report | Complete |
