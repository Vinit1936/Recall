# UI Resources Reference — use these when relevant, don't force them

When building frontend components, you have access to the following libraries and resources. Use them when they genuinely improve the output — don't force-use any of them, and don't install everything at once. Pick what fits the specific component being built.

## Component libraries / UI kits
- **shadcn/ui** — primary component library. Use for base primitives (buttons, dropdowns, dialogs, inputs, badges). Install with `npx shadcn@latest init` if not already set up.
- **Aceternity UI** (https://ui.aceternity.com/components) — for distinctive, animated UI pieces. Good for hero sections, cards with hover effects, spotlight effects.
- **Vengence UI** (https://www.vengenceui.com/components/) — additional styled components worth checking for anything shadcn doesn't cover well.
- **Notion UI** (https://notion-ui.vercel.app/docs/blocks/table-view) — reference specifically for the table component. We want a Notion-style table feel, not an exact copy — use this for inspiration on row interaction, inline editing, column headers.
- **React Bits** (https://reactbits.dev/) — animated React components. Good for micro-interactions, loading states, transitions.

## Animation libraries
- **Motion** (motion.dev, formerly Framer Motion) — for smooth transitions, page animations, list animations. Use sparingly and purposefully — not every element needs animation.
- **GSAP** (https://gsap.com/) — for more complex, timeline-based animations. Only reach for this if Motion can't handle what's needed — it's heavier.

## General rules
- Prefer shadcn/ui + Tailwind for structural/layout components
- Use Motion for transitions and micro-interactions
- Check Aceternity and React Bits before building a custom animated component from scratch — something may already exist
- Notion UI is reference only — understand the pattern, then implement it natively with our stack
- Do not install GSAP and Motion in the same phase unless both are genuinely needed
- Always check if a library is already in package.json before installing it again