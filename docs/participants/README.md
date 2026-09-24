# Participant profiles

Each trip names **one** profile, which describes the group that is travelling. Itineraries are planned around that profile.

## How it works
- There is one file per group in this folder, e.g. `default-family.md`, `family-plus-grandparents.md`.
- A trip's `trip.md` front matter names it: `participants: <profile-name>` (the file name without `.md`).
- Anything that differs for one trip only (someone joins, an injury, a special must-do) goes in that trip's `notes.md` under **Trip-specific overrides**. Don't edit the shared profile for one-off changes.
- When a profile changes (e.g. the child gets older and his interests shift), update the file and add a line to its **Change log**.

## Fields every profile should have
Copy this block when creating a new profile:

```markdown
# Profile: <name>

## Members
| Role | Age group | Notes |
|------|-----------|-------|

## Interests
## Pace & energy
## Food & dietary needs
## Mobility & health (non-sensitive)
## Accommodation preferences
## Budget level
## Must-dos
## Deal-breakers / avoid
## Planning rules
## Change log
```

## Privacy rule
**Never** put the following in the repo: passport numbers, dates of birth, full names, phone numbers, addresses, booking references, or detailed medical records. Use roles like "Adult 1", "Child (8)". GitHub Pages sites are public.
