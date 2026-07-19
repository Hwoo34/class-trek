import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const input = `${root}artifacts/ClassTrek-demo-v7-base.mp4`;
const exchange = `${root}artifacts/video-v6/raw/journey-exchange.webm`;
const overlays = `${root}artifacts/demo-role-overlays-v6`;
const output = `${root}artifacts/ClassTrek-demo-v7-final.mp4`;

const filter = [
  "[0:v]trim=start=0:end=13.233,setpts=PTS-STARTPTS[pre]",
  "[1:v]setpts=1.36555*PTS,trim=duration=13,setpts=PTS-STARTPTS," +
    "scale=1280:720,fps=30," +
    "zoompan=z='1+0.04*on/389':x='iw/2-(iw/zoom/2)':" +
    "y='ih/2-(ih/zoom/2)':d=1:s=1280x720:fps=30[exchange]",
  "[0:v]trim=start=13.233:end=26.233,setpts=PTS-STARTPTS[topbase]",
  "[topbase]crop=1280:86:0:0[top]",
  "[exchange][top]overlay=0:0[exchangeFinal]",
  "[0:v]trim=start=26.233,setpts=PTS-STARTPTS[post]",
  "[pre][exchangeFinal][post]concat=n=3:v=1:a=0[base]",
  "[base][2:v]overlay=0:0:enable='between(t,26.000,35.050)+between(t,37.800,44.850)'[v1]",
  "[v1][3:v]overlay=0:0:enable='between(t,35.100,36.350)'[v2]",
  "[v2][4:v]overlay=0:0:enable='between(t,48.100,59.250)'[v3]",
  "[v3][5:v]overlay=0:0:enable='between(t,75.900,82.800)'[v4]",
  "[v4][6:v]overlay=0:0:enable='between(t,9.800,17.200)'[caption1]",
  "[caption1][7:v]overlay=0:0:enable='between(t,17.200,26.233)'," +
    "fps=30,format=yuv420p,setparams=range=tv:color_primaries=bt709:" +
    "color_trc=bt709:colorspace=bt709[out]",
  "[0:a]anull[audio]",
].join(";");

const result = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-i",
    input,
    "-i",
    exchange,
    "-loop",
    "1",
    "-framerate",
    "30",
    "-i",
    `${overlays}/triptych.png`,
    "-loop",
    "1",
    "-framerate",
    "30",
    "-i",
    `${overlays}/student-focus.png`,
    "-loop",
    "1",
    "-framerate",
    "30",
    "-i",
    `${overlays}/teacher-with-display.png`,
    "-loop",
    "1",
    "-framerate",
    "30",
    "-i",
    `${overlays}/three-columns.png`,
    "-loop",
    "1",
    "-framerate",
    "30",
    "-i",
    `${overlays}/exchange-caption-1.png`,
    "-loop",
    "1",
    "-framerate",
    "30",
    "-i",
    `${overlays}/exchange-caption-2.png`,
    "-filter_complex",
    filter,
    "-map",
    "[out]",
    "-map",
    "[audio]",
    "-t",
    "116.600",
    "-r",
    "30",
    "-c:v",
    "libx264",
    "-preset",
    "medium",
    "-crf",
    "18",
    "-pix_fmt",
    "yuv420p",
    "-c:a",
    "aac",
    "-b:a",
    "192k",
    "-video_track_timescale",
    "15360",
    "-movflags",
    "+faststart",
    output,
  ],
  { stdio: "inherit" },
);

if (result.status !== 0) process.exit(result.status ?? 1);
console.log(`Saved ${output}`);
