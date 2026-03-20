# Slide 01

## Tracking the AI Frontier

### Implications for K-12 Education

# Slide 02

## Why This Conversation Matters Right Now

### What has changed, and what does that mean for schools?

# Slide 03

## We Have Been Here Before

### Visual

`slides/imgs/internet-adoption-02.png`

- New technologies can move into classrooms very quickly.
- Professional support and curriculum integration usually move more slowly.
- AI may be another moment where adoption outpaces readiness.

# Slide 04

## AI Use Is Rising Faster Than Guidance

### Visual

`slides/imgs/ai-pd.png`

- Many teachers report little school- or district-provided AI support.
- The challenge is not just access to tools.
- The challenge is helping educators respond thoughtfully and well.

# Slide 05

## What Do We Mean by "AI"?

### Visual

`slides/imgs/ai-layers.png`

- Artificial Intelligence
- Machine Learning
- Deep Learning
- Generative AI / Foundation Models / Large Language Models

# Slide 06

## Why Today's AI Feels Different

### Visual

`slides/imgs/current-ai-capabilities.png`

- Writing
- Summarizing
- Explaining
- Generating images
- Analyzing documents
- Coding
- Organizing information
- Providing feedback

# Slide 07

## At a High Level, How Do These Models Work?

### Visual

`slides/imgs/next-token-prediction.png`

- Trained on enormous amounts of data
- Learns patterns and relationships
- Predicts what comes next in context
- Produces useful outputs from pattern prediction at scale

# Slide 08

## Powerful, Useful, and Imperfect

| Useful Capabilities | Important Limitations |
| --- | --- |
| Summarize | Can hallucinate |
| Explain | Can be confidently wrong |
| Generate | Can miss nuance |
| Organize | Can reflect bias |
| Adapt tone/style | Needs verification |

AI is powerful, but it must be used with judgment.

# Slide 09

## What Do We Mean by the AI Frontier?

### Visual

`slides/imgs/ai-frontier-capabilities.png`

- Reasoning
- Multimodality
- Coding
- Long context
- Tool use
- Autonomy
- Usability

# Slide 10

## Who Is Driving the Frontier?

- OpenAI — broad public adoption and productization
- Google / DeepMind — multimodal ecosystem and research depth
- Anthropic — reasoning, safety, and professional use

# Slide 11

## Why the Last 36 Months Matter

### Visual

`slides/imgs/frontier-progress-timeline.png`

- Reasoning
- Multimodality
- Coding assistance
- Long context
- Workflow automation
- Polished product integration

# Slide 12

## Old Assumptions That No Longer Hold

- "AI can only do shallow work"
- "AI outputs are always obviously bad"
- "Students will only use AI for cheating"

Schools tend to update more slowly than the technology itself.

# Slide 13

## NotebookLM: Source-Grounded AI

- Works from a set of sources rather than a blank prompt
- Synthesizes, explains, organizes, and transforms material
- Especially useful for teacher prep, student study, and source-grounded inquiry

### Find it here

