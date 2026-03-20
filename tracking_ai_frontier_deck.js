const fs = require("fs");
const path = require("path");
const PptxGenJS = require("pptxgenjs");
const {
  autoFontSize,
  calcTextBox,
  imageSizingContain,
  safeOuterShadow,
  warnIfSlideHasOverlaps,
  warnIfSlideElementsOutOfBounds,
} = require("./pptxgenjs_helpers");

const pptx = new PptxGenJS();
const SHAPE = pptx.ShapeType;

const ROOT = __dirname;
const SLIDES_DIR = path.join(ROOT, "slides");
const IMG_DIR = path.join(SLIDES_DIR, "imgs");
const REF_DIR = path.join(SLIDES_DIR, "references");

const TITLE_FONT = "Avenir Next";
const BODY_FONT = "Aptos";
const MONO_FONT = "Courier New";

const COLORS = {
  paper: "F6F0E8",
  paperAlt: "F2E7D8",
  ink: "1F2B36",
  inkSoft: "51606C",
  teal: "2C7A78",
  tealSoft: "D8ECEA",
  orange: "C76A36",
  orangeSoft: "F4E0D2",
  gold: "D5B36B",
  goldSoft: "F6ECCD",
  sky: "D8E8F2",
  slate: "6E7A87",
  white: "FFFFFF",
  charcoal: "25343F",
  mist: "E8EEF2",
  rose: "EAD6D0",
  green: "D7E9DB",
  navy: "203544",
  border: "D7CDBE",
};

const TOOL_LINKS = {
  notebooklm: "https://notebooklm.google.com/",
  notebook: "https://notebooklm.google.com/notebook/81fd83eb-0924-4b62-bf50-d537d5693eae?pli=1",
  codex: "https://openai.com/codex",
};

const scoringPromptPath = path.join(
  REF_DIR,
  "codex_example",
  "scoring-prompt.md"
);
const teacherPromptPath = path.join(
  REF_DIR,
  "codex_example",
  "teacher_feedback_prompt.md"
);
const studentWorkDir = path.join(REF_DIR, "codex_example", "student_work");
const studentFeedbackDir = path.join(
  REF_DIR,
  "codex_example",
  "student_feedback"
);

const scoringPromptExcerpt = fs
  .readFileSync(scoringPromptPath, "utf8")
  .trim()
  .split("\n")
  .slice(0, 8)
  .join("\n");

const teacherPromptExcerpt = fs
  .readFileSync(teacherPromptPath, "utf8")
  .trim()
  .split("\n")
  .slice(0, 8)
  .join("\n");

const studentWorkCount = fs
  .readdirSync(studentWorkDir)
  .filter((name) => name.endsWith(".docx")).length;
const studentFeedbackCount = fs
  .readdirSync(studentFeedbackDir)
  .filter((name) => name.endsWith(".docx")).length;

pptx.layout = "LAYOUT_WIDE";
pptx.author = "OpenAI Codex";
pptx.company = "OpenAI";
pptx.subject = "Tracking the AI Frontier";
pptx.title = "Tracking the AI Frontier - Implications for K-12 Education";
pptx.lang = "en-US";
pptx.theme = {
  headFontFace: TITLE_FONT,
  bodyFontFace: BODY_FONT,
  lang: "en-US",
};

function num(id) {
  return String(id).padStart(2, "0");
}

function imagePath(name) {
  return path.join(IMG_DIR, name);
}

function hasImage(name) {
  return fs.existsSync(imagePath(name));
}

function sectionLabel(slideNumber) {
  if (slideNumber <= 8) return "Demystifying AI";
  if (slideNumber <= 12) return "Tracking the Frontier";
  if (slideNumber <= 14) return "NotebookLM";
  if (slideNumber <= 26) return "Codex Workflow";
  return "Teaching and Learning";
}

function sectionAccent(slideNumber) {
  if (slideNumber <= 8) return COLORS.orange;
  if (slideNumber <= 12) return COLORS.teal;
  if (slideNumber <= 14) return COLORS.gold;
  if (slideNumber <= 26) return COLORS.navy;
  return COLORS.teal;
}

function setBackground(slide, dark = false) {
  slide.background = { color: dark ? COLORS.navy : COLORS.paper };
  slide.addShape(SHAPE.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 7.5,
    line: { color: dark ? COLORS.navy : COLORS.paper, transparency: 100 },
    fill: { color: dark ? COLORS.navy : COLORS.paper },
  });
  slide.addShape(SHAPE.ellipse, {
    x: 9.85,
    y: 0.15,
    w: 3.2,
    h: 3.2,
    line: { color: dark ? COLORS.teal : COLORS.gold, transparency: 100 },
    fill: {
      color: dark ? COLORS.teal : COLORS.gold,
      transparency: dark ? 82 : 88,
    },
  });
  slide.addShape(SHAPE.ellipse, {
    x: 0.05,
    y: 5.1,
    w: 2.2,
    h: 2.2,
    line: { color: dark ? COLORS.orange : COLORS.teal, transparency: 100 },
    fill: {
      color: dark ? COLORS.orange : COLORS.teal,
      transparency: dark ? 86 : 92,
    },
  });
}

function addChrome(slide, slideNumber, { dark = false } = {}) {
  const accent = sectionAccent(slideNumber);
  slide.addShape(SHAPE.rect, {
    x: 0,
    y: 0,
    w: 13.333,
    h: 0.16,
    line: { color: accent, transparency: 100 },
    fill: { color: accent },
  });
  slide.addShape(SHAPE.roundRect, {
    x: 0.6,
    y: 0.32,
    w: 1.95,
    h: 0.38,
    rectRadius: 0.06,
    line: { color: accent, transparency: 100 },
    fill: { color: dark ? COLORS.charcoal : accent },
    transparency: dark ? 12 : 0,
  });
  slide.addText(sectionLabel(slideNumber), {
    x: 0.77,
    y: 0.385,
    w: 1.6,
    h: 0.18,
    fontFace: BODY_FONT,
    fontSize: 10.5,
    bold: true,
    color: COLORS.white,
    margin: 0,
    align: "center",
  });
  slide.addText(num(slideNumber), {
    x: 12.0,
    y: 0.34,
    w: 0.55,
    h: 0.22,
    fontFace: BODY_FONT,
    fontSize: 11,
    bold: true,
    color: dark ? COLORS.paperAlt : COLORS.inkSoft,
    align: "right",
    margin: 0,
  });
}

function addTitle(slide, title, options = {}) {
  const x = options.x ?? 0.7;
  const y = options.y ?? 0.9;
  const w = options.w ?? 8.9;
  const h = options.h ?? 0.74;
  const color = options.color ?? COLORS.ink;
  const maxFontSize = options.maxFontSize ?? 28;
  const minFontSize = options.minFontSize ?? 20;
  const fontSize = options.fontSize ?? 26;
  const titleOpts = autoFontSize(title, TITLE_FONT, {
    x,
    y,
    w,
    h,
    fontSize,
    minFontSize,
    maxFontSize,
    bold: true,
    color,
    margin: 0,
    valign: "mid",
    fit: "shrink",
  });
  slide.addText(title, titleOpts);
}

function addSubtitle(slide, subtitle, options = {}) {
  if (!subtitle) return;
  slide.addText(subtitle, {
    x: options.x ?? 0.72,
    y: options.y ?? 1.67,
    w: options.w ?? 8.3,
    h: options.h ?? 0.46,
    fontFace: BODY_FONT,
    fontSize: options.fontSize ?? 17,
    color: options.color ?? COLORS.inkSoft,
    margin: 0,
    italic: options.italic ?? false,
  });
}

function addFooter(slide, text) {
  slide.addText(text, {
    x: 0.72,
    y: 7.03,
    w: 8.4,
    h: 0.2,
    fontFace: BODY_FONT,
    fontSize: 9.5,
    color: COLORS.slate,
    margin: 0,
  });
}

function addAccentLine(slide, x, y, w, color) {
  slide.addShape(SHAPE.line, {
    x,
    y,
    w,
    h: 0,
    line: { color, width: 1.5 },
  });
}

