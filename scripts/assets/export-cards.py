"""Export ARCANA WebP pairs from external, unframed <assetId>.png masters.

Usage: python scripts/assets/export-cards.py MASTER_DIR [assetId ...]
Requires the project's Node.js, Python 3, and Pillow 10.1+ with WebP support.
A full export also regenerates docs/assets/deck-overview-v2.webp.
"""

import argparse
import json
import subprocess
from io import BytesIO
from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[2]
CARDS = ROOT / "public" / "cards"
FRAME = ROOT / "docs" / "assets" / "card-frame-template.png"
# Dark halo under the frame lines for bright paintings (rendered by `npm run art`).
HALO = ROOT / "docs" / "assets" / "card-frame-halo.png"
LIGHT_FRAMES = {"card-fool", "card-magician", "card-empress", "card-lovers", "card-strength",
                "card-temperance", "card-sun", "card-judgement", "card-world"}
FULL = (720, 1080)
THUMB = (240, 360)
LANCZOS = Image.Resampling.LANCZOS
HALF_TURN = Image.Transpose.ROTATE_180

# Vertical registration at 720 x 1080: (original row, printed row). Move the
# illustrated symbols as a unit and take the extra space from sky, stone or water.
LAYOUT = {
    "card-hierophant": [(38, 52), (440, 454), (732, 653), (997, 918)],
    "card-wheel": [(40, 72), (650, 682)],
    "card-temperance": [(35, 75), (660, 700)],
    "card-star": [(42, 103), (760, 821)],
    "card-moon": [(38, 112), (840, 914)],
    "card-judgement": [(40, 85), (560, 605)],
}


def read_deck():
    # Use the same ID order and numeral formatter as the app, even if a WebP is missing.
    query = """
        import { DECK } from './src/content/index.ts';
        import { toRoman } from './src/i18n/index.ts';
        console.log(JSON.stringify(DECK.map(card => [card.assetId, toRoman(card.order)])));
    """
    result = subprocess.check_output(
        ["node", "--experimental-strip-types", "--no-warnings", "--input-type=module", "-e", query],
        cwd=ROOT, text=True, encoding="utf-8",
    )
    return [*json.loads(result), ("card-back", "–")]


