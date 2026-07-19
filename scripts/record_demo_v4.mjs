import { mkdir, copyFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";

const baseUrl = process.env.CLASS_TREK_URL ?? "http://127.0.0.1:3000";
const teacherAccessCode = process.env.TEACHER_ACCESS_CODE;
const outputDirectory = fileURLToPath(
  new URL("../artifacts/video-v4/raw/", import.meta.url),
);
await mkdir(outputDirectory, { recursive: true });

const browser = await chromium.launch({ headless: true });
const timeline = [];
const startedAt = Date.now();
const mark = (event) => {
  timeline.push({ event, at: (Date.now() - startedAt) / 1000 });
  console.log(`${timeline.at(-1).at.toFixed(2)}s ${event}`);
};
const pause = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

const cursorOverlay = () => {
  window.addEventListener("DOMContentLoaded", () => {
    const cursor = document.createElement("div");
    cursor.id = "class-trek-demo-cursor";
    Object.assign(cursor.style, {
      position: "fixed",
      zIndex: "2147483647",
      width: "18px",
      height: "18px",
      borderRadius: "50%",
      border: "3px solid white",
      background: "#6f4cff",
      boxShadow: "0 4px 16px rgba(8, 15, 30, .42)",
      pointerEvents: "none",
      transform: "translate(-50%, -50%)",
      transition: "width 120ms ease, height 120ms ease",
      left: "50%",
      top: "50%",
    });
    document.documentElement.append(cursor);

    document.addEventListener("mousemove", (event) => {
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
    document.addEventListener("mousedown", () => {
      cursor.style.width = "34px";
      cursor.style.height = "34px";
    });
    document.addEventListener("mouseup", () => {
      cursor.style.width = "18px";
      cursor.style.height = "18px";
    });
  });
};

async function createRecordedPage(storageState) {
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    ...(storageState ? { storageState } : {}),
    recordVideo: {
      dir: outputDirectory,
      size: { width: 1280, height: 720 },
    },
  });
  await context.addInitScript(cursorOverlay);
  const page = await context.newPage();
  return { context, page };
}

async function pointAndClick(page, locator, pauseAfter = 900) {
  await locator.scrollIntoViewIfNeeded();
  const box = await locator.boundingBox();
  if (!box) throw new Error("Unable to locate demo control");
  await page.mouse.move(
    box.x + box.width / 2,
    box.y + box.height / 2,
    { steps: 18 },
  );
  await pause(450);
  await page.mouse.click(box.x + box.width / 2, box.y + box.height / 2);
  await pause(pauseAfter);
}

let teacherStorageState;
if (teacherAccessCode) {
  const setupContext = await browser.newContext();
  const setupPage = await setupContext.newPage();
  await setupPage.goto(`${baseUrl}/teacher`, {
    waitUntil: "domcontentloaded",
  });
  await setupPage.getByLabel("Teacher access code").fill(teacherAccessCode);
  await setupPage.getByRole("button", { name: "Unlock controls" }).click();
  await setupPage
    .getByRole("button", { name: "Reset demo" })
    .waitFor({ timeout: 15_000 });
  teacherStorageState = await setupContext.storageState();
  await setupContext.close();
}

const teacher = await createRecordedPage(teacherStorageState);
const student = await createRecordedPage();
const display = await createRecordedPage();

await Promise.all([
  teacher.page.goto(`${baseUrl}/teacher`, { waitUntil: "domcontentloaded" }),
  student.page.goto(`${baseUrl}/join/MARS24`, {
    waitUntil: "domcontentloaded",
  }),
  display.page.goto(`${baseUrl}/display/MARS24`, {
    waitUntil: "domcontentloaded",
  }),
]);
await Promise.all([
  teacher.page
    .getByRole("button", { name: "Reset demo" })
    .waitFor({ timeout: 15_000 }),
  student.page
    .getByLabel("Classroom nickname")
    .waitFor({ timeout: 15_000 }),
  display.page
    .getByText("Thinking together")
    .waitFor({ timeout: 15_000 }),
]);
mark("three surfaces ready");
await pause(1500);

await pointAndClick(
  teacher.page,
  teacher.page.getByRole("button", { name: "Reset demo" }),
);
mark("reset to Mission Mars");

await teacher.page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
await pause(900);
mark("journey desk visible");

await pointAndClick(
  teacher.page,
  teacher.page
    .getByRole("article")
    .filter({ hasText: "Reef Rescue" })
    .getByRole("button", { name: "Start this journey" }),
  1500,
);
mark("teacher starts Reef Rescue");

await teacher.page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
await pause(900);
const continueMars = teacher.page
  .getByRole("button")
  .filter({ hasText: "Mission Mars" })
  .filter({ hasText: "Continue" })
  .first();
await pointAndClick(teacher.page, continueMars, 1500);
mark("teacher resumes previous Mission Mars story");

await teacher.page.evaluate(() => window.scrollTo({ top: 0, behavior: "smooth" }));
await pause(700);
await pointAndClick(
  teacher.page,
  teacher.page.getByRole("button", {
    name: "Choose the next learning journey",
  }),
  700,
);

const nickname = student.page.getByLabel("Classroom nickname");
await nickname.click();
await student.page.keyboard.type("Nova", { delay: 180 });
await pause(450);
await pointAndClick(
  student.page,
  student.page.getByRole("button", { name: "Enter class" }),
  1200,
);
mark("student Nova joins");

await pointAndClick(
  student.page,
  student.page.getByRole("button", { name: "Not sure yet" }),
  700,
);
await pointAndClick(
  student.page,
  student.page.getByRole("button", { name: "Liquid water" }),
  600,
);
const explanation = student.page.getByLabel("Explain your thinking");
await explanation.click();
await student.page.keyboard.type(
  "Mars has ice, but the crew will need energy to melt it and keep people warm.",
  { delay: 45 },
);
await pause(700);
await pointAndClick(
  student.page,
  student.page.getByRole("button", { name: "Send to teacher" }),
  1800,
);
mark("student vote and reasoning reach teacher");

await teacher.page
  .getByText("Nova", { exact: true })
  .last()
  .scrollIntoViewIfNeeded();
await pause(1600);
mark("teacher reviews live response");

const shareButton = teacher.page.getByRole("button", {
  name: "Share anonymously",
});
if (await shareButton.isVisible()) {
  await pointAndClick(teacher.page, shareButton, 1300);
  mark("teacher shares safe idea anonymously");
}

await pointAndClick(
  teacher.page,
  teacher.page.getByRole("button", { name: "Read the room" }),
  1200,
);
mark("teacher asks GPT-5.6 to read the room");

const proposal = teacher.page.getByText(
  "AI proposal · teacher approval required",
);
await proposal.waitFor({ timeout: 55_000 });
await proposal.scrollIntoViewIfNeeded();
await pause(2600);
mark("source-grounded proposal arrives for review");

const approveButton = teacher.page.getByRole("button", {
  name: "Approve & publish",
});
const sceneBeforeApproval = await student.page.locator("h1").first().innerText();
await pointAndClick(teacher.page, approveButton, 1700);
mark("teacher approves branch");

await Promise.all([
  student.page.waitForFunction(
    (previousTitle) =>
      document.querySelector("h1")?.textContent?.trim() !== previousTitle,
    sceneBeforeApproval,
    { timeout: 10_000 },
  ),
  display.page.waitForFunction(
    (previousTitle) =>
      document.querySelector(".display-title")?.textContent?.trim() !==
      previousTitle,
    sceneBeforeApproval,
    { timeout: 10_000 },
  ),
]);
await pause(3200);
mark("student and display move together");

const teacherVideo = teacher.page.video();
const studentVideo = student.page.video();
const displayVideo = display.page.video();
await Promise.all([
  teacher.context.close(),
  student.context.close(),
  display.context.close(),
]);

await Promise.all([
  copyFile(await teacherVideo.path(), `${outputDirectory}/teacher.webm`),
  copyFile(await studentVideo.path(), `${outputDirectory}/student.webm`),
  copyFile(await displayVideo.path(), `${outputDirectory}/display.webm`),
  writeFile(
    `${outputDirectory}/timeline.json`,
    `${JSON.stringify(timeline, null, 2)}\n`,
  ),
]);
await browser.close();
console.log("Saved synchronized ClassTrek V4 recordings.");