[NotebookLM](https://notebooklm.google.com/)

# Slide 14

## Prepared Notebook: Earth's Motions in Space

- Earth's 23.5° axial tilt, seasons, equinoxes, and solstices
- Earth's rotation, the moon's gravity, and climate-related changes in spin
- Solar vs. sidereal time, leap years, and the Gregorian calendar
- A "Season-Dial" model for noon Sun angles and shifting shadows
- Generated tools: flashcards, quiz, mind map, and interactive podcast

### Notebook link

[Earth's Motions in Space Notebook](https://notebooklm.google.com/notebook/81fd83eb-0924-4b62-bf50-d537d5693eae?pli=1)

- Sources include educational materials plus science video transcripts
- The notebook is prepared to demonstrate synthesis, study tools, and interactive exploration

# Slide 15

## What Is Codex?

- The Codex Desktop App is OpenAI's command center for working with multiple coding agents
- It can manage long-running tasks, parallel work, project context, files, and tool use in one place
- It is designed for real project workflows, not just one-shot answers in a chat box
- I am going to show an atypical use case: structured grading and feedback, not code generation

### Find it here

[Codex](https://openai.com/codex)

# Slide 16

## The Grading Problem

- A teacher has a folder of student literary responses.
- Each student needs an individual score and useful feedback.
- The teacher also needs a class-wide score tracker and instructional summary.
- This is real professional work, not code generation.

# Slide 17

## Source Text: *The Last Question*

### Visual

`slides/references/codex_example/1956-Isaac-Asimov-The-Last-Question.pdf`

- Isaac Asimov short story
- Students respond to how the human-computer relationship changes across the story
- Strong fit for a short literary analysis task

# Slide 18

## Student Prompt and Scoring Rubric

- Brief response: under one page
- Explain how the relationship between humans and the computer changes as the computer becomes more advanced
- Rubric categories:
  - Understanding of the changing human-computer relationship
  - Use of story evidence / specific details
  - Clarity and focus of writing
- Total score: 6 points

# Slide 19

## Our Codex Approach

- Give Codex the student work folder, rubric, and prompt
- Ask it to score each student response consistently
- Create a new feedback copy for each student
- Generate a CSV tracker for the full class
- Then ask for a teacher-facing summary document

# Slide 20

## Prompt 1: Score, Comment, and Track

### Time used by Codex: 3 minutes and 47 seconds

- Assess each student response using the provided rubric
- Create a new `.docx` file in `student_feedback`
- Preserve the original student document and append rubric-based feedback
- Create `slides/references/codex_example/student_scores.csv` with category scores and total score for each student

### Visual

`slides/imgs/codex_01.png`

- Prompt file: `slides/references/codex_example/scoring-prompt.md`

# Slide 21

## Codex in Action

### Visual

`slides/imgs/codex_02.png`

- Working inside the project context
- Reading the prompt, rubric, and folder structure
- Setting up the grading task across multiple files

# Slide 22

## Codex Working Across the Project

### Visual

`slides/imgs/codex_03.png`

- Reads the rubric and prompt
- Extracts student writing from `.docx` files
- Scores consistently across the set
- Generates feedback docs plus a class score tracker

# Slide 23

## Actual Inputs

- `slides/references/codex_example/student_work/` with 10 student `.docx` submissions
- `slides/references/codex_example/Scoring-Rubric.md` with the original prompt and scoring categories
- Source text: *The Last Question*
- A real project folder, not a one-off prompt box

# Slide 24

## Student-Facing Outputs

### Visual

`slides/imgs/codex_04.png`

- 10 individualized feedback documents created
- Original student work preserved
- Rubric scores added
- Constructive, actionable next-step feedback appended
- `slides/references/codex_example/student_scores.csv` generated for the whole class

# Slide 25

## Prompt 2: Teacher-Facing Summary

### Time used by Codex: 2 minutes and 16 seconds

- Pull the score distribution from the CSV
- Create a polished `.docx` for the teacher
- Include an attractive score table
- Provide concrete instructional recommendations based on response patterns

### Prompt file

`slides/references/codex_example/teacher_feedback_prompt.md`

# Slide 26

## Teacher-Facing Summary

### Visual

`slides/imgs/codex_05.png`

- Class average: 4.7 out of 6
- Strongest category: Clarity and Focus of Writing
- Weakest category: Use of Story Evidence and Specific Details
- Teacher feedback report created with score table and instructional recommendations

# Slide 27

## What Do These Tools Mean for Teaching and Learning?

- The key question is no longer whether these tools are impressive.
- The key question is what they mean for student thinking, assessment, teacher practice, and school response.

# Slide 28

## Student Thinking and Assessment

### What thinking do we still need students to do?

- Support vs. substitution
- Cognitive offloading
- Polished products vs. real understanding
- Better evidence: process, explanation, revision, oral defense, live performance

# Slide 29

## Teacher Practice, Equity, and Trust

- What work should be delegated?
- What work should remain deeply human?
- Efficiency is not the same thing as wisdom
- Equity, privacy, bias, and transparency all matter

# Slide 30

## Talk With the People Around You

- What student thinking do you most want to protect?
- Which assignments or products feel less trustworthy now?
- What parts of teacher work would you want help with?
- What concerns you most about equity, ethics, privacy, or trust?

# Slide 31

## Thoughtful Adaptation Rather Than Panic or Passivity

- Do not chase every new tool
- Do not pretend these tools do not matter
- Revisit learning goals, assessment, and evidence
- Experiment carefully and stay informed

# Slide 32

## Thank You

### Please share your takeaway

### Visual

`slides/imgs/survey-qr.png`

Survey link: `[Insert survey URL here]`
