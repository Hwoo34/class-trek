import { copyFile, mkdir } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const baseUrl = process.env.CLASS_TREK_URL ?? "http://127.0.0.1:3100";
const teacherAccessCode = process.env.TEACHER_ACCESS_CODE ?? "judge-local";
const outputDirectory = fileURLToPath(
  new URL("../artifacts/video-v6/raw/", import.meta.url),
);
await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
const context = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: {
    dir: outputDirectory,
    size: { width: 1280, height: 720 },
  },
});
const page = await context.newPage();
const pause = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

await page.goto(`${baseUrl}/teacher`, { waitUntil: "domcontentloaded" });
const accessInput = page.getByLabel("Teacher access code");
if (await accessInput.isVisible().catch(() => false)) {
  await accessInput.fill(teacherAccessCode);
  await page.getByRole("button", { name: "Unlock controls" }).click();
}
await page.getByRole("button", { name: "Reset demo" }).waitFor();
await page.getByRole("button", { name: "Reset demo" }).click();
await page.evaluate(() => window.scrollTo(0, 0));
await pause(2200);

await page.getByRole("button", { name: "Trending" }).click();
await pause(900);
await page.getByRole("button", { name: "Student-made" }).click();
await pause(1000);
const reefCard = page.getByRole("article").filter({ hasText: "Reef Rescue" });
await reefCard.getByRole("button", { name: "Remix" }).click();
await page.getByLabel("Remix Trek title").waitFor();
const titleInput = page.getByLabel("Remix Trek title");
await titleInput.click();
await page.keyboard.press("Meta+A");
await page.keyboard.type("Our Local Reef Rescue", { delay: 45 });
const goalInput = page.getByLabel("Remix learning goal");
await goalInput.click();
await page.keyboard.press("Meta+A");
await page.keyboard.type(
  "Use local observations and reviewed science sources to explain reef stress.",
  { delay: 18 },
);
await page.getByText("Student-made Treks can be remixed").scrollIntoViewIfNeeded();
const launchButton = page.getByRole("button", { name: "Launch remixed Trek" });
await launchButton.focus();
await pause(100);
await launchButton.click();
await page.getByText("Our Local Reef Rescue", { exact: true }).first().waitFor();
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
const trekPicker = page.getByRole("button", {
  name: "Choose the next class Trek",
});
await trekPicker.click();
await pause(450);
await trekPicker.click();
await pause(450);
await trekPicker.click();
await page.mouse.move(1080, 330, { steps: 20 });
await pause(650);

const video = page.video();
await context.close();
await copyFile(await video.path(), `${outputDirectory}/journey-exchange.webm`);
await browser.close();
console.log("Saved Trek Exchange demo recording.");
