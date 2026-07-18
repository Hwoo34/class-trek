from pathlib import Path
import re

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]
SRT_PATH = ROOT / "artifacts" / "ClassTrek-demo-v2.srt"
OUTPUT_DIR = ROOT / "artifacts" / "demo-overlays"

REGULAR_FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"
BOLD_FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

SECTION_LABELS = {
    1: "THE PROBLEM",
    2: "TEACHER MISSION CONTROL",
    4: "LIVE STUDENT PARTICIPATION",
    5: "PRIVACY-PRESERVING CLASS PULSE",
    6: "ONE AUTHORITATIVE CLASSROOM STATE",
    8: "SAFETY BEFORE ANALYSIS",
    11: "GPT-5.6 READS THE ROOM",
    12: "GROUNDED STRUCTURED GENERATION",
    14: "TEACHER APPROVAL REQUIRED",
    16: "REAL MULTI-USER RECOVERY",
    17: "BUILT WITH CODEX",
    19: "HUMAN DECISIONS STAY HUMAN",
    20: "EDUCATION TRACK",
}


def parse_timestamp(value: str) -> float:
    hours, minutes, rest = value.split(":")
    seconds, millis = rest.split(",")
    return (
        int(hours) * 3600
        + int(minutes) * 60
        + int(seconds)
        + int(millis) / 1000
    )


def parse_srt():
    blocks = re.split(r"\n\s*\n", SRT_PATH.read_text().strip())
    cues = []
    for block in blocks:
        lines = block.splitlines()
        start_text, end_text = lines[1].split(" --> ")
        cues.append(
            {
                "index": int(lines[0]),
                "start": parse_timestamp(start_text),
                "end": parse_timestamp(end_text),
                "text": "\n".join(lines[2:]),
            }
        )
    return cues


def render_overlay(cue):
    canvas = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    caption_font = ImageFont.truetype(REGULAR_FONT, 27)
    caption_bold = ImageFont.truetype(BOLD_FONT, 27)
    section_font = ImageFont.truetype(BOLD_FONT, 18)

    caption_lines = cue["text"].splitlines()
    caption_height = 38 * len(caption_lines) + 30
    caption_top = 720 - caption_height - 22
    draw.rounded_rectangle(
        (90, caption_top, 1190, 698),
        radius=18,
        fill=(8, 25, 40, 224),
        outline=(49, 227, 206, 190),
        width=2,
    )

    y = caption_top + 15
    for line in caption_lines:
        font = caption_bold if "GPT-5.6" in line or "Codex" in line else caption_font
        bounds = draw.textbbox((0, 0), line, font=font)
        x = (1280 - (bounds[2] - bounds[0])) / 2
        draw.text((x, y), line, font=font, fill=(255, 255, 255, 255))
        y += 38

    label = SECTION_LABELS.get(cue["index"])
    if label:
        bounds = draw.textbbox((0, 0), label, font=section_font)
        width = bounds[2] - bounds[0] + 58
        draw.rounded_rectangle(
            (28, 26, 28 + width, 72),
            radius=14,
            fill=(8, 32, 51, 235),
        )
        draw.rounded_rectangle(
            (38, 36, 44, 62),
            radius=3,
            fill=(49, 227, 206, 255),
        )
        draw.text((55, 39), label, font=section_font, fill=(255, 255, 255, 255))

    return canvas


def main():
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    cues = parse_srt()
    concat_lines = []

    for cue in cues:
        filename = f"{cue['index']:02d}.png"
        render_overlay(cue).save(OUTPUT_DIR / filename)
        concat_lines.append(f"file '{filename}'")
        concat_lines.append(f"duration {cue['end'] - cue['start']:.6f}")

    concat_lines.append(f"file '{cues[-1]['index']:02d}.png'")
    (OUTPUT_DIR / "concat.txt").write_text("\n".join(concat_lines) + "\n")


if __name__ == "__main__":
    main()
