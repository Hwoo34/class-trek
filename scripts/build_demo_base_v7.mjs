import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
const intro = `${root}artifacts/video-v7/00-intro-v7.mp4`;
const source = `${root}artifacts/video-v4/ClassTrek-demo-v5-base.mp4`;
const overlays = `${root}artifacts/demo-overlays-v7/concat.txt`;
const narration = `${root}artifacts/video-v7/ClassTrek-voiceover-v7.wav`;
const soundBed = `${root}artifacts/ClassTrek-original-sound-bed.wav`;
const output = `${root}artifacts/ClassTrek-demo-v7-base.mp4`;

const filter = [
  "[0:v]trim=duration=13.233,setpts=PTS-STARTPTS[intro]",
  "[1:v]trim=start=13.233:end=112.500,setpts=PTS-STARTPTS[body]",
  "[1:v]trim=start=112.100:end=112.500,setpts=PTS-STARTPTS[bridgeA]",
  "[1:v]trim=start=112.900:end=113.300,setpts=PTS-STARTPTS[bridgeB]",
  "[bridgeA][bridgeB]xfade=transition=fade:duration=0.400:offset=0[bridge]",
  "[1:v]trim=start=113.300,setpts=PTS-STARTPTS[tail]",
  "[intro][body][bridge][tail]concat=n=4:v=1:a=0[visual]",
  "[visual][2:v]overlay=0:0:eof_action=pass," +
    "fps=30,format=yuv420p,setparams=range=tv:color_primaries=bt709:" +
    "color_trc=bt709:colorspace=bt709[out]",
  "[3:a]aresample=48000,volume=1.15[voice]",
  "[4:a]aresample=48000,atrim=duration=116.600,volume=0.22[bed]",
  "[voice][bed]amix=inputs=2:duration=longest:normalize=0," +
    "atrim=duration=116.600[audio]",
].join(";");

const result = spawnSync(
  "ffmpeg",
  [
    "-y",
    "-i",
    intro,
    "-i",
    source,
    "-f",
    "concat",
    "-safe",
    "0",
    "-i",
    overlays,
    "-i",
    narration,
    "-i",
    soundBed,
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
