const { chromium } = require("playwright");
const fs = require("fs");

const baseUrl = "https://q4academy.xtirion.com";
const email = "admin@q4academy.nl";
const outputPath = "C:/Users/Nick Ramdjanamsingh/OneDrive - Q4Profiles BV/Documenten/E-learning/disc-migratie.json";

const courseSeeds = [
  { id: 1, lessonIds: ["1-1", "1-2", "1-3"] },
  { id: 2, lessonIds: ["2-1", "2-2", "2-3"] },
];

function clean(text) {
  return text
    .replace(/\u00a0/g, " ")
    .replace(/[ \t]+/g, " ")
    .replace(/\n[ \t]+/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function splitLines(text) {
  return clean(text).split("\n").map((line) => line.trim()).filter(Boolean);
}

function withoutChrome(lines) {
  const chrome = new Set([
    "Q4 Academy",
    "Dashboard",
    "Factcards",
    "Voortgang",
    "Admin",
    "NL",
    "EN",
    "AG",
    "Afsluiten",
    "Vorige",
    "Volgende",
    "Terug naar dashboard",
  ]);
  return lines.filter((line) => !chrome.has(line));
}

function inferStepType(lines) {
  const text = lines.join(" ");
  if (/Video laden|Bekijk het filmpje|masterclass|video/i.test(text)) return "video";
  if (/KLIK OP DE PLUSJES|Open alles|Sluit alles/i.test(text)) return "accordion";
  if (/Gebruik de pijltjes|herschikken/i.test(text)) return "matching";
  if (/Wijs elk item toe|categorie/i.test(text)) return "categorization";
  if (/Selecteer|Welke van onderstaande|Welk kernwoord|Wat meet|Wat beschrijft|Hoe kan/i.test(text)) return "multiple_choice";
  if (/"[^"]+".*(waar|niet waar)|Waar|Niet waar/i.test(text)) return "true_false_or_application";
  if (/Opdracht|Waarom\?|Herken|Hoe zie jij jezelf|Wanneer voel jij/i.test(text)) return "reflection";
  return "information";
}

function extractOptions(lines) {
  const controlWords = new Set([
    "Quiz vraag",
    "Selecteer een antwoord",
    "Selecteer alle juiste antwoorden",
    "Check antwoord",
    "Correct!",
    "Niet correct",
    "Antwoord opgeslagen!",
    "Alle antwoorden correct!",
    "Niet alle paren zijn correct",
    "Niet alle items zijn correct gecategoriseerd",
    "Correct antwoord:",
    "Waar",
    "Niet waar",
  ]);
  return lines
    .filter((line) => !controlWords.has(line))
    .filter((line) => line.length <= 180)
    .filter((line) => !/^Stap \d+ van \d+/.test(line))
    .filter((line) => !/^Quiz:/.test(line));
}

async function login(page) {
  await page.goto(baseUrl, { waitUntil: "domcontentloaded", timeout: 30000 });
  await page.waitForTimeout(800);
  if (await page.locator("input[type=email]").count()) {
    await page.fill("input[type=email]", email);
    await page.click("button[type=submit]");
    await page.waitForURL("**/dashboard", { timeout: 20000 }).catch(() => {});
    await page.waitForTimeout(1200);
  }
}

async function goto(page, path) {
  await page.goto(`${baseUrl}${path}`, { waitUntil: "domcontentloaded", timeout: 30000 }).catch(() => {});
  await page.waitForTimeout(950);
}

async function bodyText(page) {
  return clean(await page.locator("body").innerText());
}

async function links(page, selector = "a") {
  return page.locator(selector).evaluateAll((nodes) =>
    nodes.map((node) => ({
      text: node.innerText ? node.innerText.trim() : "",
      href: node.href || "",
    }))
  );
}

async function extractCourse(page, seed) {
  const path = `/dashboard/courses/${seed.id}`;
  await goto(page, path);
  const text = await bodyText(page);
  const courseLines = withoutChrome(splitLines(text));
  const title = courseLines.find((line) => !line.startsWith("Terug naar")) || `Cursus ${seed.id}`;
  const lessonLinks = (await links(page)).filter((link) => link.href.includes(`/dashboard/courses/${seed.id}/lessons/`));
  const trainerLink = (await links(page)).find((link) => link.href.includes(`/dashboard/courses/${seed.id}/trainer`));

  const course = {
    id: seed.id,
    sourcePath: path,
    title,
    rawText: text,
    summary: courseLines.slice(1, 8).join("\n"),
    lessons: [],
    trainer: null,
    factcards: [],
    sourceLinks: {
      lessons: lessonLinks,
      trainer: trainerLink || null,
    },
  };

  for (const lessonId of seed.lessonIds) {
    course.lessons.push(await extractLesson(page, seed.id, lessonId));
  }

  course.trainer = await extractTrainer(page, seed.id);
  return course;
}

async function extractLesson(page, courseId, lessonId) {
  const basePath = `/dashboard/courses/${courseId}/lessons/${lessonId}`;
  await goto(page, basePath);
  const firstLines = withoutChrome(splitLines(await bodyText(page)));
  const title = firstLines[0] || lessonId;
  const stepLine = firstLines.find((line) => /^Stap \d+ van \d+/.test(line)) || "";
  const stepCount = Number((stepLine.match(/van (\d+)/) || [])[1] || 1);

  const lesson = {
    id: lessonId,
    sourcePath: basePath,
    title,
    stepCount,
    steps: [],
  };

  for (let stepNumber = 1; stepNumber <= stepCount; stepNumber += 1) {
    const path = `${basePath}?step=${stepNumber}`;
    await goto(page, path);
    const rawText = await bodyText(page);
    const allLines = withoutChrome(splitLines(rawText));
    const contentLines = allLines
      .filter((line) => !/^Stap \d+ van \d+/.test(line))
      .filter((line) => !/^Quiz:/.test(line))
      .filter((line) => line !== title);
    const heading = contentLines[0] || title;
    const type = inferStepType(contentLines);

    lesson.steps.push({
      number: stepNumber,
      sourcePath: path,
      title: heading,
      type,
      rawText,
      lines: contentLines,
      optionsOrShortLines: ["multiple_choice", "true_false_or_application", "matching", "categorization"].includes(type)
        ? extractOptions(contentLines)
        : [],
    });
  }

  return lesson;
}

async function extractTrainer(page, courseId) {
  const path = `/dashboard/courses/${courseId}/trainer`;
  await goto(page, path);
  const text = await bodyText(page);
  const trainerLines = withoutChrome(splitLines(text)).filter((line) => !line.startsWith("Terug naar"));
  return {
    sourcePath: path,
    type: "timed_quiz",
    title: trainerLines.find((line) => !["Timed Quiz"].includes(line)) || `Trainer cursus ${courseId}`,
    rawText: text,
    lines: trainerLines,
    questions: [],
    migrationNote:
      "Trainer-vragen zijn niet gestart of beantwoord tijdens deze extractie om geen nieuwe poging of voortgang te registreren. Voeg trainer-vragen toe vanuit brondocumenten of na expliciete toestemming om een trainerpoging te openen.",
  };
}

async function extractFactcards(page) {
  await goto(page, "/dashboard/factcards");
  const cardLinks = (await links(page, "a[href*='/dashboard/factcards/']"))
    .filter((link, index, arr) => link.href && arr.findIndex((item) => item.href === link.href) === index);

  const factcards = [];
  for (const link of cardLinks) {
    const url = new URL(link.href);
    await goto(page, url.pathname);
    const rawText = await bodyText(page);
    const pageLines = withoutChrome(splitLines(rawText))
      .filter((line) => !["Terug naar factcards", "/", "Factcards"].includes(line));
    const title = pageLines[pageLines.length > 2 ? 2 : 0] || link.text.split("\n")[0];
    factcards.push({
      sourcePath: url.pathname,
      title,
      listText: link.text,
      rawText,
      lines: pageLines,
    });
  }
  return factcards;
}

async function main() {
  const browser = await chromium.launch({
    headless: true,
    executablePath: "C:/Program Files/Google/Chrome/Application/chrome.exe",
  });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1200 } });
  await login(page);

  const migration = {
    schemaVersion: "0.1",
    generatedAt: new Date().toISOString(),
    source: {
      name: "Q4 Academy",
      baseUrl,
      extractionMode: "authenticated_read_only",
      account: email,
    },
    rightsNote:
      "Gebruiker heeft aangegeven dat de inhoud afkomstig is uit een oud eigen-beheer e-learning systeem en bedoeld is voor migratie naar nieuw eigen beheer.",
    modules: [
      {
        id: "disc",
        title: "DISC",
        description: "Module voor DISC, menselijk gedrag en het Persoonlijke Stijl (DISC) Profiel.",
        courses: [],
      },
    ],
    factcards: [],
  };

  for (const seed of courseSeeds) {
    migration.modules[0].courses.push(await extractCourse(page, seed));
  }
  migration.factcards = await extractFactcards(page);

  for (const course of migration.modules[0].courses) {
    course.factcards = migration.factcards
      .filter((card) => card.rawText.includes(course.title.replace(/^Cursus \d+:\s*/, "")) || card.rawText.includes(course.title))
      .map((card) => card.sourcePath);
  }

  await browser.close();
  fs.writeFileSync(outputPath, `${JSON.stringify(migration, null, 2)}\n`, "utf8");
  console.log(outputPath);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