function addCard(slide, options) {
  const fill = options.fill ?? COLORS.white;
  const line = options.line ?? COLORS.border;
  const titleColor = options.titleColor ?? COLORS.ink;
  const bodyColor = options.bodyColor ?? COLORS.inkSoft;
  slide.addShape(SHAPE.roundRect, {
    x: options.x,
    y: options.y,
    w: options.w,
    h: options.h,
    rectRadius: 0.08,
    line: { color: line, width: 1 },
    fill: { color: fill },
    shadow: safeOuterShadow("B39B7A", 0.12, 45, 2, 1),
  });
  slide.addShape(SHAPE.rect, {
    x: options.x,
    y: options.y,
    w: options.w,
    h: 0.09,
    line: { color: options.accent ?? line, transparency: 100 },
    fill: { color: options.accent ?? line },
  });

  const titleOpts = autoFontSize(options.title, TITLE_FONT, {
    x: options.x + 0.22,
    y: options.y + 0.18,
    w: options.w - 0.44,
    h: 0.42,
    fontSize: options.titleSize ?? 18,
    minFontSize: 12,
    maxFontSize: options.titleMax ?? 20,
    bold: true,
    color: titleColor,
    margin: 0,
  });
  slide.addText(options.title, titleOpts);

  if (options.body) {
    const layout = calcTextBox(options.bodySize ?? 13.5, {
      text: options.body,
      w: options.w - 0.44,
      fontFace: BODY_FONT,
      margin: 0,
      padding: 0.02,
    });
    slide.addText(options.body, {
      x: options.x + 0.22,
      y: options.y + 0.67,
      w: options.w - 0.44,
      h: Math.min(options.h - 0.82, layout.h + 0.08),
      fontFace: BODY_FONT,
      fontSize: options.bodySize ?? 13.5,
      color: bodyColor,
      margin: 0,
      valign: "top",
    });
  }
}

function addBulletRows(slide, items, options = {}) {
  const x = options.x ?? 0.95;
  const y = options.y ?? 2.1;
  const w = options.w ?? 5.2;
  const gap = options.gap ?? 0.54;
  const fontSize = options.fontSize ?? 19;
  const dotColor = options.dotColor ?? COLORS.orange;
  const textColor = options.textColor ?? COLORS.ink;
  items.forEach((item, index) => {
    const rowY = y + index * gap;
    slide.addShape(SHAPE.ellipse, {
      x,
      y: rowY + 0.14,
      w: 0.12,
      h: 0.12,
      line: { color: dotColor, transparency: 100 },
      fill: { color: dotColor },
    });
    slide.addText(item, {
      x: x + 0.2,
      y: rowY,
      w,
      h: 0.34,
      fontFace: BODY_FONT,
      fontSize,
      color: textColor,
      margin: 0,
      breakLine: false,
    });
  });
}

function addLinkPill(slide, label, url, options = {}) {
  slide.addShape(SHAPE.roundRect, {
    x: options.x ?? 0.74,
    y: options.y ?? 5.95,
    w: options.w ?? 2.8,
    h: options.h ?? 0.52,
    rectRadius: 0.08,
    line: { color: options.line ?? COLORS.teal, width: 1.2 },
    fill: { color: options.fill ?? COLORS.white },
  });
  slide.addText([
    {
      text: label,
      options: {
        hyperlink: { url },
        color: options.color ?? COLORS.teal,
        underline: true,
        bold: true,
      },
    },
  ], {
    x: (options.x ?? 0.74) + 0.18,
    y: (options.y ?? 5.95) + 0.13,
    w: (options.w ?? 2.8) - 0.36,
    h: 0.22,
    fontFace: BODY_FONT,
    fontSize: options.fontSize ?? 13,
    margin: 0,
    align: "center",
  });
}

function addFramedImage(slide, filePath, options = {}) {
  slide.addShape(SHAPE.roundRect, {
    x: options.x,
    y: options.y,
    w: options.w,
    h: options.h,
    rectRadius: 0.08,
    line: { color: options.line ?? COLORS.border, width: 1 },
    fill: { color: options.backfill ?? COLORS.white },
    shadow: safeOuterShadow("8F7A61", 0.12, 45, 2, 1),
  });
  slide.addImage({
    path: filePath,
    ...imageSizingContain(
      filePath,
      options.x + 0.08,
      options.y + 0.08,
      options.w - 0.16,
      options.h - 0.16
    ),
  });
}

function addMonospaceBox(slide, text, options = {}) {
  slide.addShape(SHAPE.roundRect, {
    x: options.x,
    y: options.y,
    w: options.w,
    h: options.h,
    rectRadius: 0.06,
    line: { color: options.line ?? COLORS.border, width: 1 },
    fill: { color: options.fill ?? COLORS.white },
  });
  slide.addText(text, {
    x: options.x + 0.16,
    y: options.y + 0.14,
    w: options.w - 0.32,
    h: options.h - 0.28,
    fontFace: MONO_FONT,
    fontSize: options.fontSize ?? 10.5,
    color: options.color ?? COLORS.charcoal,
    margin: 0,
    valign: "top",
    breakLine: false,
  });
}

function addDataChip(slide, label, value, options = {}) {
  slide.addShape(SHAPE.roundRect, {
    x: options.x,
    y: options.y,
    w: options.w ?? 1.6,
    h: options.h ?? 0.8,
    rectRadius: 0.06,
    line: { color: options.line ?? COLORS.border, width: 1 },
    fill: { color: options.fill ?? COLORS.white },
  });
  slide.addText(label, {
    x: options.x + 0.12,
    y: options.y + 0.12,
    w: (options.w ?? 1.6) - 0.24,
    h: 0.18,
    fontFace: BODY_FONT,
    fontSize: 10,
    bold: true,
    color: COLORS.inkSoft,
    align: "center",
    margin: 0,
  });
  slide.addText(String(value), {
    x: options.x + 0.12,
    y: options.y + 0.3,
    w: (options.w ?? 1.6) - 0.24,
    h: 0.3,
    fontFace: TITLE_FONT,
    fontSize: 22,
    bold: true,
    color: options.valueColor ?? COLORS.ink,
    align: "center",
    margin: 0,
  });
}

function finalizeSlide(slide) {
  // The diagnostics helpers are useful during iterative layout work, but this deck
  // intentionally layers text over cards and images. Opt into the warnings only
  // when actively debugging layout.
  if (process.env.SLIDE_DIAGNOSTICS === "1") {
    warnIfSlideHasOverlaps(slide, pptx, {
      muteContainment: true,
      ignoreLines: true,
      ignoreDecorativeShapes: true,
    });
    warnIfSlideElementsOutOfBounds(slide, pptx);
  }
}

function addTitleSlide() {
  const slide = pptx.addSlide();
  setBackground(slide, true);
  slide.addShape(SHAPE.rect, {
    x: 0.75,
    y: 1.0,
    w: 0.18,
    h: 4.9,
    line: { color: COLORS.gold, transparency: 100 },
    fill: { color: COLORS.gold },
  });
  slide.addText("Tracking the AI Frontier", {
    x: 1.18,
    y: 1.22,
    w: 8.2,
    h: 1.15,
    fontFace: TITLE_FONT,
    fontSize: 28,
    bold: true,
    color: COLORS.white,
    margin: 0,
  });
  slide.addText("Implications for K-12 Education", {
    x: 1.22,
    y: 2.58,
    w: 5.8,
    h: 0.44,
    fontFace: BODY_FONT,
    fontSize: 20,
    color: COLORS.paperAlt,
    margin: 0,
  });
  slide.addShape(SHAPE.roundRect, {
    x: 8.95,
    y: 1.18,
    w: 3.55,
    h: 4.9,
    rectRadius: 0.08,
    line: { color: COLORS.teal, width: 1 },
    fill: { color: COLORS.charcoal },
    transparency: 8,
  });
  addCard(slide, {
    x: 9.25,
    y: 1.58,
    w: 2.95,
    h: 1.08,
    title: "What this session does",
    body: "Demystify AI, show the frontier, and connect it to curriculum and assessment.",
    fill: COLORS.paper,
    line: COLORS.gold,
    accent: COLORS.gold,
    titleSize: 14,
    bodySize: 11.8,
  });
  addCard(slide, {
    x: 9.25,
    y: 2.88,
    w: 2.95,
    h: 1.08,
    title: "Audience",
    body: "K-12 educators making sense of a fast-moving technology moment.",
    fill: COLORS.paper,
    line: COLORS.teal,
    accent: COLORS.teal,
    titleSize: 14,
    bodySize: 11.8,
  });
  addCard(slide, {
    x: 9.25,
    y: 4.18,
    w: 2.95,
    h: 1.08,
    title: "Tone",
    body: "Clear-eyed, practical, and willing to wrestle with real tradeoffs.",
    fill: COLORS.paper,
    line: COLORS.orange,
    accent: COLORS.orange,
    titleSize: 14,
    bodySize: 11.8,
  });
  slide.addText("Presentation deck generated in PowerPoint format with editable text, shapes, and images.", {
    x: 1.2,
    y: 6.55,
    w: 7.8,
    h: 0.22,
    fontFace: BODY_FONT,
    fontSize: 10.5,
    color: COLORS.paperAlt,
    margin: 0,
  });
  finalizeSlide(slide);
}

