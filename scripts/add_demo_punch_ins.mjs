import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const segmentDirectory = fileURLToPath(
  new URL("../artifacts/video-v4/segments/", import.meta.url),
);

const punchIns = [
  {
    input: "02-student-live.mp4",
    output: "02-student-live-punch.mp4",
    filter:
      "[0:v]split=2[base][z];" +
      "[z]crop=640:360:0:190,scale=1280:720,format=yuva420p," +
      "fade=t=in:st=9.20:d=0.18:alpha=1," +
      "fade=t=out:st=11.00:d=0.18:alpha=1[zoom];" +
      "[base][zoom]overlay=0:0:enable='between(t,9.20,11.18)'," +
      "format=yuv420p," +
      "setparams=range=tv:color_primaries=bt709:" +
      "color_trc=bt709:colorspace=bt709[out]",
  },
  {
    input: "03-teacher-review.mp4",
    output: "03-teacher-review-punch.mp4",
    filter:
      "[0:v]split=2[base][z];" +
      "[z]crop=400:225:870:390,scale=1280:720,format=yuva420p," +
      "fade=t=in:st=0.15:d=0.18:alpha=1," +
      "fade=t=out:st=1.75:d=0.18:alpha=1[zoom];" +
      "[base][zoom]overlay=0:0:enable='between(t,0.15,1.93)'," +
      "format=yuv420p," +
      "setparams=range=tv:color_primaries=bt709:" +
      "color_trc=bt709:colorspace=bt709[out]",
  },
];

for (const punchIn of punchIns) {
  const result = spawnSync(
    "ffmpeg",
    [
      "-y",
      "-i",
      `${segmentDirectory}${punchIn.input}`,
      "-filter_complex",
      punchIn.filter,
      "-map",
      "[out]",
      "-an",
      "-c:v",
      "libx264",
      "-preset",
      "medium",
      "-crf",
      "18",
      "-pix_fmt",
      "yuv420p",
      `${segmentDirectory}${punchIn.output}`,
    ],
    { stdio: "inherit" },
  );
  if (result.status !== 0) process.exit(result.status ?? 1);
}

console.log("Saved student-choice and live-pulse punch-in segments.");
