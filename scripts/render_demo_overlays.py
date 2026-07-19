import argparse
from pathlib import Path
import re

from PIL import Image, ImageDraw, ImageFont


ROOT = Path(__file__).resolve().parents[1]

REGULAR_FONT = "/System/Library/Fonts/Supplemental/Arial.ttf"
BOLD_FONT = "/System/Library/Fonts/Supplemental/Arial Bold.ttf"

SECTION_LABELS_V2 = {
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

SECTION_LABELS_V3 = {
    4: "THE PROBLEM",
    5: "MISSION MARS",
    6: "TEACHER MISSION CONTROL",
    7: "LIVE STUDENT PARTICIPATION",
    8: "PRIVACY-PRESERVING CLASS PULSE",
    9: "ONE AUTHORITATIVE CLASSROOM STATE",
    10: "REALTIME SYNC AND RECOVERY",
    11: "SAFETY BEFORE ANALYSIS",
    12: "HARMFUL CONTENT NEVER REACHES THE CLASS",
    13: "GPT-5.6 READS THE ROOM",
    14: "GROUNDED STRUCTURED GENERATION",
    15: "SERVER-VALIDATED SOURCES",
    16: "TEACHER APPROVAL REQUIRED",
    17: "EVERY SCREEN MOVES TOGETHER",
    18: "REAL MULTI-USER RECOVERY",
    19: "BUILT WITH CODEX",
    20: "PRODUCTION-TESTED WITH CODEX",
    21: "HUMAN DECISIONS STAY HUMAN",
    22: "EDUCATION TRACK",
}

SECTION_LABELS_V4 = {
    2: "WATCH ONE CLASS MOVE",
    3: "TEACHER JOURNEY DESK",
    4: "MULTIPLE SOURCE-GROUNDED MISSIONS",
    5: "A STUDENT JOINS",
    6: "STUDENT THINKING CHANGES THE PATH",
    7: "LIVE CLASS PULSE",
    8: "PRIVACY BY DESIGN",
    9: "MISSION CONTROL READS THE ROOM",
    10: "ACTUAL GPT-5.6",
    11: "TEACHER REVIEW REQUIRED",
    12: "APPROVE & PUBLISH",
    13: "EVERY SCREEN MOVES TOGETHER",
    14: "THE CLASSTREK LOOP",
    15: "SAFETY BEFORE ANALYSIS",
    16: "BUILT AND VERIFIED WITH CODEX",
    17: "EDUCATION TRACK",
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


def parse_srt(srt_path):
    blocks = re.split(r"\n\s*\n", srt_path.read_text().strip())
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


def render_overlay(cue, section_labels, hide_caption=False):
    canvas = Image.new("RGBA", (1280, 720), (0, 0, 0, 0))
    draw = ImageDraw.Draw(canvas)

    caption_font = ImageFont.truetype(REGULAR_FONT, 27)
    caption_bold = ImageFont.truetype(BOLD_FONT, 27)
    section_font = ImageFont.truetype(BOLD_FONT, 18)

    if not hide_caption:
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
            font = (
                caption_bold
                if "GPT-5.6" in line or "Codex" in line
                else caption_font
            )
            bounds = draw.textbbox((0, 0), line, font=font)
            x = (1280 - (bounds[2] - bounds[0])) / 2
            draw.text((x, y), line, font=font, fill=(255, 255, 255, 255))
            y += 38

    label = section_labels.get(cue["index"])
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
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--srt",
        type=Path,
        default=ROOT / "artifacts" / "ClassTrek-demo-v2.srt",
    )
    parser.add_argument(
        "--output",
        type=Path,
        default=ROOT / "artifacts" / "demo-overlays",
    )
    parser.add_argument(
        "--version",
        choices=("v2", "v3", "v4"),
        default="v2",
    )
    args = parser.parse_args()

    args.output.mkdir(parents=True, exist_ok=True)
    cues = parse_srt(args.srt)
    section_labels = {
        "v2": SECTION_LABELS_V2,
        "v3": SECTION_LABELS_V3,
        "v4": SECTION_LABELS_V4,
    }[args.version]
    concat_lines = []
    cursor = 0.0

    for cue in cues:
        if cue["start"] > cursor:
            gap_filename = f"gap-{cue['index']:02d}.png"
            Image.new("RGBA", (1280, 720), (0, 0, 0, 0)).save(
                args.output / gap_filename
            )
            concat_lines.append(f"file '{gap_filename}'")
            concat_lines.append(f"duration {cue['start'] - cursor:.6f}")

        filename = f"{cue['index']:02d}.png"
        render_overlay(
            cue,
            section_labels,
            hide_caption=(
                (args.version == "v3" and cue["index"] <= 3)
                or (args.version == "v4" and cue["index"] == 1)
            ),
        ).save(args.output / filename)
        concat_lines.append(f"file '{filename}'")
        concat_lines.append(f"duration {cue['end'] - cue['start']:.6f}")
        cursor = cue["end"]

    concat_lines.append(f"file '{cues[-1]['index']:02d}.png'")
    (args.output / "concat.txt").write_text("\n".join(concat_lines) + "\n")


if __name__ == "__main__":
    main()
