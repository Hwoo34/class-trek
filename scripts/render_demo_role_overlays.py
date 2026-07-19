from pathlib import Path

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT = ROOT / "artifacts" / "demo-role-overlays-v6"
FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
REGULAR_FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"

COLORS = {
    "teacher": (139, 92, 246, 255),
    "student": (34, 211, 238, 255),
    "display": (251, 146, 60, 255),
}

CAPTION_SAFE_ZONE = (84, 584, 1196, 704)


def preserve_caption_layer(image):
    """Keep role borders out of the baked-in subtitle panel."""
    image.paste((0, 0, 0, 0), CAPTION_SAFE_ZONE)


def label(draw, xy, text, color):
    font = ImageFont.truetype(FONT, 16)
    x, y = xy
    bounds = draw.textbbox((0, 0), text, font=font)
    width = bounds[2] - bounds[0] + 38
    draw.rounded_rectangle(
        (x, y, x + width, y + 34),
        radius=10,
        fill=(8, 25, 40, 235),
        outline=color,
        width=2,
    )
    draw.ellipse((x + 10, y + 12, x + 18, y + 20), fill=color)
    draw.text((x + 24, y + 8), text, font=font, fill=(255, 255, 255, 255))


def triptych():
    image = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rectangle((2, 160, 703, 558), outline=COLORS["student"], width=5)
    draw.rectangle((704, 20, 1277, 343), outline=COLORS["teacher"], width=5)
    draw.rectangle((704, 343, 1277, 717), outline=COLORS["display"], width=5)
    label(draw, (18, 174), "STUDENT DEVICE · NOVA", COLORS["student"])
    label(draw, (720, 82), "TEACHER MISSION CONTROL", COLORS["teacher"])
    label(draw, (720, 356), "CLASSROOM DISPLAY", COLORS["display"])
    preserve_caption_layer(image)
    image.save(OUTPUT / "triptych.png")


def student_focus():
    image = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rectangle((4, 4, 1275, 715), outline=COLORS["student"], width=7)
    label(draw, (1018, 82), "STUDENT DEVICE · NOVA", COLORS["student"])
    preserve_caption_layer(image)
    image.save(OUTPUT / "student-focus.png")


def teacher_with_display():
    image = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rectangle((3, 3, 1276, 716), outline=COLORS["teacher"], width=5)
    draw.rectangle((888, 83, 1253, 286), outline=COLORS["display"], width=5)
    label(draw, (30, 82), "TEACHER MISSION CONTROL", COLORS["teacher"])
    label(draw, (905, 94), "CLASSROOM DISPLAY", COLORS["display"])
    preserve_caption_layer(image)
    image.save(OUTPUT / "teacher-with-display.png")


def three_columns():
    image = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rectangle((2, 3, 425, 716), outline=COLORS["teacher"], width=6)
    draw.rectangle((426, 3, 851, 716), outline=COLORS["student"], width=6)
    draw.rectangle((852, 3, 1277, 716), outline=COLORS["display"], width=6)
    label(draw, (44, 82), "TEACHER", COLORS["teacher"])
    label(draw, (470, 82), "STUDENT · NOVA", COLORS["student"])
    label(draw, (896, 82), "CLASS DISPLAY", COLORS["display"])
    preserve_caption_layer(image)
    image.save(OUTPUT / "three-columns.png")


def caption(filename, lines):
    image = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    font = ImageFont.truetype(REGULAR_FONT, 27)
    top = 594 if len(lines) == 2 else 626
    draw.rounded_rectangle(
        (90, top, 1190, 698),
        radius=18,
        fill=(8, 25, 40, 226),
        outline=(49, 227, 206, 210),
        width=2,
    )
    y = top + 15
    for line in lines:
        bounds = draw.textbbox((0, 0), line, font=font)
        x = (1280 - (bounds[2] - bounds[0])) / 2
        draw.text((x, y), line, font=font, fill=(255, 255, 255, 255))
        y += 38
    draw.rounded_rectangle(
        (24, 22, 486, 76),
        radius=15,
        fill=(8, 25, 40, 255),
    )
    label(draw, (28, 26), "TREK EXCHANGE · REMIX & LAUNCH", COLORS["teacher"])
    image.save(OUTPUT / filename)


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    triptych()
    student_focus()
    teacher_with_display()
    three_columns()
    caption(
        "exchange-caption-1.png",
        [
            "Open Trek Exchange.",
            "Discover reviewed Treks, ranked and shared by the community.",
        ],
    )
    caption(
        "exchange-caption-2.png",
        [
            "Remix any Trek for your class.",
            "Student-made Treks require teacher approval.",
        ],
    )
    print(f"Saved role overlays to {OUTPUT}")


if __name__ == "__main__":
    main()
