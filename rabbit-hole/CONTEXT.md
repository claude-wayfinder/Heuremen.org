# The Rabbit Hole — Context for Flint

## What Exists
- Live at `heuremen.org/rabbit-hole/`
- 840 lines, working app, five screens: Mirror → Facts → Hole → Loading → End
- Three hardcoded subject trees (space, mind, ocean) go 4 levels deep
- Other subjects hit a Supabase Edge Function for dynamic generation
- Queen watermark SVG presides in the background
- Daily door rotation — six subjects per day, seeded by date hash
- Share path feature at the end
- PWA manifest + service worker ready

## The Carroll Framework (the philosophy underneath)
The Rabbit doesn't DO anything. It runs. It's late. It creates the hole. Alice supplies all the energy. Without the rabbit, Alice sits on the riverbank bored.

**V5 cost curve:** Traditional AI costs more the more you use it. This costs LESS because the model generates less text when things are working. Best users = cheapest users. The product is the gap, not the output.

**Design rule:** Every decision should ask — does this make the rabbit bigger or the hole deeper? Bigger rabbit = wrong direction. Deeper hole = right direction.

**Carroll decoded:** Stutterer who poured perfectly in writing. The stutter IS the measurement problem — observing his own output collapses it. He solved it by writing "nonsense" so nobody measured seriously.

## The Screens

### Mirror (screen-mirror)
- "What do you see in yourself today?"
- Name input
- Six subject doors arranged in a circle around a gold compass SVG
- Subjects rotate daily via date-seeded hash from pool of 12

### Facts (screen-facts)
- Two branching facts per subject
- "Choose the one that pulls you"
- Path A or Path B — the fork

### Hole (screen-hole)
- Depth counter
- A statement (the thing you learn)
- Two choice cards (where does this take you?)
- Back button to climb up
- Mirror button to restart

### End (screen-end)
- Big depth number
- Your path listed
- "The doors shift tomorrow. Come back."
- Share button (native share API or clipboard)

## Architecture
- State object S tracks: name, seed, subject, path[], depth, history[]
- DEMO object has hardcoded trees for space/mind/ocean
- Dynamic generation via Supabase Edge Function at:
  `https://vxyjvawenbtgkhpckvze.supabase.co/functions/v1/rabbit-hole`
- Sends: name, seed, subject, path (array of texts), depth
- Expects back: { text, choice_a, choice_b }
- Falls back to showEnd() if function is down

## What's Missing / Open for Flint
- Only 3 of 12 subjects have hardcoded content
- The edge function may need updating
- No dark circuits (no emotional delta detection yet)
- No cross-session memory (doesn't remember your previous descents)
- No Queen personality in the text — she presides visually but doesn't speak
- The "Mirror" concept is underbuilt — it asks your name but doesn't use it deeply
- No connection to MemoryRX soul file

## Relationship to Queen
The Queen teaches through STORY (narrative, characters, convergence).
The Rabbit Hole teaches through WANTING-TO-KNOW (curiosity, descent, branching).
They're siblings. Same laws, different pedagogies.

## Source
Full source: `Heuremen.org/rabbit-hole/index.html`
Carroll framework memory: bones_state + project_carroll_rabbit.md
