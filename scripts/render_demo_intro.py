from pathlib import Path
import math
import random

from PIL import Image, ImageDraw, ImageFilter, ImageFont


ROOT = Path(__file__).resolve().parents[1]
OUTPUT_DIR = ROOT / "artifacts" / "demo-intro-v3"
LANDING_PATH = ROOT / "artifacts" / "video-v3" / "landing.png"

WIDTH = 1280
HEIGHT = 720
FPS = 30
DURATION = 13.24

FONT_REGULAR = "/System/Library/Fonts/Supplemental/Arial.ttf"
FONT_BOLD = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"
FONT_BLACK = "/System/Library/Fonts/Supplemental/Arial Black.ttf"


def clamp(value, low=0.0, high=1.0):
    return max(low, min(high, value))


def ease_out_cubic(value):
    value = clamp(value)
    return 1 - (1 - value) ** 3


def ease_in_out(value):
    value = clamp(value)
    return value * value * (3 - 2 * value)


def window_alpha(time, start, end, fade=0.35):
    return min(
        clamp((time - start) / fade),
        clamp((end - time) / fade),
    )


def centered_text(layer, text, font, y, fill, alpha=255, tracking=0):
    draw = ImageDraw.Draw(layer)
    if tracking == 0:
        bounds = draw.textbbox((0, 0), text, font=font)
        x = (WIDTH - (bounds[2] - bounds[0])) / 2
        draw.text((x, y), text, font=font, fill=(*fill, int(alpha)))
        return

    widths = [draw.textlength(character, font=font) for character in text]
    total = sum(widths) + tracking * (len(text) - 1)
    x = (WIDTH - total) / 2
    for character, character_width in zip(text, widths):
        draw.text((x, y), character, font=font, fill=(*fill, int(alpha)))
        x += character_width + tracking


def make_gradient():
    image = Image.new("RGB", (WIDTH, HEIGHT))
    pixels = image.load()
    top = (5, 20, 34)
    bottom = (25, 10, 39)
    for y in range(HEIGHT):
        ratio = y / (HEIGHT - 1)
        color = tuple(
            int(top[channel] * (1 - ratio) + bottom[channel] * ratio)
            for channel in range(3)
        )
        for x in range(WIDTH):
            pixels[x, y] = color
    return image


def add_mars(frame, time):
    mars = Image.new("RGBA", (520, 520), (0, 0, 0, 0))
    draw = ImageDraw.Draw(mars)
    center = (260, 260)
    radius = 220

    for current in range(radius, 0, -1):
        ratio = current / radius
        light = 1 - ratio
        color = (
            int(213 + 26 * light),
            int(79 + 38 * light),
            int(52 + 25 * light),
            255,
        )
        draw.ellipse(
            (
                center[0] - current,
                center[1] - current,
                center[0] + current,
                center[1] + current,
            ),
            fill=color,
        )

    random.seed(19)
    for _ in range(34):
        angle = random.random() * math.tau
        distance = math.sqrt(random.random()) * 170
        x = center[0] + math.cos(angle) * distance
        y = center[1] + math.sin(angle) * distance
        crater = random.randint(4, 18)
        draw.ellipse(
            (x - crater, y - crater, x + crater, y + crater),
            fill=(122, 45, 43, random.randint(35, 85)),
        )

    highlight = Image.new("RGBA", mars.size, (0, 0, 0, 0))
    highlight_draw = ImageDraw.Draw(highlight)
    highlight_draw.ellipse((100, 74, 250, 224), fill=(255, 214, 151, 100))
    highlight = highlight.filter(ImageFilter.GaussianBlur(34))
    mars = Image.alpha_composite(mars, highlight)

    scale = 0.86 + 0.03 * math.sin(time * 0.6)
    mars = mars.resize((int(520 * scale), int(520 * scale)), Image.Resampling.LANCZOS)
    x = int(940 - mars.width / 2 + math.sin(time * 0.28) * 18)
    y = int(390 - mars.height / 2 + math.cos(time * 0.32) * 12)
    frame.alpha_composite(mars, (x, y))


def add_orbits(frame, time):
    layer = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for index, radius in enumerate((300, 390, 485)):
        alpha = 36 - index * 8
        box = (
            940 - radius,
            390 - radius * 0.42,
            940 + radius,
            390 + radius * 0.42,
        )
        draw.ellipse(box, outline=(74, 241, 220, alpha), width=2)
        angle = time * (0.7 - index * 0.12) + index
        dot_x = 940 + math.cos(angle) * radius
        dot_y = 390 + math.sin(angle) * radius * 0.42
        draw.ellipse(
            (dot_x - 5, dot_y - 5, dot_x + 5, dot_y + 5),
            fill=(74, 241, 220, 170),
        )
    frame.alpha_composite(layer)


def add_stars(frame, time):
    random.seed(56)
    layer = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    for index in range(88):
        x = random.randrange(0, WIDTH)
        y = random.randrange(0, HEIGHT)
        size = random.choice((1, 1, 1, 2))
        alpha = int(45 + 80 * (0.5 + 0.5 * math.sin(time * 1.8 + index)))
        draw.ellipse((x, y, x + size, y + size), fill=(220, 246, 255, alpha))
    frame.alpha_composite(layer)


