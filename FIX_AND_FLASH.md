# MIGHTYELITERACE — fix extension + flash micro:bit

## Problem on GitHub right now

Your live repo still has **v2.0.0** with a **broken `wonderracer.ts`** (two `namespace wonderracer` blocks = duplicate function errors).

Local folder `MIGHTYELITERACE\` has **v2.0.3 FIXED**.

## Step 1 — Upload fixed files to GitHub

Go to [github.com/KIMHUSKYRIDER/MIGHTYELITERACE](https://github.com/KIMHUSKYRIDER/MIGHTYELITERACE)

Upload and **replace** these 4 files from `Downloads\HELLO\MIGHTYELITERACE\`:

- `pxt.json` (version **2.0.3**)
- `wonderracer.ts` (only ONE `namespace wonderracer` at top)
- `wonder.ts`
- `README.md`

Commit message: `Fix duplicate namespace v2.0.3`

## Step 2 — Fresh MakeCode project

1. [makecode.microbit.org](https://makecode.microbit.org) → **New Project**
2. **Extensions** → paste ONLY:
   ```
   https://github.com/KIMHUSKYRIDER/MIGHTYELITERACE
   ```
3. Wait until compile finishes (no red errors)
4. **Do NOT** add BitBot separately (extension includes it)
5. **Do NOT** paste `bitbot-xl-competition.ts`

## Step 3 — Your program (required for download)

**On Start** → drag **Wonder start elite racer** → **Left**, **5**

Or **{}** JavaScript — delete everything, paste only:

```typescript
wonder.startEliteRacer(BBRobotDirection.Left, 5)
```

Without this, Download works but the car does nothing.

## Step 4 — Download to micro:bit

1. USB cable → micro:bit
2. Click **Download**
3. Drag `.hex` onto **MICROBIT** drive
4. Put micro:bit in BitBot → BitBot **ON** → reset

You should see: **READY** → **3 2 1** → heart → car runs.

## One-click test (after GitHub upload)

[makecode.microbit.org/_pkg/KIMHUSKYRIDER/MIGHTYELITERACE](https://makecode.microbit.org/_pkg/KIMHUSKYRIDER/MIGHTYELITERACE)

Then add **On Start** → **Wonder start elite racer** → Download.

## Still broken?

| Symptom | Fix |
|---------|-----|
| Red "Duplicate function" | GitHub still old — upload v2.0.3 `wonderracer.ts` |
| Download greyed out | Fix red errors first |
| Flashes but car still | Add On Start block; BitBot ON before reset |
| No Wonder category | Re-add extension URL; repo must be Public |