def write_overview(deck):
    width, height = THUMB
    columns, gap, caption = 6, 14, 32
    rows = (len(deck) + columns - 1) // columns
    sheet = Image.new("RGB", (columns * (width + gap) + gap,
                              rows * (height + caption + gap) + gap), "#100D1C")
    pen = ImageDraw.Draw(sheet)
    font = ImageFont.truetype(str(ROOT / "node_modules/@fontsource-variable/manrope/files"
                                 / "manrope-latin-wght-normal.woff2"), size=16)
    font.set_variation_by_axes([500])
    for index, (asset_id, numeral) in enumerate(deck):
        x = gap + index % columns * (width + gap)
        y = gap + index // columns * (height + caption + gap)
        with Image.open(CARDS / "thumbs" / f"{asset_id}.webp") as thumbnail:
            sheet.paste(thumbnail, (x, y))
        pen.text((x + width // 2, y + height + caption // 2),
                 f"{numeral} · {asset_id}", font=font, anchor="mm", fill="#EFD9A4")
    path = ROOT / "docs" / "assets" / "deck-overview-v2.webp"
    path.write_bytes(webp(sheet, quality=90))
    print(path.relative_to(ROOT))


def compose_front(master, asset_id, frame, halo):
    painting = master.resize(FULL, LANCZOS)
    if asset_id in LAYOUT:
        aligned = Image.new("RGB", FULL)
        stops = [(0, 0), *LAYOUT[asset_id], (FULL[1], FULL[1])]
        for (start, top), (end, bottom) in zip(stops, stops[1:]):
            strip = painting.crop((0, start, FULL[0], end))
            aligned.paste(strip.resize((FULL[0], bottom - top), LANCZOS), (0, top))
        painting = aligned
    if asset_id == "card-high-priestess":
        # Leave space between the moon and the application's numeral medallion.
        shift = 34
        sky = ImageOps.flip(painting.crop((0, 0, FULL[0], shift)))
        painting.paste(painting.crop((0, 0, FULL[0], FULL[1] - shift)), (0, shift))
        painting.paste(sky, (0, 0))
    framed = painting.convert("RGBA")
    if asset_id in LIGHT_FRAMES:
        framed = Image.alpha_composite(framed, halo)
    return Image.alpha_composite(framed, frame).convert("RGB")


def compose_back(master):
    # The compass hub in the selected master is at (512, 744) on a 1024 x 1536 grid.
    # Take the half above it, preserving the proportions of the engraved rings.
    hub_y = master.height * 744 / 1536
    half_width = hub_y * 2 / 3
    center_x = master.width / 2
    upper = master.resize(
        (720, 540), LANCZOS,
        box=(center_x - half_width, 0, center_x + half_width, hub_y),
    )
    back = Image.new("RGB", FULL)
    back.paste(upper, (0, 0))
    back.paste(upper.transpose(HALF_TURN), (0, 540))

    # Antialias the two rules separately from the painted paper.
    scale = 3
    rules = Image.new("RGBA", (FULL[0] * scale, FULL[1] * scale))
    pen = ImageDraw.Draw(rules)
    for inset, radius, width, gold in [
        (19, 16, 3, "#D8B879"), (32, 12, 1, "#BA9B65"),
    ]:
        rect = (inset * scale, inset * scale,
                rules.width - inset * scale - 1, rules.height - inset * scale - 1)
        pen.rounded_rectangle(rect, radius * scale, outline=gold, width=width * scale)
    return Image.alpha_composite(back.convert("RGBA"), rules.resize(FULL, LANCZOS)).convert("RGB")


def webp(image, **options):
    out = BytesIO()
    image.save(out, format="WEBP", method=6, **options)
    return out.getvalue()


def encode(image, limit, is_back):
    if is_back:
        # Lossy WebP blocks can break exact rotation. Fit a small paper-and-brass
        # palette on one half, rotate the resulting pixels and encode losslessly.
        upper = image.crop((0, 0, image.width, image.height // 2))
        for colors in (256, 192, 128, 96, 64, 48, 32):
            quantized = upper.quantize(colors=colors, method=Image.Quantize.FASTOCTREE).convert("RGB")
            symmetric = Image.new("RGB", image.size)
            symmetric.paste(quantized)
            symmetric.paste(quantized.transpose(HALF_TURN), (0, upper.height))
            data = webp(symmetric, lossless=True)
            if len(data) <= limit:
                return data
    else:
        for quality in range(85, 69, -1):
            data = webp(image, quality=quality)
            if len(data) <= limit:
                return data
    raise ValueError(f"Image of size {image.size} exceeds {limit:,} bytes")


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("masters", type=Path)
    parser.add_argument("cards", nargs="*", help="asset IDs, default: every card in the deck")
    args = parser.parse_args()
    deck = read_deck()
    known_ids = [card_id for card_id, _ in deck]
    card_ids = args.cards or known_ids
    unknown = set(card_ids).difference(known_ids)
    if unknown:
        parser.error(f"Unknown card IDs: {', '.join(sorted(unknown))}")

    with Image.open(FRAME) as source:
        if source.size != FULL or source.mode != "RGBA":
            raise ValueError("Expected a 720 x 1080 RGBA frame")
        frame = source.copy()
    with Image.open(HALO) as source:
        halo = source.convert("RGBA")

    outputs = {}
    for asset_id in card_ids:
        with Image.open(args.masters / f"{asset_id}.png") as source:
            w, h = source.size
            if w < 1024 or h < 1536 or 3 * w != 2 * h:
                raise ValueError(f"{asset_id}: expected a 2:3 master of at least 1024 x 1536")
            master = source.convert("RGB")
        back = asset_id == "card-back"
        image = compose_back(master) if back else compose_front(master, asset_id, frame, halo)
        name = f"{asset_id}.webp"
        outputs[CARDS / name] = encode(image, 200_000, back)
        outputs[CARDS / "thumbs" / name] = encode(image.resize(THUMB, LANCZOS), 35_000, back)

    for path, data in outputs.items():
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_bytes(data)
        print(f"{len(data):7,d} B  {path.relative_to(ROOT)}")
    if set(card_ids) == set(known_ids):
        write_overview(deck)


if __name__ == "__main__":
    main()
