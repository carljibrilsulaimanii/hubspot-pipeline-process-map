# HubSpot pipeline process map

A single HTML file that maps a HubSpot sales setup: the objects, each deal pipeline, and the workflows behind every stage. Every box on the map is clickable. Clicking one opens a panel with:

- the question that box answers, and the answer
- numbers, fields or a short table where they help
- how the step was meant to work, and where that came from
- a "Watch out" note for known traps
- each workflow involved, drawn as a step list, with a link that opens it in HubSpot
- buttons to jump to related boxes, including on other tabs

It runs in any browser with no build step and no server. You fill in one data block.

Built by [Jibril Sulaiman](https://github.com/carljibrilsulaimanii).

## Contents

- [Why it exists](#why-it-exists)
- [What's in this repo](#whats-in-this-repo)
- [Prerequisites and dependencies](#prerequisites-and-dependencies)
- [Setup, step by step](#setup-step-by-step)
  - [Step 1. Open the example](#step-1-open-the-example)
  - [Step 2. Collect the facts from HubSpot](#step-2-collect-the-facts-from-hubspot)
  - [Step 3. Sketch each map](#step-3-sketch-each-map)
  - [Step 4. Fill in the workflows](#step-4-fill-in-the-workflows)
  - [Step 5. Fill in the maps](#step-5-fill-in-the-maps)
  - [Step 6. Fill in the boxes](#step-6-fill-in-the-boxes)
  - [Step 7. Draw the arrows](#step-7-draw-the-arrows)
  - [Step 8. Run the checks](#step-8-run-the-checks)
  - [Step 9. Check it in the browser](#step-9-check-it-in-the-browser)
  - [Step 10. Share it](#step-10-share-it)
- [Data reference](#data-reference)
- [Lessons from production](#lessons-from-production)
- [Troubleshooting](#troubleshooting)
- [Limits](#limits)

## Why it exists

HubSpot shows a deal pipeline as a board of stages, and each workflow on its own canvas. Nothing in HubSpot shows how they fit together:

- **Which workflow puts a deal into each stage.** A stage with no workflow behind it only fills when a rep moves deals by hand. If reps work in another tool, it stays empty and nobody notices.
- **Which records a stage depends on.** A deal created from a payment and a deal created from a booked call follow different paths, even in the same pipeline.
- **Where two workflows overlap.** Two workflows that each create a deal for the same event can make duplicates.
- **What the stage names actually mean.** A stage's win probability drives HubSpot's weighted forecast. If a stage holds deals that are already paid but is weighted at 10%, every forecast undervalues it.

Reading the workflows one at a time answers these questions, but the answers stay in one person's head. This map puts them on one page that the sales team, managers and the next admin can click through.

## What's in this repo

| Path | What it is |
|---|---|
| [`process-map.html`](process-map.html) | The map. Styles, example data and the rendering code in one file |
| [`tests/`](tests/) | The data checker that runs with `npm test` |
| [`package.json`](package.json) | Holds the `npm test` command. No dependencies |

## Prerequisites and dependencies

You can build a map entirely by hand. The real one this template comes from was built with Claude Code reading HubSpot, which is much faster for a large portal. Both paths are listed.

### To view and edit the map

| What | Version or plan | Why | Check it's ready |
|---|---|---|---|
| A modern browser | Any current Chrome, Edge, Firefox or Safari | Opens [`process-map.html`](process-map.html) | Step 1 shows both example tabs |
| A text editor | Any | You edit the `MAP DATA` block by hand | You can find `const PORTAL_ID` in the file |
| Node.js | 18 or newer | Runs the data checker; no packages to install | `node --version` prints v18 or higher |
| Git | Any | Only to clone the repo; downloading the file works too | `git --version` |

### To collect the facts from HubSpot

| What | Why | Check it's ready |
|---|---|---|
| A HubSpot user that can see deals, contacts and any custom objects on the map | Stage counts, amounts and record links | You can open the deals board for each pipeline |
| Access to **Automation → Workflows**, at least to view | Triggers, branches and actions behind each stage | You can open a workflow and click into its actions |
| A Professional or Enterprise hub | Workflows need Professional or higher; custom objects need Enterprise | The workflows tool opens |
| Super admin, or access to **Settings → Objects** (wording may differ) | Pipelines, stage order and each stage's win probability | You can see the deal pipeline settings |

### To build it with Claude Code (optional)

| Dependency | What it was used for | What it can't do | Check it's ready |
|---|---|---|---|
| **Claude Code** (desktop app or CLI), on a Claude plan that includes it | Runs the whole build: reads HubSpot, writes the `MAP DATA` block, runs `npm test` | Nothing on its own: it needs the two below to see HubSpot | It opens in the folder holding [`process-map.html`](process-map.html) |
| **HubSpot connector** for Claude, added to your Claude account and turned on for the session | Lists pipelines and stages with win probabilities; counts deals and amounts per stage; pulls property names and dropdown values; looks up owner names; samples records for links | Can't read workflow definitions (triggers, branches, custom code). Report-style counts allow at most two group-by fields | Ask Claude to list your deal pipelines and their stages. It should answer with your real stage names |
| **Claude in Chrome** (the Chrome extension), in a Chrome profile already signed in to HubSpot | Reads each workflow's trigger, branches, actions and custom code, and its version and on/off state | Can't save or publish anything safely: tell it to read only. Signing in is up to you | With a HubSpot workflow open in that profile, ask Claude to read the workflow's name and trigger |
| *Or, instead of Chrome:* a HubSpot private app or service key with the `automation` scope | Reads workflow definitions through HubSpot's Automation v4 API (beta) | Needs a token you create and store yourself; never paste it into the map | A read of one workflow id returns its actions |
| *Optional:* a Slack connector, and meeting transcripts | The "How it was meant to work" notes: design decisions in threads and calls | Design notes describe the plan. Check them against the live workflows | Ask Claude to search Slack for one of your stage names |

Two habits matter when Claude does the reading:

- **Count with search, not reports.** For the exact number of records, use a record search (it returns a true total). Report-style counts are good for breakdowns but can differ by a few records.
- **Read the live workflow before writing a claim.** Local notes and older copies drift from what is running.

⚠️ **Keep tokens and secrets out of the map.** The map holds names, counts and links only. Workflow links open HubSpot, where the reader's own login applies.

✅ **Check:** you can open a deal pipeline's settings and one workflow, and (if you're using Claude Code) the connector lists your pipelines.

## Setup, step by step

### Step 1. Open the example

About 2 minutes.

**1a.** Download [`process-map.html`](process-map.html) and open it in a browser (double-click it).

**1b.** Click **How the objects connect**, then **Program pipeline flow**. Click a few boxes and check that the panel on the right changes each time.

**1c.** Click **Rep moves the stage** on the second tab. The panel shows a "How it was meant to work" note, a "Watch out" note and related-box buttons. Click **Won** under Related boxes: the map highlights that box and its arrows.

✅ **Check:** both tabs draw their boxes and arrows, and every box opens a panel.

### Step 2. Collect the facts from HubSpot

About 30 to 60 minutes per pipeline.

Collect these before you edit anything. Write them in a plain document first; you'll copy them into the file in Steps 4 to 6.

| Collect | Where in HubSpot | Goes into |
|---|---|---|
| Portal (account) id | The number after `/contacts/` in any record URL | `PORTAL_ID` |
| Each pipeline's stages, in order, with each stage's win probability | **Settings** → **Objects** → **Deals** → **Pipelines** (wording may differ) | One box per stage, `stats` |
| Deals per stage, and the amount per stage | The deals board totals, or a report grouped by deal stage | `sub` and `stats` |
| Every workflow that creates, moves or stamps a record on the map | **Automation** → **Workflows**. Open each one | `WF` |
| Each workflow's id | The number in the editor URL: `.../platform/flow/<id>/edit` | `WF[...].id` |
| Each workflow's trigger, and its actions in order | The workflow canvas. Open each action and note what it sets | `flows` steps |
| Who built each workflow, and when it changed | The workflow's **Details** or **Version history** (wording may differ) | Your notes |
| The custom objects involved | **Settings** → **Objects** → **Custom objects** (wording may differ) | Boxes on the objects map |
| How each step was meant to work | Design docs, meeting notes, chat threads | `intent` |

**2a.** For each stage, find the workflow that moves deals into it. Search the workflow list for actions that set **Deal stage** to that stage. If none does, the stage is set by hand. Note that.

**2b.** For each workflow, note what starts it (the trigger) and every branch. A branch is a "Decision" step on the map.

**2c.** For any number you'll show, note when you read it. Counts change every day.

⚠️ **Trap:** don't trust a stage's name. Check what actually moves deals into it, and how many deals sit there. A stage with zero deals and no workflow behind it is the first thing to raise with the team.

⚠️ **Trap:** design notes describe the plan, not the build. Show them as "How it was meant to work", next to what the workflows actually do. The gap between the two is often the most useful thing on the map.

✅ **Check:** every stage has either a workflow that sets it or a note saying it's set by hand.

### Step 3. Sketch each map

About 15 minutes per map.

Each tab is one map on a canvas 680 units wide. Boxes are 56 units tall. Sketch it on paper or in a spreadsheet first.

| Layout | Box position (`x`, width) | Box centre |
|---|---|---|
| Full width, centred | `x` 200, width 280 | 340 |
| Left column | `x` 30, width 290 | 175 |
| Right column | `x` 360, width 290 | 505 |
| Five across | `x` 30, 152, 274, 396, 518, width 112 | `x` + 56 |

**3a.** Put rows every 100 to 110 units down: `y` 30, 140, 250, 350, and so on. Leave at least 40 units between rows so the arrows have room.

**3b.** Put the trigger (what starts the flow) at the top, workflow steps in the middle and stages at the bottom. Keep one flow per column where you can.

**3c.** Note the lowest box's `y`. The map's height `h` must be at least that `y` + 56, plus about 30 for the margin.

**3d.** Keep box titles under about 35 characters on a 290-wide box, and subtitles shorter. Long text runs past the box edge.

✅ **Check:** no two boxes on the same map share space, and every box sits inside 0 to 680 across.

### Step 4. Fill in the workflows

About 10 minutes.

Open [`process-map.html`](process-map.html) in a text editor. Everything you change is between the `MAP DATA` comment and `MAP DATA END`.

**4a.** Set `PORTAL_ID` to your portal id. Every workflow and record link uses it.

**4b.** Add one entry to `WF` per workflow. The key (for example `payment`) is how boxes refer to it.

| Field | What to put | Example |
|---|---|---|
| `id` | The number from the workflow's editor URL | `"1000000001"` |
| `name` | The workflow's exact name in HubSpot | `"Payment - Create Program Deal"` |
| `on` | The record type it enrolls | `"Deal"`, `"Contact"`, `"Payment"` |
| `start` | What starts it, in plain words | `"A payment succeeds"` |

The page lists every `WF` entry in the **Workflows on this map** table at the bottom, with its link.

✅ **Check:** each `id` opens the right workflow when you paste `https://app.hubspot.com/workflows/<PORTAL_ID>/platform/flow/<id>/edit` into the browser.

### Step 5. Fill in the maps

About 5 minutes.

Add one entry to `MAPS` per tab. The key (for example `pipeline`) ties the boxes and the tab button to it.

| Field | What to put |
|---|---|
| `title` | The heading over the map, and the tab's name |
| `note` | One line next to the title, for example "Workflows create deals; a rep moves them after the call." |
| `h` | Canvas height from Step 3c |
| `start` | The id of the box the tab opens on |
| `legend` | Pairs of legend class and label, e.g. `["lg-manual","Stage only a rep can set"]` |
| `edges` | The arrows (Step 7) |

**5a.** Add a tab button inside `<nav class="tabs">` with the same key:

```html
<button role="tab" id="tab-pipeline" aria-controls="stage" aria-selected="false" data-map="pipeline">Program pipeline flow</button>
```

The first `MAPS` entry is the tab that opens first. Only that button gets `aria-selected="true"`.

✅ **Check:** every `MAPS` key has a button with the same `data-map`, and every button has a map.

### Step 6. Fill in the boxes

About 5 minutes per box.

Each box is one `add(...)` call:

```js
add("pipeline","called",30,240,290,"Rep moves the stage","After the call","manual",{kind:"Manual step",
 q:"Who moves a deal after the call?",
 a:["The rep, by hand. ..."],
 ...
});
```

The arguments are, in order: map key, box id, `x`, `y`, width, title, subtitle, tone, and the details object. Every field the details object takes is listed in the [Data reference](#data-reference).

**6a.** Give each box an id that is unique across **all** maps, not just its own. A repeated id silently replaces the earlier box, and that box vanishes from its tab with no error.

**6b.** Write `q` as the question a teammate would ask about that box, and `a` as the answer in one to three short paragraphs.

**6c.** Add `flows` for each workflow behind the box. Use `{wf:"payment", steps:[...]}` for a HubSpot workflow, or `{label:"Process", name:"...", steps:[...]}` for something done outside a workflow, such as a rep's manual step or another app's sync.

**6d.** Mark what is missing as well as what exists. A `["gap","No action for this stage"]` step draws in red, so a stage nothing moves deals into stands out.

**6e.** Use `next` to link related boxes. They can be on other tabs; the button shows the other tab's name.

⚠️ **Trap:** answers and step text are inserted as HTML, so a bare `<` in them breaks the panel. Write "less than" or `&lt;`. Titles, subtitles, stats and field tables are escaped for you.

✅ **Check:** every box has `q` and `a`, and every `wf` key you used exists in `WF`.

### Step 7. Draw the arrows

About 2 minutes per arrow.

Each arrow is `["fromId","toId","SVG path"]` in the map's `edges`. Add `"dash"` as a fourth item for a dashed arrow (a step done by hand).

**7a.** Start the path at the bottom centre of the box it leaves: `M <centre x> <y + 56>`.

**7b.** End it about 2 units before the edge it enters, so the arrowhead doesn't sit inside the box.

**7c.** Use right angles. Go down, across, then down again: `M175 296 L175 322 L340 322 L340 348`.

**7d.** Make sure no line crosses a box it doesn't belong to. Route around boxes instead.

The two ids are what the page uses to highlight an arrow when either box is selected.

✅ **Check:** every arrow touches its two boxes, and none passes through a third.

### Step 8. Run the checks

About 1 minute. Needs Node.js 18 or newer.

```bash
npm test
```

Runs [`tests/check-map.mjs`](tests/check-map.mjs). To check a map saved under another name:

```bash
node tests/check-map.mjs path/to/your-map.html
```

It finds the data block by the `const PORTAL_ID` line, so keep that line.

It checks that:

- every box id is used once, across all maps
- every arrow joins two boxes on the same map
- every related-box link and workflow reference points at something that exists
- every map has a tab button and a start box, and every tab button has a map
- no box runs off its canvas or overlaps another box
- every box has a question and an answer
- step types are valid, and every link is a full `https://` URL

Success looks like:

```
PASS 175 checks: 2 maps, 12 boxes, 3 workflows
```

A failure lists each problem in plain words, for example `Box id "won" is used more than once; the earlier box disappears`.

✅ **Check:** `npm test` prints `PASS`.

### Step 9. Check it in the browser

About 10 minutes.

**9a.** Open the file and click every box on every tab. The checker can't tell whether an answer is right, only whether the data hangs together.

**9b.** Switch your system to dark mode and back. The page follows it.

**9c.** Narrow the window to phone width. The panel moves under the map, and clicking a box scrolls down to it.

**9d.** Open three or four workflow links and check they go to the right workflow.

**9e.** Re-check every claim against the live workflow, not your notes. Workflows change, and a second pass over a finished map usually turns up claims that were never true or are no longer true.

✅ **Check:** every box's answer still matches what the workflow does today.

### Step 10. Share it

About 5 minutes.

The file is self-contained. It loads two web fonts from Google Fonts and falls back to system fonts without them.

**10a.** Host it anywhere that serves a static file, or attach it where your team keeps internal docs.

**10b.** Keep a real map private. It names your workflows, stages, counts and record links.

**10c.** Put the date the numbers were read in the header's eyebrow line, and refresh them before sharing again.

✅ **Check:** a teammate can open the link and click through without any setup.

## Data reference

**`add()` details object**

| Field | Required | What it does |
|---|---|---|
| `kind` | Yes | Short label in the panel's first pill, e.g. "Deal stage", "Workflow", "Trigger" |
| `q` | Yes | The question, shown as the panel heading |
| `a` | Yes | Array of answer paragraphs. HTML allowed |
| `stats` | No | Array of `[value, label]` tiles |
| `fields` | No | Array of `[name, description]` rows, shown as a table |
| `intent` | No | `{t: "how it was meant to work", src: "where that came from"}` |
| `watch` | No | A "Watch out" note. HTML allowed |
| `flows` | No | Array of workflows or processes, each drawn as a step list |
| `links` | No | Array of `[label, full URL]` pairs |
| `next` | No | Array of related box ids, on any tab |

**Step types** (first item of each step: `[type, text, optional note]`)

| Type | Marker | Use it for |
|---|---|---|
| `step` | Grey circle | An ordinary action |
| `branch` | Diamond | A decision or an if/then branch |
| `wait` | Dotted circle | A delay |
| `deal` | Filled circle | Creates or moves a record |
| `manual` | Dashed circle | Done by a person |
| `gap` | Red circle, red text | Something that should happen and doesn't |

**Box tones** (the eighth `add()` argument) and the legend class that matches each

| Tone | Looks like | Legend class |
|---|---|---|
| `neutral` | White box | `lg-neutral` |
| `ticket` | Green box | `lg-ticket` |
| `enroll` | Purple box | `lg-enroll` |
| `alo` | Amber box | `lg-alo` |
| `manual` | Red dashed box | `lg-manual` |
| `ghost` | Grey dashed box | `lg-ghost` |

The tone names are just colour names. Use them for whatever groups make sense on your map, and say what each one means in the map's `legend`.

**Helpers** you can use inside the data: `WFURL(id)` builds a workflow link, `DEAL(id)` builds a deal record link.

## Lessons from production

These come from building and auditing a real map of this kind.

- **A repeated box id hides a box.** Adding a second tab reused an id from an earlier tab. The newer box replaced the older one, and the older tab drew an arrow from nothing. The page showed no error. The checker in Step 8 exists for this.
- **Stages nobody moves deals into.** Call results were recorded on the meeting, and on a separate appointment record, but never on the deal stage. Every deal sat in "Call booked" while dozens of calls had happened. Only the map made that visible.
- **Paid deals weighted as unlikely.** A stage holding money already collected had a 10% win probability, so the weighted forecast showed about a tenth of the real value.
- **Two workflows racing.** A purchase and an add-on paid a second apart each checked for an existing deal, found none, and each made one. Count buyers, not deals, for anything bought together.
- **One workflow's check reading the wrong record.** A "does this contact already have a booked call" check read a field only on contacts that workflow had just created, so it almost never matched. Read the branch's actual property and object, not its label.
- **Claims drift.** An audit pass of a finished map, done against the live workflows, found a field that didn't exist, a threshold that was off by one, and a sending-hours limit that had been added since. Do Step 9e every time you share an updated map.

## Troubleshooting

| Problem | Cause | Fix |
|---|---|---|
| A box is missing from a tab | Its id is used again on another map | Run `npm test` (Step 8) and rename one of them |
| An arrow starts or ends in empty space | The path's coordinates don't meet the box, or a box id in the edge is wrong | Recompute the box's centre and edge (Step 7) |
| A tab shows the wrong map, or nothing | The button's `data-map` doesn't match a `MAPS` key | Match them (Step 5a) |
| The panel stays blank after a click | A JavaScript error in the data, often a missing comma or quote | Open the browser console; it names the line |
| Panel text is cut off or broken | A bare `<` in an answer or step | Write `&lt;` (Step 6) |
| Box text runs past the edge | Title or subtitle too long for the box width | Shorten it or widen the box (Step 3d) |
| Workflow links open the wrong account | `PORTAL_ID` not set | Set it (Step 4a) |

## Limits

- The map is a snapshot. It doesn't read HubSpot live; you update the numbers and steps by hand.
- The checker checks structure, not truth. Only Step 9 catches a wrong answer.
- Box text doesn't wrap. Keep titles and subtitles short.
- Arrows are drawn by hand as SVG paths; there is no automatic layout.