def add_logo(frame, time):
    if time < 2.8:
        return

    progress = ease_out_cubic((time - 2.8) / 0.72)
    layer = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    title_font = ImageFont.truetype(FONT_BLACK, int(92 + 10 * (1 - progress)))
    small_font = ImageFont.truetype(FONT_BOLD, 18)

    if time < 10.1:
        title_y = int(238 - 20 * (1 - progress))
        centered_text(layer, "ClassTrek", title_font, title_y, (255, 255, 255), 255 * progress)
        centered_text(
            layer,
            "A LIVE LEARNING TREK",
            small_font,
            title_y + 120,
            (74, 241, 220),
            230 * progress,
            tracking=5,
        )
    else:
        move = ease_in_out((time - 10.1) / 0.7)
        draw.text(
            (80 - 8 * (1 - move), 92),
            "ClassTrek",
            font=ImageFont.truetype(FONT_BLACK, 62),
            fill=(255, 255, 255, int(255 * move)),
        )
        draw.text(
            (83, 166),
            "Little steps. One big learning journey. Together.",
            font=ImageFont.truetype(FONT_BOLD, 21),
            fill=(74, 241, 220, int(240 * move)),
        )

    frame.alpha_composite(layer)


def add_opening_words(frame, time):
    font = ImageFont.truetype(FONT_BLACK, 66)
    regular = ImageFont.truetype(FONT_BOLD, 24)
    layer = Image.new("RGBA", frame.size, (0, 0, 0, 0))

    alpha_one = window_alpha(time, 0.0, 1.15, 0.24)
    alpha_two = window_alpha(time, 0.92, 2.0, 0.24)
    alpha_three = window_alpha(time, 1.75, 2.85, 0.24)

    centered_text(layer, "ONE CLASSROOM.", font, 248, (255, 255, 255), 255 * alpha_one)
    centered_text(layer, "EVERY VOICE.", font, 326, (74, 241, 220), 255 * alpha_two)
    centered_text(layer, "ONE TREK.", font, 404, (255, 174, 110), 255 * alpha_three)
    centered_text(
        layer,
        "Little steps become a shared direction.",
        regular,
        500,
        (213, 228, 238),
        220 * max(alpha_one, alpha_two, alpha_three),
    )
    frame.alpha_composite(layer)


def add_keyword(frame, time, text, start, end, color):
    alpha = window_alpha(time, start, end, 0.18)
    if alpha <= 0:
        return
    progress = ease_out_cubic((time - start) / 0.35)
    layer = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    draw = ImageDraw.Draw(layer)
    font = ImageFont.truetype(FONT_BLACK, 52)
    bounds = draw.textbbox((0, 0), text, font=font)
    width = bounds[2] - bounds[0]
    x = (WIDTH - width) / 2 + 70 * (1 - progress)
    y = 445
    draw.rounded_rectangle(
        (x - 30, y - 18, x + width + 30, y + 70),
        radius=24,
        fill=(5, 20, 34, int(215 * alpha)),
        outline=(*color, int(220 * alpha)),
        width=2,
    )
    draw.text((x, y), text, font=font, fill=(*color, int(255 * alpha)))
    frame.alpha_composite(layer)


def add_landing_card(frame, time, landing):
    if time < 10.05:
        return
    progress = ease_out_cubic((time - 10.05) / 0.85)
    x = int(650 + 460 * (1 - progress))
    y = int(220 + 30 * (1 - progress))

    card = landing.resize((560, 277), Image.Resampling.LANCZOS)
    card = card.convert("RGBA")
    mask = Image.new("L", card.size, 0)
    mask_draw = ImageDraw.Draw(mask)
    mask_draw.rounded_rectangle((0, 0, card.width, card.height), radius=24, fill=255)
    card.putalpha(mask)

    shadow = Image.new("RGBA", frame.size, (0, 0, 0, 0))
    shadow_draw = ImageDraw.Draw(shadow)
    shadow_draw.rounded_rectangle(
        (x - 12, y + 12, x + card.width + 12, y + card.height + 34),
        radius=32,
        fill=(0, 0, 0, 145),
    )
    shadow = shadow.filter(ImageFilter.GaussianBlur(24))
    frame.alpha_composite(shadow)
    frame.alpha_composite(card, (x, y))


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    base = make_gradient().convert("RGBA")
    landing = Image.open(LANDING_PATH).convert("RGBA")

    for frame_index in range(round(DURATION * FPS)):
        time = frame_index / FPS
        frame = base.copy()
        add_stars(frame, time)
        add_orbits(frame, time)
        add_mars(frame, time)
        add_opening_words(frame, time)
        add_logo(frame, time)

        add_keyword(frame, time, "LIVE CLASS PULSE", 5.88, 7.55, (74, 241, 220))
        add_keyword(frame, time, "SOURCE-GROUNDED AI", 7.35, 9.05, (163, 139, 255))
        add_keyword(frame, time, "TEACHER IN CONTROL", 8.85, 10.45, (255, 174, 110))
        add_landing_card(frame, time, landing)

        frame.convert("RGB").save(
            OUTPUT_DIR / f"frame-{frame_index:04d}.jpg",
            quality=94,
            subsampling=0,
        )


if __name__ == "__main__":
    main()
