# AGENTS.md

## Project Overview

This repository is the working content structure for a presentation titled:

**Tracking the AI Frontier - Implications for K-12 Education**

The talk is designed for K-12 educators and focuses on:

1. demystifying modern AI,
2. explaining the pace of progress at the frontier,
3. showing concrete educator-relevant examples,
4. interpreting the implications for curriculum, assessment, and teaching,
5. and closing with reflection.

This is not a general software project. It is a presentation-content project organized around the major sections of the talk. Agents working here should treat the repository as a narrative workspace for developing slides, supporting materials, demos, and section-level thinking.

## Audience And Tone

The primary audience is K-12 educators. Content should be:

- clear,
- grounded,
- professionally respectful,
- non-hyped,
- not overly technical,
- and attentive to both opportunity and risk.

The talk should help educators update their mental model of AI without sounding promotional, alarmist, or overly speculative.

## Core Through-Line

The presentation argues that AI capabilities are advancing quickly enough that educators need an updated understanding of:

- what current systems are,
- what they can already do,
- how that changes teacher and student work,
- and why curriculum and assessment assumptions may need revision.

When contributing to any section, preserve that through-line.

## Repository Structure

The top level of the repository is organized by the major sections of the talk. The numeric prefixes indicate presentation order and should be preserved.

Current top-level structure:

- `01-Demystifing-AI`
- `02-The-Frontier-of-AI`
- `03-Building-Curriculum-NotebookLM`
- `04-Automating-Workflows-Codex`
- `05-What-This-Means-for-Teaching-and-Learning`
- `06-Reflection`

Important:

- Folder names reflect the current repository state and should be treated as canonical unless the user explicitly requests a rename.
- The `01-Demystifing-AI` spelling is currently part of the real folder name on disk. Do not silently "correct" it in code or file paths.

## How To Read A Section

Each section folder represents one major part of the talk.

Within a section, the expected structure is:

1. a section outline markdown file,
2. slide subfolders for the slides that belong to that section,
3. any assets or support files needed for those slides.

The outline file is the section-level source of truth. It should explain:

- the purpose of the section,
- the core message,
- the likely sequence of ideas,
- and what each slide in the section is trying to accomplish.

Example currently present:

- `01-Demystifing-AI/section-01-outline.md`

At the moment, the first section already contains its outline file, while the later sections are still mostly scaffold folders. Agents should use the first section as the clearest concrete example of the intended pattern.

## Slide Folder Model

Each slide should live in its own subfolder inside the relevant section folder.

A slide folder is the atomic unit of work for contributors. If an agent is asked to work on "a slide" or "part of a section," that work should usually happen inside one slide subfolder.

Use zero-padded slide folder names in presentation order:

- `slide-01`
- `slide-02`
- `slide-03`
- etc.

Each slide folder should normally contain:

- `content.md`
- `blueprint.md`
- any slide-specific image assets referenced by `content.md`

Typical slide-folder responsibilities may include:

- slide copy,
- speaker notes,
- citations or research notes,
- visuals or image prompts,
- supporting assets,
- or implementation details for the presentation site.

If the exact internal file pattern for slide folders has not been established yet, follow the existing local conventions in that section and keep the structure simple and easy for the next contributor to understand.

### `content.md`

`content.md` is for outward-facing slide content only.

It should contain only what is intended to appear on the slide, such as:

- the slide title,
- visible bullets or short body text,
- image references,
- captions or labels that belong on the slide.

It should not contain:

- implementation notes,
- build instructions,
- speaker notes,
- rationale,
- or reminders to future contributors.

If a slide depends on an image, reference the image directly in `content.md` and assume the image file lives in the same slide folder.

### `blueprint.md`

`blueprint.md` is the internal planning file for the slide.

It should explain:

- the purpose of the slide,
- the core takeaway,
- what to include,
- what visual or layout is expected,
- what should be emphasized when presenting,
- and how the slide transitions into the next one.

This file is where agents should capture the build plan and presentation intent without cluttering the outward-facing slide content.

## Recommended Agent Workflow

When picking up work in this repo:

1. Read this `AGENTS.md` first.
2. Identify the relevant numbered section.
3. Read that section's outline file before editing or creating slide-level materials.
4. Treat the section outline as the narrative and pedagogical guide for all work in that folder.
5. Make slide-level additions inside the appropriate slide subfolder rather than scattering files loosely through the section.
6. Keep outputs aligned to the educator audience and the overall talk cadence.

If a requested section does not yet have its outline file, infer from:

- the section folder name,
- the overall talk arc in this file,
- and any existing neighboring materials.

When creating a missing section outline, make it explicit that it is serving as the section-level scaffold for future slide development.

## Section Intent Map

Use the section folders roughly as follows:

- `01-Demystifing-AI`: define AI broadly, reduce mystique, explain current models at a surface level, establish strengths and limits.
- `02-The-Frontier-of-AI`: explain frontier labs, the pace of progress over roughly the last 36 months, and why static assumptions age quickly.
- `03-Building-Curriculum-NotebookLM`: show NotebookLM as a source-grounded educator workflow, likely using a prepared Earth and space science example.
- `04-Automating-Workflows-Codex`: show Codex-based educator workflows, especially rubric-based student feedback and the AI-built presentation site reveal.
- `05-What-This-Means-for-Teaching-and-Learning`: interpret the demos in educational terms, including assessment validity, cognitive offloading, workflow change, equity, and ethics.
- `06-Reflection`: closing synthesis, audience reflection, survey, and takeaway.

## Content Standards

Contributions should generally aim for:

- conceptual clarity over jargon,
- concrete examples over abstraction,
- educational relevance over general AI commentary,
- balanced treatment of benefits and limitations,
- and smooth transitions from one section to the next.

Avoid:

- breathless AI hype,
- overly technical deep dives unless explicitly requested,
- generic edtech platitudes,
- and claims that teachers are being replaced.

## File And Naming Conventions

- Preserve numeric prefixes on section folders.
- Keep materials grouped inside the appropriate section.
- Prefer descriptive markdown filenames.
- For slide work, prefer one slide per subfolder rather than mixing multiple slides into a single loose document.
- Keep slide images in the same `slide-XX` folder as the markdown files that reference them.
- Keep `content.md` presentation-facing and `blueprint.md` contributor-facing.
- Do not rename major folders or reorganize sections without explicit approval, because the folder order represents the presentation flow.

## Current State Notes

As of now, this repository is in an early scaffold stage:

- the top-level section folders exist,
- `01-Demystifing-AI` already has a section outline,
- `01-Demystifing-AI` now also contains slide folders derived from that outline,
- the remaining sections are present as placeholders for further development.

Agents should preserve that scaffold while helping it become more complete.

## Definition Of Done For Contributions

A contribution is in good shape when:

- it clearly belongs to one section,
- it supports the talk's narrative arc,
- it is easy for another agent to find and continue,
- and it leaves the repository more structured, not less.

When in doubt, optimize for clarity, continuity, and handoff quality.
