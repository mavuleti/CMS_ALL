// Writing guidance shown next to each field — so a human or an AI assistant
// filling in the form knows exactly what makes a good value for that field.
// Sourced from GENERATOR-CONTENT-GUIDE.md / puzzle-json-schema.md.

export const FIELD_TIPS = {
  slug: 'Kebab-case, ends in "-dot-to-dot-puzzle" (e.g. cute-fox-dot-to-dot-puzzle). Same across every locale — never translate.',
  header: {
    title: 'Include the dot count and a keyword, e.g. "Cute Puppy Dot to Dot — 70 Dots Printable". Google truncates by pixel width, so keep it near the low end of the range.',
    meta_description: 'Lead with a surprising fact about the animal/object, then end with the dot count and age range. Aim for ~155 chars — that\'s the safe display width.',
    og: {
      title: 'Usually the same hook as header.title, can be slightly more social/inviting.',
      description: 'A short standalone version of meta_description — written to work without the title for context (shown on social shares).',
      image_alt: 'Describe the card image as if the puzzle is mid-reveal, e.g. "Adorable floppy-eared puppy wagging into view across 70 printable dots". Include the dot count.'
    },
    json_ld: {
      type: 'Leave as "CreativeWork" unless there is a specific reason to change it.',
      name: 'Same value as body.name — the puzzle\'s short display name.',
      description: 'Must match what is visibly on the page — do not state facts here that aren\'t also in body content.',
      image: 'Full https:// URL ending in .jpg, .jpeg, .png, .webp, .gif, or .svg — not a relative path.',
      educational_use: 'Name the skills this puzzle builds, e.g. "Fine motor skills, number sequencing".',
      age_range: 'Never guess this — derive it from dot count via the difficulty rubric: 10–20→3–5, 21–50→4–7, 51–100→5–9, 101–150→7–12, 150+→9–12+.'
    }
  },
  body: {
    h1: 'Slightly longer than header.title, with an extra hook like "— 70 Dots of Printable Fun".',
    name: 'Short display name for the puzzle, e.g. "Cute Puppy". Must match header.json_ld.name.',
    tagline: 'One punchy, child-friendly line — think of it as the page\'s first line of excitement, not a description.',
    description: 'Lead with what the child does: "Connect N dots to reveal...". Mention what skill it builds. 1–2 sentences.',
    fun_fact: 'One genuine, verifiable fact about the subject. Must be different from every section fact and not repeated in the meta description.',
    dot_guide: {
      intro: 'One paragraph: set the scene, name the animal/object, build excitement, and mention the total dot count.',
      outro: 'Celebrate finishing the puzzle, suggest colouring it in, and link back to the index with something like: discover more free <a href="/">dot to dot printables</a>.',
      section: {
        range: 'En-dash format like "1–15" (not a hyphen). Each section should cover roughly 10–20 dots and match a distinct body part.',
        title: 'Name the body part being drawn in this range, e.g. "The Head and Floppy Ears".',
        learn: 'Describe the drawing task and the skill it practises — curves, precision, long flowing strokes, etc.',
        fact: 'One new, real fact about this specific body part or behaviour — must not repeat the main fun_fact or any other section\'s fact.'
      },
      colorScheme: {
        name: 'A real-world variant name, e.g. "Golden Retriever Puppy" — something a colourer could recognize and aim for.',
        note: 'One sentence on why this colour variant is interesting or worth choosing.',
        mapping: {
          range: 'Same en-dash range format as the matching dot-guide section, e.g. "1–15".',
          part: 'The body part this colour applies to — should line up with the section title it corresponds to.',
          color: 'Use a specific, recognizable colour name — Crayola-style names work well (e.g. "Raw Sienna") over generic ones (e.g. "brown").',
          hex: 'A real hex value that actually matches the named colour — mismatches get flagged.',
          why: 'One sentence on why this colour fits this specific body part (natural coloring, common variant, etc.).'
        }
      }
    }
  }
};
