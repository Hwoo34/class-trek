import { readFile } from "node:fs/promises";
import { chromium } from "playwright";

const baseUrl = process.env.CLASS_TREK_URL ?? "https://class-trek.vercel.app";
const envText = await readFile(new URL("../.env.local", import.meta.url), "utf8");
const accessLine = envText
  .split(/\r?\n/)
  .find((line) => line.startsWith("TEACHER_ACCESS_CODE="));
const teacherAccessCode = accessLine
  ?.slice("TEACHER_ACCESS_CODE=".length)
  .replace(/^['"]|['"]$/g, "");

const browser = await chromium.launch({ headless: true });
const teacherContext = await browser.newContext({
  viewport: { width: 1280, height: 720 },
});
const studentContext = await browser.newContext({
  viewport: { width: 1280, height: 720 },
});
const displayContext = await browser.newContext({
  viewport: { width: 1280, height: 720 },
});
const teacher = await teacherContext.newPage();
const student = await studentContext.newPage();
const display = await displayContext.newPage();
const consoleErrors = [];

for (const page of [teacher, student, display]) {
  page.on("console", (message) => {
    if (message.type() === "error") consoleErrors.push(message.text());
  });
}

try {
  const responses = await Promise.all([
    teacher.goto(`${baseUrl}/teacher`, { waitUntil: "domcontentloaded" }),
    student.goto(`${baseUrl}/join/MARS24`, {
      waitUntil: "domcontentloaded",
    }),
    display.goto(`${baseUrl}/display/MARS24`, {
      waitUntil: "domcontentloaded",
    }),
  ]);

  if (!teacherAccessCode) {
    await Promise.all([
      teacher
        .getByLabel("Teacher access code")
        .waitFor({ timeout: 15_000 }),
      student
        .getByLabel("Classroom nickname")
        .waitFor({ timeout: 15_000 }),
      display.getByText("Thinking together").waitFor({ timeout: 15_000 }),
    ]);
    const teacherAccessProtected = await teacher
      .getByLabel("Teacher access code")
      .isVisible();
    const studentJoinReady = await student
      .getByLabel("Classroom nickname")
      .isVisible();
    const displayReady = await display
      .getByText("Thinking together")
      .isVisible();

    console.log(
      JSON.stringify(
        {
          statusCodes: responses.map((response) => response?.status()),
          teacherAccessProtected,
          studentJoinReady,
          displayReady,
          fullFlowSkipped: "TEACHER_ACCESS_CODE is not present in .env.local",
          consoleErrors,
        },
        null,
        2,
      ),
    );
  } else {
    await teacher.getByLabel("Teacher access code").fill(teacherAccessCode);
    await teacher.getByRole("button", { name: "Unlock controls" }).click();
    await teacher
      .getByRole("button", { name: "Reset demo" })
      .waitFor({ timeout: 15_000 });
    await teacher.getByRole("button", { name: "Reset demo" }).click();

    await student.getByLabel("Classroom nickname").fill("JudgeQA");
    await student.getByRole("button", { name: "Enter class" }).click();
    await student
      .getByRole("button", { name: "Not sure yet" })
      .waitFor({ timeout: 15_000 });
    await student.getByRole("button", { name: "Not sure yet" }).click();
    await student.getByRole("button", { name: "Liquid water" }).click();
    await student
      .getByLabel("Explain your thinking")
      .fill("Water ice helps only when the crew also has reliable energy.");
    await student.getByRole("button", { name: "Send to teacher" }).click();

    await teacher
      .getByText("JudgeQA", { exact: true })
      .last()
      .waitFor({ timeout: 15_000 });
    const teacherSawStudentResponse = await teacher
      .getByText("JudgeQA", { exact: true })
      .last()
      .isVisible();
    const privateAliasVisibleOnDisplay = await display
      .getByText("JudgeQA", { exact: true })
      .isVisible()
      .catch(() => false);

    await teacher.screenshot({
      path: new URL(
        "../artifacts/production-verification.png",
        import.meta.url,
      ).pathname,
    });

    console.log(
      JSON.stringify(
        {
          statusCodes: responses.map((response) => response?.status()),
          teacherAccessProtected: true,
          teacherSawStudentResponse,
          privateAliasVisibleOnDisplay,
          consoleErrors,
        },
        null,
        2,
      ),
    );
  }
} finally {
  if (teacherAccessCode) {
    await teacher
      .getByRole("button", { name: "Reset demo" })
      .click()
      .catch(() => {});
  }
  await Promise.all([
    teacherContext.close(),
    studentContext.close(),
    displayContext.close(),
  ]);
  await browser.close();
}
