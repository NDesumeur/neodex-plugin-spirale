# Spiral

A pixel art skill game: a ball bounces on the platforms of a spiral tower. Turn the tower so it drops through the holes.

*Version française : [README.md](README.md)*

## Controls

- **← →** (or **Q D**): turn the tower.
- **Mouse**: drag left and right to turn the tower.
- **P** or **Esc**: pause.

## How it works

- The ball bounces by itself. Bring a **hole** under it: it drops to the next platform.
- **Red** (striped) tiles break it: game over.
- If it goes through **three platforms in a row**, it comes in **FAST** and smashes the next platform, even red.
- The holes follow the spiral: there is never red right under a hole. The danger is turning while the ball comes down.
- The **golden** platform at the bottom ends the level. After that, holes get smaller, red grows and the tower gets taller. Each level has its own colour.

## Stats

The Bests panel keeps your **best level**, **best score**, the number of **levels done** and **games**. The game resumes at the level where you stopped.

## Data and sync

Your bests and level are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Spiral → Install**.

Building a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
