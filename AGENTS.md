# AGENTS.md

## Project Overview

This repository is the working content structure for a presentation titled:

**Tracking the AI Frontier - Implications for K-12 Education**

The talk is designed for K-12 educators and focuses on:

1. demystifying modern AI,
2. explaining the pace of progress at the frontier,
3. showing concrete educator-relevant examples,
4. interpreting the implications for curriculum, assessment, and teaching,
5. and closing with reflection and a survey.

This is a presentation-content project, not a typical software project. The repository should be treated as a narrative workspace for building, revising, and delivering the slide deck and its supporting materials.

## Audience And Tone

The primary audience is K-12 educators. Content should be:

- clear,
- grounded,
- professionally respectful,
- non-hyped,
- not overly technical,
- and attentive to both opportunity and risk.

The goal is to help educators update their mental model of AI without sounding promotional, alarmist, or speculative for its own sake.

## Core Through-Line

The presentation argues that AI capabilities are advancing quickly enough that educators need an updated understanding of:

- what current systems are,
- what they can already do,
- how that changes teacher and student work,
- and why curriculum and assessment assumptions may need revision.

Preserve that through-line in all slide work.

## Repository Structure

The canonical slide files now live in a centralized `slides/` directory.

Current top-level structure:

- `slides/`
- `AGENTS.md`
- `slide_master.md`

Within `slides/`:

- `slide-01.md` through the current final slide
- `imgs/` for slide images
- `references/` for supporting documents and working materials

## Canonical Sources

Use the files in `slides/` as the source of truth for presentation content.

- `slides/slide-XX.md` contains the outward-facing content for a single slide.
- `slide_master.md` contains the full presentation runthrough in one file.

If the two ever drift, treat that as something to resolve, not something to ignore.

## Slide File Model

Each slide is a single markdown file in `slides/` named with deck-wide numbering:

- `slide-01.md`
- `slide-02.md`
- `slide-03.md`
- etc.

Slide numbering is global across the full presentation and should remain continuous.

Each slide markdown file should contain only slide-facing content, such as:

- the slide title,
- visible bullets or body text,
- image references,
- links intended to appear on the slide,
- or short labels/captions that belong on the slide.

Do not place speaker notes, implementation notes, or planning commentary inside the slide markdown files.

## Images

All slide images belong in:

- `slides/imgs/`

When referencing an image from a slide markdown file in `slides/`, use a relative path like:

- `imgs/example.png`

If an image is referenced but does not exist yet, keep the reference stable so a future contributor can add the asset in the expected location.

## References

Supporting documents belong in:

- `slides/references/`

Use this folder for:

- PDFs,
- rubric documents,
- prompt files,
- sample work,
- feedback outputs,
- CSV trackers,
- section outlines that still need to be preserved,
- and similar support materials that are not themselves slides.

The Codex walkthrough materials are grouped in:

- `slides/references/codex_example/`

Keep those materials together.

## Recommended Workflow

When picking up work in this repo:

1. Read this `AGENTS.md`.
2. Review `slide_master.md` to understand the current full-deck arc.
3. Edit the relevant `slides/slide-XX.md` files directly.
4. Add or update any images in `slides/imgs/`.
5. Add or update supporting docs in `slides/references/` when needed.
6. Keep numbering, wording, and references aligned across the deck.

If a requested change affects multiple slides, update all affected slide files rather than patching only one local instance.

## Slide Range Map

Use the current slide ranges roughly as follows:

- `slide-01` to `slide-08`: demystifying AI
- `slide-09` to `slide-12`: the AI frontier
- `slide-13` to `slide-14`: NotebookLM
- `slide-15` to `slide-26`: Codex workflow demo
- `slide-27` to `slide-32`: implications, discussion, close, and survey

## Content Standards

Contributions should generally aim for:

- conceptual clarity over jargon,
- concrete examples over abstraction,
- educational relevance over general AI commentary,
- balanced treatment of benefits and limitations,
- and smooth transitions from one part of the talk to the next.

Avoid:

- breathless AI hype,
- overly technical deep dives unless explicitly requested,
- generic edtech platitudes,
- and claims that teachers are being replaced.

## File And Naming Conventions

- Preserve zero-padded slide numbering.
- Keep slide content in `slides/slide-XX.md`.
- Keep images in `slides/imgs/`.
- Keep supporting materials in `slides/references/`.
- Prefer descriptive filenames for support materials.
- Do not create alternate slide-content copies in other folders.

## Definition Of Done

A contribution is in good shape when:

- it clearly improves the relevant slide or support material,
- it stays aligned with the deck-wide narrative,
- it uses the centralized `slides/` structure correctly,
- and it leaves the repository easier for the next contributor to understand.

When in doubt, optimize for clarity, continuity, and handoff quality.
