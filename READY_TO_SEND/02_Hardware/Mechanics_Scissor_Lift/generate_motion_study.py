from math import cos, sin, radians
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


OUT = Path(__file__).resolve().parent
W, H = 900, 620
INK = "#10201b"
TEAL = "#147c72"
CORAL = "#e85d4f"
GOLD = "#f4b63f"
PAPER = "#f7f2e8"
LINE = "#ded6c5"
STEEL = "#a7b0b2"


def font(size, bold=False):
    path = "C:/Windows/Fonts/arialbd.ttf" if bold else "C:/Windows/Fonts/arial.ttf"
    try:
        return ImageFont.truetype(path, size=size)
    except OSError:
        return ImageFont.load_default()


def point(cx, cy, length, angle):
    return (cx + length * cos(angle), cy + length * sin(angle))


def draw_link(draw, p1, p2, color):
    draw.line((p1, p2), fill=color, width=24)
    for p in (p1, p2):
      draw.ellipse((p[0] - 16, p[1] - 16, p[0] + 16, p[1] + 16), fill=color)
      draw.ellipse((p[0] - 6, p[1] - 6, p[0] + 6, p[1] + 6), fill=PAPER)


def frame(angle_deg):
    img = Image.new("RGB", (W, H), PAPER)
    draw = ImageDraw.Draw(img)
    draw.rounded_rectangle((42, 42, W - 42, H - 42), radius=8, outline=LINE, width=3)
    draw.text((70, 66), "Parallel Dual Scissor Mechanism", fill=INK, font=font(32, True))
    draw.text((70, 106), f"Driven slider motion - link angle {angle_deg} deg", fill="#5b6762", font=font(20))

    base_y = 500
    center_x = 450
    link_half = 165
    angle = radians(angle_deg)
    lift = 2 * link_half * sin(angle)
    top_y = base_y - lift

    draw.rounded_rectangle((145, base_y + 14, 755, base_y + 44), radius=8, fill=INK)
    draw.rounded_rectangle((185, top_y - 44, 715, top_y - 14), radius=8, fill=GOLD)

    for offset, shade in [(-95, TEAL), (95, CORAL)]:
        cx = center_x
        cy = (base_y + top_y) / 2
        left_base = point(cx, cy, link_half, radians(180 + angle_deg))
        right_top = point(cx, cy, link_half, radians(angle_deg))
        right_base = point(cx, cy, link_half, radians(-angle_deg))
        left_top = point(cx, cy, link_half, radians(180 - angle_deg))

        left_base = (left_base[0], left_base[1] + offset * 0.12)
        right_top = (right_top[0], right_top[1] + offset * 0.12)
        right_base = (right_base[0], right_base[1] + offset * 0.12)
        left_top = (left_top[0], left_top[1] + offset * 0.12)

        draw_link(draw, left_base, right_top, shade)
        draw_link(draw, right_base, left_top, shade)
        draw.ellipse((cx - 9, cy + offset * 0.12 - 9, cx + 9, cy + offset * 0.12 + 9), fill=STEEL)

    draw.line((320, (base_y + top_y) / 2 - 12, 580, (base_y + top_y) / 2 - 12), fill=STEEL, width=7)
    draw.text((70, 548), "Base slots guide the lower sliding pivots; revolute joints keep both X-units synchronized.", fill="#5b6762", font=font(18))
    return img


def build():
    angles = list(range(18, 48, 3)) + list(range(48, 18, -3))
    frames = [frame(angle) for angle in angles]
    frames[0].save(
        OUT / "scissor_motion_study.gif",
        save_all=True,
        append_images=frames[1:],
        duration=120,
        loop=0,
    )
    frames[0].save(OUT / "scissor_motion_study_preview.png")
    print(OUT / "scissor_motion_study.gif")


if __name__ == "__main__":
    build()
