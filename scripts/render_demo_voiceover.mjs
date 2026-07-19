import { mkdirSync, readFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const srtPath = `${root}docs/DEMO_CAPTIONS_V7.srt`;
const scriptPath = `${root}docs/DEMO_VOICEOVER_V7.txt`;
const outputDirectory = `${root}artifacts/video-v7/voice`;
const output = `${root}artifacts/video-v7/ClassTrek-voiceover-v7.wav`;

mkdirSync(outputDirectory, { recursive: true });

function timestampToSeconds(timestamp) {
  const [hours, minutes, rest] = timestamp.split(":");
  const [seconds, milliseconds] = rest.split(",");
  return (
    Number(hours) * 3600 +
    Number(minutes) * 60 +
    Number(seconds) +
    Number(milliseconds) / 1000
  );
}

const cues = readFileSync(srtPath, "utf8")
  .trim()
  .split(/\n\s*\n/)
  .map((block) => {
    const lines = block.split("\n");
    const [start, end] = lines[1].split(" --> ");
    return {
      index: Number(lines[0]),
      start: timestampToSeconds(start),
      end: timestampToSeconds(end),
    };
  });

const narration = readFileSync(scriptPath, "utf8")
  .trim()
  .split("\n")
  .map((line) => line.trim())
  .filter(Boolean);

if (narration.length !== cues.length) {
  throw new Error(
    `Expected ${cues.length} narration lines, received ${narration.length}`,
  );
}

const concatEntries = [];
let cursor = 0;

function run(command, args) {
  const result = spawnSync(command, args, { stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

function durationOf(path) {
  const result = spawnSync(
    "ffprobe",
    [
      "-v",
      "error",
      "-show_entries",
      "format=duration",
      "-of",
      "default=nw=1:nk=1",
      path,
    ],
    { encoding: "utf8" },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
  return Number(result.stdout.trim());
}

for (const [offset, cue] of cues.entries()) {
  if (cue.start > cursor) {
    const silenceDuration = cue.start - cursor;
    const silencePath = `${outputDirectory}/gap-${cue.index
      .toString()
      .padStart(2, "0")}.wav`;
    run("ffmpeg", [
      "-y",
      "-loglevel",
      "error",
      "-f",
      "lavfi",
      "-i",
      "anullsrc=r=48000:cl=mono",
      "-t",
      silenceDuration.toFixed(6),
      "-c:a",
      "pcm_s16le",
      silencePath,
    ]);
    concatEntries.push(silencePath);
  }

  const stem = cue.index.toString().padStart(2, "0");
  const rawPath = `${outputDirectory}/${stem}.aiff`;
  const fittedPath = `${outputDirectory}/${stem}.wav`;
  const windowDuration = cue.end - cue.start;

  run("say", [
    "-v",
    "Samantha",
    "-r",
    "160",
    "-o",
    rawPath,
    narration[offset],
  ]);

  const rawDuration = durationOf(rawPath);
  const spokenDuration = Math.max(0.1, windowDuration - 0.08);
  const speed = rawDuration > spokenDuration ? rawDuration / spokenDuration : 1;
  const filters = [
    "aresample=48000",
    ...(speed > 1.0001 ? [`atempo=${speed.toFixed(6)}`] : []),
    `apad=pad_dur=${windowDuration.toFixed(6)}`,
    `atrim=duration=${windowDuration.toFixed(6)}`,
  ].join(",");

  run("ffmpeg", [
    "-y",
    "-loglevel",
    "error",
    "-i",
    rawPath,
    "-af",
    filters,
    "-c:a",
    "pcm_s16le",
    fittedPath,
  ]);
  concatEntries.push(fittedPath);
  cursor = cue.end;
}

const concatPath = `${outputDirectory}/concat.txt`;
const concatContent = concatEntries
  .map((path) => `file '${path.replaceAll("'", "'\\''")}'`)
  .join("\n");
await import("node:fs/promises").then(({ writeFile }) =>
  writeFile(concatPath, `${concatContent}\n`),
);

run("ffmpeg", [
  "-y",
  "-loglevel",
  "error",
  "-f",
  "concat",
  "-safe",
  "0",
  "-i",
  concatPath,
  "-c:a",
  "pcm_s16le",
  output,
]);

console.log(`Saved ${output}`);
