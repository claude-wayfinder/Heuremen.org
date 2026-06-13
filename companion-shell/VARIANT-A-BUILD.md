# Companion Shell — VARIANT A build record (shuttle) — SHIP

Built against the real `CAGE-DESIGN.md`, with Bones' rulings applied (option **b**, Ø44 aperture, 16-LED ring).
Engine: `trimesh` + `manifold`. Source: `build-variant-a.py` (re-runnable).
All three pieces: **watertight = True, single body, manifold-clean.** Ready to slice.

## Pieces — measured output
| Piece | bbox (mm) | solid vol | ~weight (spec infill) | watertight |
|---|---|---|---|---|
| Base (+ vented collar) | 82 × 78 × 65 | 76.5 cm³ | ~33–38 g | ✓ |
| Ring shelf | 78 × 78 × 4 | 10.6 cm³ | ~5–7 g | ✓ |
| Cage | 92 × 92 × 91.5 | 7.0 cm³ | ~8 g (100% infill) | ✓ |

Total ≈ **48–55 g**. Assembled height ≈ **164 mm** with sphere. Fits the A1 Mini bed.

## ACOUSTIC FIX — vented collar (option a)
A sealed 51 mm base muffled the speaker. The base now carries a **12 mm vented collar** (band z51–63)
above the speaker grille: the bore stays open into it (an air chamber over the driver), and **six 18×9 mm
windows** cut the collar wall so sound escapes laterally as well as up through the Ø44 aperture into the cage,
then out the rib gaps. The shelf rides on top of the collar; the **sphere floats ~11 mm above the speaker grille**
(air gap) so it diffuses without damping. Shelf and cage geometry are unchanged — they just sit higher.

## Rulings applied
- **Aperture Ø40 → Ø44** (option b): the speaker top nests up into it; sphere rests on the rim, ring around it.
- **16-LED ring**: groove kept at Ø53.5 / Ø34 / 2 mm (per CAGE-DESIGN, the 52 mm OD ring).
- **Base height 34 → 63 mm** — 51 mm to contain the 48 mm Anker (a 34 mm base can't hold it; the Ø66.5 body would block the shelf), plus a **12 mm vented collar** so the speaker isn't sealed in (option a).
- Apex ring lands at **~90 mm** above the shelf (sphere on the Ø44 rim) — within 4 mm of Bones' 86, the delta is just the shallower seat.
- Inverted rabbet: kept. Round Ø4 ribs: kept (Variant A). Ballast: skipped (drop washers on the floor if tippy). Bottom chamfer: skipped.

## Built to spec
- **Base** (OD 78, H 63 incl. 12 mm vented collar, floor 2.5, bore Ø68 open to the collar): USB-C cutout 14×8 @5 mm; two side vents 12×6 @20 mm at 90°; three retention bumps; ESP32 pocket 24×19.5×6.5 in the wall with its own 11×5 USB-C slot; 3×2 wire channel up to the rim; six 18×9 mm collar windows; two Ø1.5 alignment pins.
- **Ring shelf** (OD 78, t 4, **aperture Ø44**): groove Ø53.5/Ø34/2; 8 mm full-depth wire notch; two Ø1.6 alignment holes; rabbet recess for the base tongue.
- **Cage** (Variant A): 3 ribs at 120° from the Ø78 edge, over the sphere equator to the 60° apex ring (inner Ø52 for flex-removal). Sphere center 45.8 mm above the shelf.

## Open confirms (non-blocking)
- **LED ring vs aperture**: with the Ø44 aperture, the ring's inner edge overhangs ~4.5 mm; it rests on the groove's outer ledge (retained by the outer wall). Fine, but eyeball it on the test-fit.
- **PARTS.md vs CAGE-DESIGN**: PARTS lists a 12-LED ~37 mm ring; groove built for the 16-LED 52 mm ring per Bones. Make sure the ring on hand is the 52 mm one.

## Print settings (spec §5)
0.2 mm layers, 3 walls, 4 top/bottom. Infill: base 20%, shelf 40%, ribs 100%. 5 mm brim on cage.
**Filament:** white = base + shelf, clear = cage.
- Base, shelf — flat on bed, no supports.
- Cage — STL saved feet-down; **flip in slicer to print inverted (apex on bed)**. Try supportless; tree supports only if the lower ribs droop.

## Status: SHIP — ready to slice and print. Run the component test-fit (ESP32 / ring / speaker / sphere) on the first pull.
