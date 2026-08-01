Issue 1 — Column headers broken/overlapping

The platform column (first column, the checkbox/grid icon) has no defined width, causing PROBLEM and DIFFICULTY headers to overlap. Fix the column widths:

Platform column: fixed 52px, centered
Problem column: flex 1, minimum 260px
Difficulty: 100px
Topic: 130px
Status: 120px
Star: 44px, centered
Next Revision: 130px
Notes: 180px
Add Column button: auto

Make sure these widths apply to both the header row AND every data row so they stay aligned.

Issue 2 — "+ New row" should be at the top

Move the + New row trigger from below the empty state to immediately below the column headers row, above the empty state. It should always be the first thing after the headers regardless of whether there are problems or not. Style: +  New row in #444, 13px, left-aligned under the Problem column, 12px vertical padding. Clicking it starts the inline row creation flow.