function addQuestionSlide(slideNumber, title, subtitle) {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, slideNumber);
  addTitle(slide, title, { w: 9.4, fontSize: 28 });
  addSubtitle(slide, subtitle, { y: 1.62, w: 7.7, fontSize: 19 });
  addAccentLine(slide, 0.72, 2.2, 4.7, COLORS.orange);
  addCard(slide, {
    x: 0.74,
    y: 2.55,
    w: 3.6,
    h: 1.55,
    title: "This is not a someday talk",
    body: "The point is not abstract future AI. The point is what is already changing in schools and teacher workflows.",
    fill: COLORS.white,
    line: COLORS.orange,
    accent: COLORS.orange,
  });
  addCard(slide, {
    x: 4.6,
    y: 2.55,
    w: 3.6,
    h: 1.55,
    title: "Old mental models age fast",
    body: "Educators often remember an earlier, weaker version of these tools. That can lead to poor decisions.",
    fill: COLORS.white,
    line: COLORS.teal,
    accent: COLORS.teal,
  });
  addCard(slide, {
    x: 8.46,
    y: 2.55,
    w: 3.95,
    h: 1.55,
    title: "Professional response matters",
    body: "The goal is thoughtful adaptation, not hype and not denial.",
    fill: COLORS.white,
    line: COLORS.gold,
    accent: COLORS.gold,
  });
  slide.addText("Many schools are still catching up to a tool landscape that keeps shifting under their feet.", {
    x: 0.75,
    y: 4.65,
    w: 6.8,
    h: 0.3,
    fontFace: BODY_FONT,
    fontSize: 19,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  addBulletRows(slide, [
    "AI has moved from novelty to meaningful capability.",
    "Students and teachers are both feeling the effects.",
    "Static policies do not age well when the baseline keeps changing.",
  ], {
    x: 0.84,
    y: 5.12,
    w: 7.7,
    gap: 0.48,
    fontSize: 17,
    dotColor: COLORS.orange,
  });
  finalizeSlide(slide);
}

function addImageStorySlide(slideNumber, title, subtitle, imageName, bullets, accent) {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, slideNumber);
  addTitle(slide, title, { w: 5.4 });
  addSubtitle(slide, subtitle, { w: 5.2, y: 1.63 });
  addBulletRows(slide, bullets, {
    x: 0.82,
    y: 2.35,
    w: 4.8,
    gap: 0.62,
    fontSize: 17,
    dotColor: accent,
  });
  addFramedImage(slide, imagePath(imageName), {
    x: 6.08,
    y: 1.15,
    w: 6.5,
    h: 5.72,
    line: accent,
  });
  finalizeSlide(slide);
}

function addAiLayersSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 5);
  addTitle(slide, 'What Do We Mean by "AI"?');
  if (hasImage("ai-layers.png")) {
    addFramedImage(slide, imagePath("ai-layers.png"), {
      x: 1.0,
      y: 1.8,
      w: 11.3,
      h: 4.9,
      line: COLORS.orange,
    });
  } else {
    // Native nested boxes keep the slide editable if the placeholder image never arrives.
    const layers = [
      { label: "Artificial Intelligence", x: 0.95, y: 1.95, w: 11.3, h: 4.85, fill: COLORS.orangeSoft, line: COLORS.orange },
      { label: "Machine Learning", x: 1.65, y: 2.5, w: 9.9, h: 3.75, fill: COLORS.goldSoft, line: COLORS.gold },
      { label: "Deep Learning", x: 2.45, y: 3.05, w: 8.3, h: 2.65, fill: COLORS.tealSoft, line: COLORS.teal },
      { label: "Generative AI / Foundation Models / LLMs", x: 3.3, y: 3.6, w: 6.6, h: 1.55, fill: COLORS.white, line: COLORS.navy },
    ];
    layers.forEach((layer, index) => {
      slide.addShape(SHAPE.roundRect, {
        x: layer.x,
        y: layer.y,
        w: layer.w,
        h: layer.h,
        rectRadius: 0.08,
        line: { color: layer.line, width: 1.2 },
        fill: { color: layer.fill },
      });
      slide.addText(layer.label, {
        x: layer.x + 0.24,
        y: layer.y + (index === 3 ? 0.46 : 0.24),
        w: layer.w - 0.48,
        h: 0.4,
        fontFace: TITLE_FONT,
        fontSize: index === 3 ? 18 : 20,
        bold: true,
        color: COLORS.ink,
        margin: 0,
        align: index === 3 ? "center" : "left",
      });
    });
  }
  addFooter(slide, 'When many people say "AI" today, they usually mean the innermost layer on this slide.');
  finalizeSlide(slide);
}

function addCapabilitiesSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 6);
  addTitle(slide, "Why Today's AI Feels Different");
  if (hasImage("current-ai-capabilities.png")) {
    addFramedImage(slide, imagePath("current-ai-capabilities.png"), {
      x: 0.9,
      y: 1.75,
      w: 11.6,
      h: 4.95,
      line: COLORS.teal,
    });
  } else {
    slide.addShape(SHAPE.ellipse, {
      x: 4.9,
      y: 2.65,
      w: 3.4,
      h: 1.3,
      line: { color: COLORS.navy, width: 1.3 },
      fill: { color: COLORS.white },
      shadow: safeOuterShadow("8F7A61", 0.12, 45, 2, 1),
    });
    slide.addText("Current AI\nsystems", {
      x: 5.3,
      y: 3.0,
      w: 2.6,
      h: 0.6,
      fontFace: TITLE_FONT,
      fontSize: 20,
      bold: true,
      color: COLORS.ink,
      align: "center",
      margin: 0,
    });
    const chips = [
      ["Writing", 1.2, 2.2, COLORS.orangeSoft, COLORS.orange],
      ["Summarizing", 1.35, 4.1, COLORS.goldSoft, COLORS.gold],
      ["Explaining", 3.15, 1.55, COLORS.tealSoft, COLORS.teal],
      ["Generating images", 8.75, 1.55, COLORS.sky, COLORS.navy],
      ["Analyzing documents", 9.15, 3.1, COLORS.orangeSoft, COLORS.orange],
      ["Coding", 8.95, 4.65, COLORS.tealSoft, COLORS.teal],
      ["Organizing information", 2.45, 5.15, COLORS.white, COLORS.navy],
      ["Providing feedback", 5.0, 5.35, COLORS.goldSoft, COLORS.gold],
    ];
    chips.forEach(([label, x, y, fill, line]) => {
      slide.addShape(SHAPE.roundRect, {
        x,
        y,
        w: 2.25,
        h: 0.72,
        rectRadius: 0.06,
        line: { color: line, width: 1 },
        fill: { color: fill },
      });
      slide.addText(label, {
        x: x + 0.12,
        y: y + 0.2,
        w: 2.01,
        h: 0.22,
        fontFace: BODY_FONT,
        fontSize: 12.5,
        bold: true,
        align: "center",
        color: COLORS.ink,
        margin: 0,
      });
    });
  }
  finalizeSlide(slide);
}

function addHowModelsWorkSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 7);
  addTitle(slide, "At a High Level, How Do These Models Work?");
  if (hasImage("next-token-prediction.png")) {
    addFramedImage(slide, imagePath("next-token-prediction.png"), {
      x: 0.88,
      y: 1.8,
      w: 6.0,
      h: 4.8,
      line: COLORS.gold,
    });
  } else {
    const steps = [
      { label: "Enormous training data", x: 0.95, y: 2.7, fill: COLORS.orangeSoft, line: COLORS.orange },
      { label: "Pattern learning", x: 3.65, y: 2.7, fill: COLORS.goldSoft, line: COLORS.gold },
      { label: "Next-token prediction", x: 6.35, y: 2.7, fill: COLORS.tealSoft, line: COLORS.teal },
      { label: "Useful outputs", x: 9.05, y: 2.7, fill: COLORS.sky, line: COLORS.navy },
    ];
    steps.forEach((step, index) => {
      slide.addShape(SHAPE.roundRect, {
        x: step.x,
        y: step.y,
        w: 2.2,
        h: 1.1,
        rectRadius: 0.08,
        line: { color: step.line, width: 1.2 },
        fill: { color: step.fill },
      });
      slide.addText(step.label, {
        x: step.x + 0.12,
        y: step.y + 0.3,
        w: 1.96,
        h: 0.4,
        fontFace: BODY_FONT,
        fontSize: 15,
        bold: true,
        align: "center",
        color: COLORS.ink,
        margin: 0,
      });
      if (index < steps.length - 1) {
        slide.addShape(SHAPE.chevron, {
          x: step.x + 2.26,
          y: 3.0,
          w: 0.32,
          h: 0.5,
          line: { color: COLORS.slate, transparency: 100 },
          fill: { color: COLORS.slate },
        });
      }
    });
  }
  addBulletRows(slide, [
    "Trained on enormous amounts of data",
    "Learns patterns and relationships",
    "Predicts what comes next in context",
    "Produces useful outputs from pattern prediction at scale",
  ], {
    x: 1.25,
    y: 4.95,
    w: 10.8,
    gap: 0.42,
    fontSize: 15.5,
    dotColor: COLORS.teal,
  });
  finalizeSlide(slide);
}

function addCapabilitiesLimitsSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 8);
  addTitle(slide, "Powerful, Useful, and Imperfect");
  addCard(slide, {
    x: 0.88,
    y: 1.88,
    w: 5.65,
    h: 3.95,
    title: "Useful capabilities",
    body: "Summarize\nExplain\nGenerate\nOrganize\nAdapt tone and style",
    fill: COLORS.white,
    line: COLORS.teal,
    accent: COLORS.teal,
    titleSize: 20,
    bodySize: 18,
    bodyColor: COLORS.ink,
  });
  addCard(slide, {
    x: 6.78,
    y: 1.88,
    w: 5.65,
    h: 3.95,
    title: "Important limitations",
    body: "Can hallucinate\nCan be confidently wrong\nCan miss nuance\nCan reflect bias\nNeeds verification",
    fill: COLORS.white,
    line: COLORS.orange,
    accent: COLORS.orange,
    titleSize: 20,
    bodySize: 18,
    bodyColor: COLORS.ink,
  });
  slide.addShape(SHAPE.roundRect, {
    x: 2.65,
    y: 6.02,
    w: 8.05,
    h: 0.66,
    rectRadius: 0.06,
    line: { color: COLORS.gold, width: 1 },
    fill: { color: COLORS.goldSoft },
  });
  slide.addText("AI is powerful, but it must be used with judgment.", {
    x: 2.9,
    y: 6.24,
    w: 7.55,
    h: 0.22,
    fontFace: BODY_FONT,
    fontSize: 18,
    bold: true,
    color: COLORS.ink,
    align: "center",
    margin: 0,
  });
  finalizeSlide(slide);
}

function addFrontierDefinitionSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 9);
  addTitle(slide, "What Do We Mean by the AI Frontier?");
  if (hasImage("ai-frontier-capabilities.png")) {
    addFramedImage(slide, imagePath("ai-frontier-capabilities.png"), {
      x: 0.98,
      y: 1.8,
      w: 11.4,
      h: 4.9,
      line: COLORS.teal,
    });
  } else {
    slide.addShape(SHAPE.ellipse, {
      x: 5.1,
      y: 2.75,
      w: 3.1,
      h: 1.08,
      line: { color: COLORS.navy, width: 1.3 },
      fill: { color: COLORS.white },
    });
    slide.addText("The AI Frontier", {
      x: 5.4,
      y: 3.08,
      w: 2.5,
      h: 0.24,
      fontFace: TITLE_FONT,
      fontSize: 19,
      bold: true,
      color: COLORS.ink,
      margin: 0,
      align: "center",
    });
    const petals = [
      ["Reasoning", 1.15, 2.5, COLORS.orange],
      ["Multimodality", 2.5, 4.55, COLORS.gold],
      ["Coding", 5.0, 5.4, COLORS.teal],
      ["Long context", 8.2, 4.55, COLORS.navy],
      ["Tool use", 9.45, 2.5, COLORS.orange],
      ["Autonomy", 8.15, 1.1, COLORS.gold],
      ["Usability", 2.55, 1.1, COLORS.teal],
    ];
    petals.forEach(([label, x, y, line]) => {
      slide.addShape(SHAPE.roundRect, {
        x,
        y,
        w: 2.18,
        h: 0.72,
        rectRadius: 0.06,
        line: { color: line, width: 1 },
        fill: { color: COLORS.white },
      });
      slide.addText(label, {
        x: x + 0.12,
        y: y + 0.2,
        w: 1.94,
        h: 0.2,
        fontFace: BODY_FONT,
        fontSize: 13,
        bold: true,
        color: COLORS.ink,
        align: "center",
        margin: 0,
      });
    });
  }
  finalizeSlide(slide);
}

function addLabsSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 10);
  addTitle(slide, "Who Is Driving the Frontier?");
  addSubtitle(slide, "A small set of labs are setting the pace that schools are trying to interpret.");
  addCard(slide, {
    x: 0.9,
    y: 2.1,
    w: 3.75,
    h: 3.5,
    title: "OpenAI",
    body: "Broad public adoption and productization.\nStrong influence on how the public encounters frontier systems.",
    fill: COLORS.white,
    line: COLORS.orange,
    accent: COLORS.orange,
    titleSize: 24,
    bodySize: 16,
  });
  addCard(slide, {
    x: 4.8,
    y: 2.1,
    w: 3.75,
    h: 3.5,
    title: "Google / DeepMind",
    body: "Deep research bench plus a multimodal product ecosystem.\nImportant when source-grounded and media-rich workflows matter.",
    fill: COLORS.white,
    line: COLORS.teal,
    accent: COLORS.teal,
    titleSize: 22,
    bodySize: 16,
  });
  addCard(slide, {
    x: 8.7,
    y: 2.1,
    w: 3.75,
    h: 3.5,
    title: "Anthropic",
    body: "Known for reasoning, safety framing, and professional workflows.\nA major voice in enterprise and educator-adjacent use cases.",
    fill: COLORS.white,
    line: COLORS.gold,
    accent: COLORS.gold,
    titleSize: 24,
    bodySize: 16,
  });
  finalizeSlide(slide);
}

function addTimelineSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 11);
  addTitle(slide, "Why the Last 36 Months Matter");
  if (hasImage("frontier-progress-timeline.png")) {
    addFramedImage(slide, imagePath("frontier-progress-timeline.png"), {
      x: 0.85,
      y: 1.95,
      w: 11.75,
      h: 4.6,
      line: COLORS.gold,
    });
  } else {
    slide.addShape(SHAPE.line, {
      x: 1.2,
      y: 3.8,
      w: 10.7,
      h: 0,
      line: { color: COLORS.navy, width: 2.25 },
    });
    const years = [
      ["2023", 1.35, "Writing quality\ngets attention", COLORS.orange],
      ["2024", 4.0, "Multimodality\nbecomes normal", COLORS.gold],
      ["2025", 6.65, "Coding + long context\nfeel mainstream", COLORS.teal],
      ["2026", 9.3, "Workflow automation\nlooks more polished", COLORS.navy],
    ];
    years.forEach(([year, x, body, line]) => {
      slide.addShape(SHAPE.ellipse, {
        x,
        y: 3.47,
        w: 0.55,
        h: 0.55,
        line: { color: line, width: 1 },
        fill: { color: COLORS.white },
      });
      slide.addText(year, {
        x: x - 0.1,
        y: 2.75,
        w: 0.75,
        h: 0.2,
        fontFace: TITLE_FONT,
        fontSize: 16,
        bold: true,
        color: COLORS.ink,
        align: "center",
        margin: 0,
      });
      addCard(slide, {
        x: x - 0.45,
        y: 4.22,
        w: 1.45,
        h: 1.15,
        title: body.split("\n")[0],
        body: body.split("\n")[1],
        fill: COLORS.white,
        line,
        accent: line,
        titleSize: 12.2,
        bodySize: 11.2,
      });
    });
  }
  addFooter(slide, "Reasoning, multimodality, coding assistance, long context, workflow automation, and polished product integration have all advanced quickly.");
  finalizeSlide(slide);
}

function addAssumptionsSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 12);
  addTitle(slide, "Old Assumptions That No Longer Hold");
  addCard(slide, {
    x: 0.95,
    y: 2.1,
    w: 3.55,
    h: 2.35,
    title: '"AI can only do shallow work"',
    body: "That assumption breaks when systems can organize files, reason over sources, and produce polished artifacts.",
    fill: COLORS.white,
    line: COLORS.orange,
    accent: COLORS.orange,
    titleSize: 17,
    bodySize: 14.2,
  });
  addCard(slide, {
    x: 4.88,
    y: 2.1,
    w: 3.55,
    h: 2.35,
    title: '"AI outputs are always obviously bad"',
    body: "That used to be a safer intuition. It is much less safe now, especially for polished or procedural tasks.",
    fill: COLORS.white,
    line: COLORS.teal,
    accent: COLORS.teal,
    titleSize: 17,
    bodySize: 14.2,
  });
  addCard(slide, {
    x: 8.82,
    y: 2.1,
    w: 3.55,
    h: 2.35,
    title: '"Students will only use AI for cheating"',
    body: "Students will also use it for planning, explaining, revising, and completing real work in ways schools must understand.",
    fill: COLORS.white,
    line: COLORS.gold,
    accent: COLORS.gold,
    titleSize: 17,
    bodySize: 14.2,
  });
  slide.addShape(SHAPE.roundRect, {
    x: 1.45,
    y: 5.3,
    w: 10.4,
    h: 0.78,
    rectRadius: 0.08,
    line: { color: COLORS.navy, width: 1 },
    fill: { color: COLORS.navy },
  });
  slide.addText("Schools tend to update more slowly than the technology itself.", {
    x: 1.78,
    y: 5.56,
    w: 9.75,
    h: 0.24,
    fontFace: BODY_FONT,
    fontSize: 18,
    bold: true,
    color: COLORS.white,
    align: "center",
    margin: 0,
  });
  finalizeSlide(slide);
}

function addNotebookIntroSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 13);
  addTitle(slide, "NotebookLM: Source-Grounded AI");
  addSubtitle(slide, "A useful entry point because it starts with sources instead of a blank chat box.");
  addCard(slide, {
    x: 0.9,
    y: 2.25,
    w: 3.7,
    h: 3.0,
    title: "What it does",
    body: "Synthesizes, explains, organizes, and transforms material from a source set.",
    fill: COLORS.white,
    line: COLORS.gold,
    accent: COLORS.gold,
    titleSize: 18,
    bodySize: 16,
  });
  addCard(slide, {
    x: 4.82,
    y: 2.25,
    w: 3.7,
    h: 3.0,
    title: "Why educators care",
    body: "Teacher prep, student study, and source-grounded inquiry are all common school workflows.",
    fill: COLORS.white,
    line: COLORS.teal,
    accent: COLORS.teal,
    titleSize: 18,
    bodySize: 16,
  });
  addCard(slide, {
    x: 8.75,
    y: 2.25,
    w: 3.7,
    h: 3.0,
    title: "Why it matters",
    body: "It shows how AI can stay closer to the evidence students and teachers are actually working from.",
    fill: COLORS.white,
    line: COLORS.orange,
    accent: COLORS.orange,
    titleSize: 18,
    bodySize: 16,
  });
  addLinkPill(slide, "NotebookLM", TOOL_LINKS.notebooklm, {
    x: 5.1,
    y: 5.82,
    w: 3.1,
    h: 0.56,
    line: COLORS.teal,
    color: COLORS.teal,
  });
  finalizeSlide(slide);
}

function addNotebookPreparedSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 14);
  addTitle(slide, "Prepared Notebook: Earth's Motions in Space", {
    w: 8.8,
  });
  addCard(slide, {
    x: 0.85,
    y: 1.95,
    w: 5.4,
    h: 3.95,
    title: "Notebook focus",
    body: "Earth's 23.5 degree axial tilt and the seasons.\nEarth's rotation, the moon's gravity, and climate-related changes in spin.\nSolar vs. sidereal time, leap years, and the Gregorian calendar.\nA season-dial model for noon Sun angles and shifting shadows.",
    fill: COLORS.white,
    line: COLORS.teal,
    accent: COLORS.teal,
    titleSize: 18,
    bodySize: 13.5,
  });
  addCard(slide, {
    x: 6.5,
    y: 1.95,
    w: 2.75,
    h: 1.75,
    title: "Sources",
    body: "Educational materials plus science video transcripts.",
    fill: COLORS.white,
    line: COLORS.orange,
    accent: COLORS.orange,
    titleSize: 16,
    bodySize: 14,
  });
  addCard(slide, {
    x: 9.55,
    y: 1.95,
    w: 2.75,
    h: 1.75,
    title: "Generated tools",
    body: "Flashcards, quiz, mind map, and interactive podcast.",
    fill: COLORS.white,
    line: COLORS.gold,
    accent: COLORS.gold,
    titleSize: 16,
    bodySize: 14,
  });
  addCard(slide, {
    x: 6.5,
    y: 4.0,
    w: 5.8,
    h: 1.9,
    title: "What I will show live",
    body: "A prepared notebook that demonstrates synthesis, study tools, and interactive exploration without relying on screenshots.",
    fill: COLORS.white,
    line: COLORS.navy,
    accent: COLORS.navy,
    titleSize: 17,
    bodySize: 14.8,
  });
  addLinkPill(slide, "Open prepared notebook", TOOL_LINKS.notebook, {
    x: 4.45,
    y: 6.18,
    w: 4.45,
    h: 0.56,
    line: COLORS.navy,
    color: COLORS.navy,
  });
  finalizeSlide(slide);
}

function addCodexIntroSlide() {
  const slide = pptx.addSlide();
  setBackground(slide, true);
  addChrome(slide, 15, { dark: true });
  addTitle(slide, "What Is Codex?", {
    color: COLORS.white,
    w: 7.1,
    fontSize: 30,
  });
  addSubtitle(slide, "The Codex Desktop App acts more like a project workspace than a one-shot chatbot.", {
    color: COLORS.paperAlt,
    w: 7.1,
  });
  addCard(slide, {
    x: 0.85,
    y: 2.18,
    w: 3.55,
    h: 3.0,
    title: "Project context",
    body: "It can work with files, folder structure, instructions, and tools inside a real project.",
    fill: COLORS.paper,
    line: COLORS.teal,
    accent: COLORS.teal,
    titleSize: 18,
    bodySize: 15.5,
  });
  addCard(slide, {
    x: 4.72,
    y: 2.18,
    w: 3.55,
    h: 3.0,
    title: "Parallel work",
    body: "It can manage longer tasks and coordinate work that would be cumbersome in a normal chat interface.",
    fill: COLORS.paper,
    line: COLORS.gold,
    accent: COLORS.gold,
    titleSize: 18,
    bodySize: 15.5,
  });
  addCard(slide, {
    x: 8.6,
    y: 2.18,
    w: 3.55,
    h: 3.0,
    title: "This demo",
    body: "I am using it for structured grading and feedback, which is an atypical and revealing use case.",
    fill: COLORS.paper,
    line: COLORS.orange,
    accent: COLORS.orange,
    titleSize: 18,
    bodySize: 15.5,
  });
  addLinkPill(slide, "OpenAI Codex", TOOL_LINKS.codex, {
    x: 5.0,
    y: 5.95,
    w: 3.2,
    h: 0.56,
    fill: COLORS.paper,
    line: COLORS.teal,
    color: COLORS.teal,
  });
  finalizeSlide(slide);
}

function addGradingProblemSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 16);
  addTitle(slide, "The Grading Problem");
  addSubtitle(slide, "The use case matters because it looks like teacher work, not software development.");
  addCard(slide, {
    x: 0.95,
    y: 2.15,
    w: 3.6,
    h: 3.0,
    title: "Student-by-student scoring",
    body: "A teacher has a folder of literary responses that each need a score tied to a rubric.",
    fill: COLORS.white,
    line: COLORS.orange,
    accent: COLORS.orange,
    titleSize: 18,
    bodySize: 16,
  });
  addCard(slide, {
    x: 4.87,
    y: 2.15,
    w: 3.6,
    h: 3.0,
    title: "Actionable feedback",
    body: "Each student also needs comments that are constructive, specific, and ready to share.",
    fill: COLORS.white,
    line: COLORS.teal,
    accent: COLORS.teal,
    titleSize: 18,
    bodySize: 16,
  });
  addCard(slide, {
    x: 8.79,
    y: 2.15,
    w: 3.6,
    h: 3.0,
    title: "Teacher-facing synthesis",
    body: "The teacher needs a class score tracker plus a summary of patterns and next instructional steps.",
    fill: COLORS.white,
    line: COLORS.gold,
    accent: COLORS.gold,
    titleSize: 18,
    bodySize: 16,
  });
  slide.addShape(SHAPE.roundRect, {
    x: 2.8,
    y: 5.62,
    w: 7.7,
    h: 0.72,
    rectRadius: 0.06,
    line: { color: COLORS.navy, width: 1 },
    fill: { color: COLORS.navy },
  });
  slide.addText("This is real professional work, not code generation.", {
    x: 3.1,
    y: 5.88,
    w: 7.1,
    h: 0.22,
    fontFace: BODY_FONT,
    fontSize: 18,
    bold: true,
    color: COLORS.white,
    margin: 0,
    align: "center",
  });
  finalizeSlide(slide);
}

function addSourceTextSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 17);
  addTitle(slide, "Source Text: The Last Question");
  slide.addShape(SHAPE.roundRect, {
    x: 0.95,
    y: 1.95,
    w: 4.35,
    h: 4.6,
    rectRadius: 0.08,
    line: { color: COLORS.navy, width: 1.2 },
    fill: { color: COLORS.white },
  });
  slide.addText("Isaac Asimov", {
    x: 1.3,
    y: 2.3,
    w: 2.8,
    h: 0.24,
    fontFace: BODY_FONT,
    fontSize: 16,
    color: COLORS.inkSoft,
    margin: 0,
  });
  slide.addText("The Last\nQuestion", {
    x: 1.28,
    y: 2.65,
    w: 2.9,
    h: 0.95,
    fontFace: TITLE_FONT,
    fontSize: 27,
    bold: true,
    color: COLORS.ink,
    margin: 0,
  });
  slide.addShape(SHAPE.line, {
    x: 1.3,
    y: 3.78,
    w: 2.4,
    h: 0,
    line: { color: COLORS.orange, width: 1.5 },
  });
  slide.addText("Short story used as the basis for a brief literary analysis response.", {
    x: 1.3,
    y: 4.05,
    w: 3.2,
    h: 0.55,
    fontFace: BODY_FONT,
    fontSize: 15.5,
    color: COLORS.inkSoft,
    margin: 0,
  });
  addLinkPill(slide, "Source text PDF", "file://" + path.join(REF_DIR, "codex_example", "1956-Isaac-Asimov-The-Last-Question.pdf"), {
    x: 1.18,
    y: 5.3,
    w: 3.7,
    h: 0.5,
    line: COLORS.teal,
    color: COLORS.teal,
  });
  addCard(slide, {
    x: 5.75,
    y: 2.15,
    w: 6.0,
    h: 1.2,
    title: "Prompt focus",
    body: "How does the relationship between humans and the computer change as the computer becomes more advanced?",
    fill: COLORS.white,
    line: COLORS.orange,
    accent: COLORS.orange,
    titleSize: 17,
    bodySize: 15,
  });
  addBulletRows(slide, [
    "Isaac Asimov short story",
    "Students respond to the changing human-computer relationship",
    "Strong fit for a short literary analysis task",
  ], {
    x: 5.95,
    y: 3.8,
    w: 5.55,
    gap: 0.62,
    fontSize: 18,
    dotColor: COLORS.teal,
  });
  finalizeSlide(slide);
}

function addPromptRubricSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 18);
  addTitle(slide, "Student Prompt and Scoring Rubric");
  addCard(slide, {
    x: 0.9,
    y: 1.95,
    w: 11.55,
    h: 1.15,
    title: "Student task",
    body: "In a brief response under one page, explain how the relationship between humans and the computer changes as the computer becomes more advanced.",
    fill: COLORS.white,
    line: COLORS.navy,
    accent: COLORS.navy,
    titleSize: 17,
    bodySize: 15.5,
  });
  addCard(slide, {
    x: 0.9,
    y: 3.45,
    w: 3.65,
    h: 2.1,
    title: "Category 1",
    body: "Understanding of the changing human-computer relationship",
    fill: COLORS.white,
    line: COLORS.orange,
    accent: COLORS.orange,
    titleSize: 17,
    bodySize: 15,
  });
  addCard(slide, {
    x: 4.84,
    y: 3.45,
    w: 3.65,
    h: 2.1,
    title: "Category 2",
    body: "Use of story evidence and specific details",
    fill: COLORS.white,
    line: COLORS.teal,
    accent: COLORS.teal,
    titleSize: 17,
    bodySize: 15,
  });
  addCard(slide, {
    x: 8.78,
    y: 3.45,
    w: 3.65,
    h: 2.1,
    title: "Category 3",
    body: "Clarity and focus of writing",
    fill: COLORS.white,
    line: COLORS.gold,
    accent: COLORS.gold,
    titleSize: 17,
    bodySize: 15,
  });
  addDataChip(slide, "Total score", "6 pts", {
    x: 5.85,
    y: 5.95,
    w: 1.65,
    valueColor: COLORS.navy,
    fill: COLORS.white,
    line: COLORS.navy,
  });
  finalizeSlide(slide);
}

function addCodexApproachSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 19);
  addTitle(slide, "Our Codex Approach");
  const steps = [
    "Give Codex the student work folder, rubric, and prompt",
    "Ask it to score each response consistently",
    "Create a new feedback copy for each student",
    "Generate a CSV tracker for the full class",
    "Ask for a teacher-facing summary document",
  ];
  steps.forEach((step, index) => {
    const x = 0.95 + index * 2.42;
    slide.addShape(SHAPE.roundRect, {
      x,
      y: 2.55,
      w: 2.0,
      h: 2.15,
      rectRadius: 0.06,
      line: { color: index % 2 === 0 ? COLORS.teal : COLORS.orange, width: 1 },
      fill: { color: COLORS.white },
    });
    slide.addText(String(index + 1), {
      x: x + 0.72,
      y: 2.82,
      w: 0.56,
      h: 0.4,
      fontFace: TITLE_FONT,
      fontSize: 22,
      bold: true,
      color: COLORS.navy,
      align: "center",
      margin: 0,
    });
    slide.addText(step, {
      x: x + 0.16,
      y: 3.35,
      w: 1.68,
      h: 0.9,
      fontFace: BODY_FONT,
      fontSize: 13,
      color: COLORS.ink,
      margin: 0,
      align: "center",
    });
    if (index < steps.length - 1) {
      slide.addShape(SHAPE.chevron, {
        x: x + 2.07,
        y: 3.2,
        w: 0.22,
        h: 0.42,
        line: { color: COLORS.slate, transparency: 100 },
        fill: { color: COLORS.slate },
      });
    }
  });
  addFooter(slide, "The reveal is not speed alone. It is the ability to operate across a structured project workflow.");
  finalizeSlide(slide);
}

function addPromptWithScreenshotSlide(slideNumber, title, timeLabel, bullets, promptExcerpt, promptFileLabel, imageName) {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, slideNumber);
  addTitle(slide, title, { w: 6.1 });
  slide.addShape(SHAPE.roundRect, {
    x: 0.78,
    y: 1.62,
    w: 2.8,
    h: 0.5,
    rectRadius: 0.06,
    line: { color: COLORS.gold, width: 1 },
    fill: { color: COLORS.goldSoft },
  });
  slide.addText(`Time used by Codex: ${timeLabel}`, {
    x: 0.96,
    y: 1.8,
    w: 2.45,
    h: 0.18,
    fontFace: BODY_FONT,
    fontSize: 11.5,
    bold: true,
    color: COLORS.ink,
    margin: 0,
    align: "center",
  });
  addBulletRows(slide, bullets, {
    x: 0.9,
    y: 2.38,
    w: 4.95,
    gap: 0.56,
    fontSize: 15.5,
    dotColor: COLORS.orange,
  });
  addMonospaceBox(slide, promptExcerpt, {
    x: 0.86,
    y: 4.75,
    w: 4.92,
    h: 1.55,
    fontSize: 9.6,
  });
  slide.addText(promptFileLabel, {
    x: 0.92,
    y: 6.45,
    w: 4.85,
    h: 0.2,
    fontFace: MONO_FONT,
    fontSize: 9.5,
    color: COLORS.slate,
    margin: 0,
  });
  addFramedImage(slide, imagePath(imageName), {
    x: 6.0,
    y: 1.55,
    w: 6.55,
    h: 5.7,
    line: COLORS.navy,
  });
  finalizeSlide(slide);
}

function addActionScreenshotSlide(slideNumber, title, imageName, bullets) {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, slideNumber);
  addTitle(slide, title, { w: 5.5 });
  addBulletRows(slide, bullets, {
    x: 0.82,
    y: 2.1,
    w: 4.7,
    gap: 0.62,
    fontSize: 17,
    dotColor: COLORS.teal,
  });
  addFramedImage(slide, imagePath(imageName), {
    x: 5.82,
    y: 1.2,
    w: 6.72,
    h: 5.95,
    line: COLORS.teal,
  });
  finalizeSlide(slide);
}

function addActualInputsSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 23);
  addTitle(slide, "Actual Inputs");
  addDataChip(slide, "Student docs", studentWorkCount, {
    x: 9.9,
    y: 1.05,
    w: 1.3,
    valueColor: COLORS.navy,
  });
  addCard(slide, {
    x: 0.95,
    y: 1.95,
    w: 5.3,
    h: 1.55,
    title: "Student work folder",
    body: "references/codex_example/student_work/\nTen student .docx submissions in a real folder.",
    fill: COLORS.white,
    line: COLORS.orange,
    accent: COLORS.orange,
    titleSize: 17,
    bodySize: 14.2,
  });
  addCard(slide, {
    x: 6.5,
    y: 1.95,
    w: 5.3,
    h: 1.55,
    title: "Rubric file",
    body: "references/codex_example/Scoring-Rubric.md\nOriginal prompt plus scoring categories.",
    fill: COLORS.white,
    line: COLORS.teal,
    accent: COLORS.teal,
    titleSize: 17,
    bodySize: 14.2,
  });
  addCard(slide, {
    x: 0.95,
    y: 3.85,
    w: 5.3,
    h: 1.55,
    title: "Source text",
    body: "The Last Question\nShort story context for the literary response.",
    fill: COLORS.white,
    line: COLORS.gold,
    accent: COLORS.gold,
    titleSize: 17,
    bodySize: 14.2,
  });
  addCard(slide, {
    x: 6.5,
    y: 3.85,
    w: 5.3,
    h: 1.55,
    title: "Project setup",
    body: "A real project folder, not a one-off prompt box.",
    fill: COLORS.white,
    line: COLORS.navy,
    accent: COLORS.navy,
    titleSize: 17,
    bodySize: 14.2,
  });
  addFooter(slide, "This matters because the system is navigating files, formats, and instructions the way a real workflow would.");
  finalizeSlide(slide);
}

function addOutputsSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 24);
  addTitle(slide, "Student-Facing Outputs");
  addDataChip(slide, "Feedback docs", studentFeedbackCount, {
    x: 0.86,
    y: 1.55,
    w: 1.55,
    valueColor: COLORS.teal,
  });
  addDataChip(slide, "CSV tracker", "1", {
    x: 2.6,
    y: 1.55,
    w: 1.55,
    valueColor: COLORS.orange,
  });
  addBulletRows(slide, [
    "Ten individualized feedback documents created",
    "Original student work preserved",
    "Rubric scores added",
    "Constructive, actionable next-step feedback appended",
    "Whole-class CSV generated",
  ], {
    x: 0.92,
    y: 2.55,
    w: 4.8,
    gap: 0.52,
    fontSize: 15.8,
    dotColor: COLORS.orange,
  });
  slide.addText("references/codex_example/student_scores.csv", {
    x: 0.94,
    y: 5.5,
    w: 4.8,
    h: 0.2,
    fontFace: MONO_FONT,
    fontSize: 9.5,
    color: COLORS.slate,
    margin: 0,
  });
  addFramedImage(slide, imagePath("codex_04.png"), {
    x: 6.0,
    y: 1.35,
    w: 6.55,
    h: 5.85,
    line: COLORS.orange,
  });
  finalizeSlide(slide);
}

function addTeacherPromptSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 25);
  addTitle(slide, "Prompt 2: Teacher-Facing Summary", { w: 6.6 });
  slide.addShape(SHAPE.roundRect, {
    x: 0.82,
    y: 1.6,
    w: 2.75,
    h: 0.5,
    rectRadius: 0.06,
    line: { color: COLORS.gold, width: 1 },
    fill: { color: COLORS.goldSoft },
  });
  slide.addText("Time used by Codex: 2 minutes and 16 seconds", {
    x: 0.95,
    y: 1.8,
    w: 2.5,
    h: 0.16,
    fontFace: BODY_FONT,
    fontSize: 11,
    bold: true,
    color: COLORS.ink,
    margin: 0,
    align: "center",
  });
  addBulletRows(slide, [
    "Pull the score distribution from the CSV",
    "Create a polished .docx for the teacher",
    "Include an attractive score table",
    "Provide concrete instructional recommendations",
  ], {
    x: 0.92,
    y: 2.35,
    w: 5.25,
    gap: 0.62,
    fontSize: 16.5,
    dotColor: COLORS.teal,
  });
  addMonospaceBox(slide, teacherPromptExcerpt, {
    x: 0.92,
    y: 4.95,
    w: 5.35,
    h: 1.15,
    fontSize: 9.8,
  });
  slide.addText("Prompt file: references/codex_example/teacher_feedback_prompt.md", {
    x: 0.94,
    y: 6.32,
    w: 5.6,
    h: 0.2,
    fontFace: MONO_FONT,
    fontSize: 9.5,
    color: COLORS.slate,
    margin: 0,
  });
  addCard(slide, {
    x: 6.72,
    y: 2.05,
    w: 5.15,
    h: 3.9,
    title: "Second pass goal",
    body: "Move from individual grading to teacher-facing interpretation.\nThat means aggregating scores, naming patterns, and suggesting next instructional moves.",
    fill: COLORS.white,
    line: COLORS.navy,
    accent: COLORS.navy,
    titleSize: 20,
    bodySize: 17,
  });
  finalizeSlide(slide);
}

function addTeacherSummarySlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 26);
  addTitle(slide, "Teacher-Facing Summary");
  addDataChip(slide, "Class average", "4.7 / 6", {
    x: 0.85,
    y: 1.65,
    w: 1.9,
    valueColor: COLORS.navy,
  });
  addCard(slide, {
    x: 0.85,
    y: 2.75,
    w: 4.25,
    h: 1.3,
    title: "Strongest category",
    body: "Clarity and Focus of Writing",
    fill: COLORS.white,
    line: COLORS.teal,
    accent: COLORS.teal,
    titleSize: 16,
    bodySize: 16,
  });
  addCard(slide, {
    x: 0.85,
    y: 4.25,
    w: 4.25,
    h: 1.3,
    title: "Weakest category",
    body: "Use of Story Evidence and Specific Details",
    fill: COLORS.white,
    line: COLORS.orange,
    accent: COLORS.orange,
    titleSize: 16,
    bodySize: 15,
  });
  addCard(slide, {
    x: 0.85,
    y: 5.78,
    w: 4.25,
    h: 0.82,
    title: "Created artifact",
    body: "Teacher feedback report with score table and recommendations",
    fill: COLORS.white,
    line: COLORS.gold,
    accent: COLORS.gold,
    titleSize: 14,
    bodySize: 12.4,
  });
  addFramedImage(slide, imagePath("codex_05.png"), {
    x: 5.45,
    y: 1.45,
    w: 7.0,
    h: 5.9,
    line: COLORS.navy,
  });
  finalizeSlide(slide);
}

function addMeaningSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 27);
  addTitle(slide, "What Do These Tools Mean for Teaching and Learning?", {
    w: 9.8,
  });
  addCard(slide, {
    x: 0.95,
    y: 2.2,
    w: 5.45,
    h: 2.6,
    title: "The old question",
    body: "Are these tools impressive?",
    fill: COLORS.white,
    line: COLORS.border,
    accent: COLORS.border,
    titleSize: 19,
    bodySize: 20,
  });
  addCard(slide, {
    x: 6.0,
    y: 2.2,
    w: 6.35,
    h: 2.6,
    title: "The better question",
    body: "What do they mean for student thinking, assessment, teacher practice, and school response?",
    fill: COLORS.white,
    line: COLORS.navy,
    accent: COLORS.navy,
    titleSize: 19,
    bodySize: 18,
  });
  addFooter(slide, "The demos are only useful if they help us interpret instructional consequences.");
  finalizeSlide(slide);
}

function addAssessmentSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 28);
  addTitle(slide, "Student Thinking and Assessment");
  addSubtitle(slide, "What thinking do we still need students to do?");
  addCard(slide, {
    x: 0.9,
    y: 2.2,
    w: 2.75,
    h: 2.55,
    title: "Support vs. substitution",
    body: "When is AI helping students think, and when is it doing the thinking for them?",
    fill: COLORS.white,
    line: COLORS.orange,
    accent: COLORS.orange,
    titleSize: 15.5,
    bodySize: 14.2,
  });
  addCard(slide, {
    x: 3.92,
    y: 2.2,
    w: 2.75,
    h: 2.55,
    title: "Cognitive offloading",
    body: "What habits get weaker when students outsource too much planning, writing, or recall?",
    fill: COLORS.white,
    line: COLORS.teal,
    accent: COLORS.teal,
    titleSize: 15.5,
    bodySize: 14.2,
  });
  addCard(slide, {
    x: 6.94,
    y: 2.2,
    w: 2.75,
    h: 2.55,
    title: "Product vs. understanding",
    body: "A polished artifact is no longer clean evidence of real comprehension.",
    fill: COLORS.white,
    line: COLORS.gold,
    accent: COLORS.gold,
    titleSize: 15.5,
    bodySize: 14.2,
  });
  addCard(slide, {
    x: 9.96,
    y: 2.2,
    w: 2.35,
    h: 2.55,
    title: "Better evidence",
    body: "Process, explanation, revision, oral defense, live performance.",
    fill: COLORS.white,
    line: COLORS.navy,
    accent: COLORS.navy,
    titleSize: 15.5,
    bodySize: 14.2,
  });
  finalizeSlide(slide);
}

function addTeacherPracticeSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 29);
  addTitle(slide, "Teacher Practice, Equity, and Trust");
  addBulletRows(slide, [
    "What work should be delegated?",
    "What work should remain deeply human?",
    "Efficiency is not the same thing as wisdom.",
    "Equity, privacy, bias, and transparency all matter.",
  ], {
    x: 0.95,
    y: 2.18,
    w: 5.6,
    gap: 0.7,
    fontSize: 18,
    dotColor: COLORS.teal,
  });
  addCard(slide, {
    x: 7.15,
    y: 2.05,
    w: 4.95,
    h: 4.0,
    title: "A professional posture",
    body: "Teachers may become more like designers, verifiers, and orchestrators. That makes judgment more important, not less.",
    fill: COLORS.white,
    line: COLORS.navy,
    accent: COLORS.navy,
    titleSize: 20,
    bodySize: 17,
  });
  finalizeSlide(slide);
}

function addDiscussionSlide() {
  const slide = pptx.addSlide();
  setBackground(slide, true);
  addChrome(slide, 30, { dark: true });
  addTitle(slide, "Talk With the People Around You", {
    color: COLORS.white,
    w: 8.2,
    fontSize: 30,
  });
  addSubtitle(slide, "A few minutes for discussion before we close.", {
    color: COLORS.paperAlt,
    fontSize: 19,
  });
  const prompts = [
    "What student thinking do you most want to protect?",
    "Which assignments or products feel less trustworthy now?",
    "What parts of teacher work would you want help with?",
    "What concerns you most about equity, ethics, privacy, or trust?",
  ];
  prompts.forEach((prompt, index) => {
    const x = index % 2 === 0 ? 0.95 : 6.85;
    const y = index < 2 ? 2.2 : 4.45;
    addCard(slide, {
      x,
      y,
      w: 5.5,
      h: 1.7,
      title: `Prompt ${index + 1}`,
      body: prompt,
      fill: COLORS.paper,
      line: index % 2 === 0 ? COLORS.gold : COLORS.teal,
      accent: index % 2 === 0 ? COLORS.gold : COLORS.teal,
      titleColor: COLORS.ink,
      bodyColor: COLORS.ink,
      titleSize: 16,
      bodySize: 15.5,
    });
  });
  finalizeSlide(slide);
}

function addAdaptationSlide() {
  const slide = pptx.addSlide();
  setBackground(slide);
  addChrome(slide, 31);
  addTitle(slide, "Thoughtful Adaptation Rather Than Panic or Passivity", {
    w: 10.3,
  });
  addBulletRows(slide, [
    "Do not chase every new tool",
    "Do not pretend these tools do not matter",
    "Revisit learning goals, assessment, and evidence",
    "Experiment carefully and stay informed",
  ], {
    x: 1.2,
    y: 2.25,
    w: 10.0,
    gap: 0.78,
    fontSize: 21,
    dotColor: COLORS.orange,
  });
  slide.addShape(SHAPE.line, {
    x: 1.2,
    y: 5.8,
    w: 10.6,
    h: 0,
    line: { color: COLORS.teal, width: 1.5 },
  });
  slide.addText("We do not need perfect predictions. We need a stance of informed adaptation.", {
    x: 1.35,
    y: 6.02,
    w: 10.3,
    h: 0.35,
    fontFace: TITLE_FONT,
    fontSize: 20,
    bold: true,
    color: COLORS.navy,
    align: "center",
    margin: 0,
  });
  finalizeSlide(slide);
}

function addThankYouSlide() {
  const slide = pptx.addSlide();
  setBackground(slide, true);
  addChrome(slide, 32, { dark: true });
  addTitle(slide, "Thank You", {
    color: COLORS.white,
    w: 5.2,
    fontSize: 32,
  });
  addSubtitle(slide, "Please share your takeaway", {
    color: COLORS.paperAlt,
    fontSize: 22,
  });
  slide.addShape(SHAPE.roundRect, {
    x: 0.9,
    y: 2.25,
    w: 5.4,
    h: 3.75,
    rectRadius: 0.08,
    line: { color: COLORS.gold, width: 1 },
    fill: { color: COLORS.charcoal },
  });
  slide.addText("One thing that changed in your thinking today", {
    x: 1.2,
    y: 2.8,
    w: 4.8,
    h: 0.65,
    fontFace: TITLE_FONT,
    fontSize: 25,
    bold: true,
    color: COLORS.white,
    margin: 0,
  });
  slide.addText("Your feedback will help me refine the talk and understand what feels most useful to educators.", {
    x: 1.22,
    y: 3.95,
    w: 4.65,
    h: 0.72,
    fontFace: BODY_FONT,
    fontSize: 16.5,
    color: COLORS.paperAlt,
    margin: 0,
  });
  if (hasImage("survey-qr.png")) {
    addFramedImage(slide, imagePath("survey-qr.png"), {
      x: 8.0,
      y: 2.2,
      w: 3.4,
      h: 3.4,
      line: COLORS.teal,
      backfill: COLORS.white,
    });
  } else {
    slide.addShape(SHAPE.roundRect, {
      x: 8.0,
      y: 2.2,
      w: 3.4,
      h: 3.4,
      rectRadius: 0.08,
      line: { color: COLORS.teal, width: 1.5, dash: "dash" },
      fill: { color: COLORS.white },
    });
    slide.addText("Add survey QR here", {
      x: 8.5,
      y: 3.65,
      w: 2.4,
      h: 0.3,
      fontFace: BODY_FONT,
      fontSize: 16,
      bold: true,
      color: COLORS.inkSoft,
      align: "center",
      margin: 0,
    });
  }
  addCard(slide, {
    x: 7.45,
    y: 5.98,
    w: 4.45,
    h: 0.86,
    title: "Survey link",
    body: "Insert survey URL here",
    fill: COLORS.paper,
    line: COLORS.gold,
    accent: COLORS.gold,
    titleSize: 12.5,
    bodySize: 12.5,
  });
  finalizeSlide(slide);
}

function buildDeck() {
  addTitleSlide();
  addQuestionSlide(
    2,
    "Why This Conversation Matters Right Now",
    "What has changed, and what does that mean for schools?"
  );
  addImageStorySlide(
    3,
    "We Have Been Here Before",
    "",
    "internet-adoption-02.png",
    [
      "New technologies can move into classrooms very quickly.",
      "Professional support and curriculum integration usually move more slowly.",
      "AI may be another moment where adoption outpaces readiness.",
    ],
    COLORS.orange
  );
  addImageStorySlide(
    4,
    "AI Use Is Rising Faster Than Guidance",
    "",
    "ai-pd.png",
    [
      "Many teachers report little school- or district-provided AI support.",
      "The challenge is not just access to tools.",
      "The challenge is helping educators respond thoughtfully and well.",
    ],
    COLORS.teal
  );
  addAiLayersSlide();
  addCapabilitiesSlide();
  addHowModelsWorkSlide();
  addCapabilitiesLimitsSlide();
  addFrontierDefinitionSlide();
  addLabsSlide();
  addTimelineSlide();
  addAssumptionsSlide();
  addNotebookIntroSlide();
  addNotebookPreparedSlide();
  addCodexIntroSlide();
  addGradingProblemSlide();
  addSourceTextSlide();
  addPromptRubricSlide();
  addCodexApproachSlide();
  addPromptWithScreenshotSlide(
    20,
    "Prompt 1: Score, Comment, and Track",
    "3 minutes and 47 seconds",
    [
      "Assess each student response using the provided rubric",
      "Create a new .docx file in references/codex_example/student_feedback",
      "Preserve the original student document and append rubric-based feedback",
      "Create references/codex_example/student_scores.csv with category scores and total score for each student",
    ],
    scoringPromptExcerpt,
    "Prompt file: references/codex_example/scoring-prompt.md",
    "codex_01.png"
  );
  addActionScreenshotSlide(21, "Codex in Action", "codex_02.png", [
    "Working inside the project context",
    "Reading the prompt, rubric, and folder structure",
    "Setting up the grading task across multiple files",
  ]);
  addActionScreenshotSlide(22, "Codex Working Across the Project", "codex_03.png", [
    "Reads the rubric and prompt",
    "Extracts student writing from .docx files",
    "Scores consistently across the set",
    "Generates feedback docs plus a class score tracker",
  ]);
  addActualInputsSlide();
  addOutputsSlide();
  addTeacherPromptSlide();
  addTeacherSummarySlide();
  addMeaningSlide();
  addAssessmentSlide();
  addTeacherPracticeSlide();
  addDiscussionSlide();
  addAdaptationSlide();
  addThankYouSlide();
}

async function main() {
  buildDeck();
  const outputPath = path.join(ROOT, "tracking-ai-frontier.pptx");
  await pptx.writeFile({ fileName: outputPath });
  console.log(`Wrote ${outputPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
