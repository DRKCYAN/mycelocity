---
title: 'Reading Your Farm''s Economics: Margin, Break-even and ROI'
description: How yield and cost become margin, break-even and return on investment — the chain that turns a grow into a business, tied to four connected calculators.
seoTitle: 'Mushroom Farm Economics — Margin, Break-even & ROI | Mycelocity'
datePublished: '2026-06-19'
order: 8
category: Economics
relatedCalculators:
  - profit-per-block
  - break-even
  - startup-cost
  - payback-roi
---

Biology decides whether you *can* grow mushrooms. Economics decides whether you
*should* — at least as a business. This guide walks the chain that turns yield
and cost into the numbers an owner or lender actually asks about: margin,
break-even, and return on investment. Each step has a calculator behind it, and
they all share one grow profile.

## Step 1 — Contribution margin per block

Margin is what one block contributes after its own variable cost:

> revenue = yield_lb × price&nbsp;&nbsp;·&nbsp;&nbsp;margin = revenue − COGS

This is the heart of the [Profit per Block](/calculators/profit-per-block)
calculator. Yield comes from biological efficiency, COGS from
[Costing a Block](/guides/costing-a-block). If margin per block is negative, no
amount of volume saves you — that is the first thing to fix.

## Step 2 — Break-even volume

Fixed costs — rent, salaries, insurance — do not care how many blocks you sell.
**Break-even** is the volume at which contribution margin finally covers them:

> breakevenBlocks = fixedCosts / marginPerBlock

The [Break-even](/calculators/break-even) calculator returns this in both blocks
and pounds per month. Below it you lose money; above it each additional block is
profit. It is the most honest one-line summary of whether your price and cost
structure work.

## Step 3 — Monthly net profit

Scale margin by your monthly volume and subtract fixed costs:

> monthlyNet = marginPerBlock × blocksPerMonth − fixedCosts

This is the figure that flows into the investment view — and the reason a small
change in margin per block, multiplied across thousands of blocks, moves the
whole business.

## Step 4 — Payback and ROI

A profitable month does not by itself justify the capital it took to get there.
Two calculators close the loop:

- [Startup Cost](/calculators/startup-cost) totals the capital to open the doors
  — equipment, initial inventory, deposit, licensing, build-out.
- [Payback & ROI](/calculators/payback-roi) divides that capital by monthly net
  profit to get **payback months**, then annualises it into a **return on
  investment**.

> paybackMonths = capital / monthlyNet&nbsp;&nbsp;·&nbsp;&nbsp;ROI% = (monthlyNet × 12 / capital) × 100

## Reading it as one model

The point of Mycelocity is that these are not four separate spreadsheets. Change
your biological efficiency and the yield moves, which moves margin, which moves
break-even, which moves payback — all from one grow profile. Use this chain to
ask "what if": *what if price drops 10%? what if I halve contamination? what if
rent doubles?* The connected calculators answer instantly, so you can find the
fragile assumptions before they find you.
