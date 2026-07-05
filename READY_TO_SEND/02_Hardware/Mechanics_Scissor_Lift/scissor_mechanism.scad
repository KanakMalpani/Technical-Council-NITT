// Parametric CAD source for a parallel dual scissor mechanism.
// Open in OpenSCAD, press F6 to render, and export STL parts as needed.

$fn = 72;

link_length = 150;
link_width = 30;
link_thickness = 6;
hole_diameter = 10;
pin_diameter = 9.8;
base_length = 220;
base_width = 115;
plate_thickness = 8;
slot_length = 92;

module rounded_link() {
  difference() {
    hull() {
      translate([-link_length / 2 + link_width / 2, 0, 0])
        cylinder(h = link_thickness, d = link_width);
      translate([link_length / 2 - link_width / 2, 0, 0])
        cylinder(h = link_thickness, d = link_width);
    }
    for (x = [-link_length / 2 + 15, 0, link_length / 2 - 15]) {
      translate([x, 0, -1])
        cylinder(h = link_thickness + 2, d = hole_diameter);
    }
  }
}

module pin(height = 28) {
  color("#a7b0b2")
    cylinder(h = height, d = pin_diameter);
}

module slotted_plate(z = 0) {
  color("#10201b")
  difference() {
    translate([-base_length / 2, -base_width / 2, z])
      cube([base_length, base_width, plate_thickness]);
    for (y = [-32, 32]) {
      translate([-78, y, z - 1])
        cylinder(h = plate_thickness + 2, d = hole_diameter);
      hull() {
        translate([32, y, z - 1])
          cylinder(h = plate_thickness + 2, d = hole_diameter);
        translate([32 + slot_length, y, z - 1])
          cylinder(h = plate_thickness + 2, d = hole_diameter);
      }
    }
  }
}

module top_platform(z = 92) {
  color("#f4b63f")
  difference() {
    translate([-base_length / 2, -base_width / 2, z])
      cube([base_length, base_width, plate_thickness]);
    for (y = [-32, 32]) {
      translate([-56, y, z - 1])
        cylinder(h = plate_thickness + 2, d = hole_diameter);
      translate([74, y, z - 1])
        cylinder(h = plate_thickness + 2, d = hole_diameter);
    }
  }
}

module x_unit(y = 0) {
  translate([0, y, 42]) {
    color("#147c72")
      rotate([0, 0, 28])
        rounded_link();
    color("#e85d4f")
      rotate([0, 0, -28])
        rounded_link();
    translate([0, 0, -8])
      pin(32);
  }
}

module assembly() {
  slotted_plate(0);
  top_platform(92);
  x_unit(-32);
  x_unit(32);

  // Cross bracing rods keep the two X units parallel during motion.
  color("#a7b0b2") {
    translate([0, -32, 50])
      rotate([90, 0, 0])
        cylinder(h = 64, d = 7);
    translate([74, -32, 96])
      rotate([90, 0, 0])
        cylinder(h = 64, d = 7);
    translate([-56, -32, 10])
      rotate([90, 0, 0])
        cylinder(h = 64, d = 7);
  }
}

assembly();
