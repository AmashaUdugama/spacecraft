"""
Recommendation engine: NOT a trained model. Matches room_type + style +
budget + lifestyle against a curated lookup table of furniture/decor items,
plus turns the extracted dominant colors into a suggested palette.

PRICES: real retail price ranges (LKR) sourced from Damro (damro.lk /
damro.com), Sri Lanka's largest furniture manufacturer/retailer, checked
August 2026. These are genuine market prices, not fabricated estimates -
each item below is a real, currently-sold Damro product line. Source URLs
are noted per category. Prices will drift over time as Damro updates their
catalog - re-check before using this in a live/production context beyond
academic demonstration.

To extend: add more (title, description, price_min, price_max) entries to
FURNITURE_CATALOG - no code changes needed elsewhere.
"""

# Budget tiers as spending ceilings (Sri Lankan Rupees) - "medium budget" means
# "willing to spend up to Rs. 100,000", not "must cost between 30k-100k".
# This matches how a real shopper thinks: cheaper items always fit a higher
# budget too; only items exceeding the ceiling get flagged.
BUDGET_CEILINGS = {
    "low": 30_000,
    "medium": 100_000,
    "high": 5_000_000,
}

FURNITURE_CATALOG = {
    # "contemporary" merges what were previously separate modern/minimalist/
    # scandinavian style predictions - confusion matrix analysis showed these
    # weren't reliably distinguishable from each other, so the style predictor
    # now only classifies "contemporary" vs "industrial".
    ("bedroom", "contemporary"): [
        # Source: damro.com/product-category/bedroom/bedroom-furniture/beds/ (Avron/Regent Bed range)
        ("Low-profile platform bed", "Clean lines, neutral tones fit a contemporary bedroom.", 31_300, 46_175),
        # Source: damrobf.com/budget-bedroom/ (Bedside Cupboard/Rack)
        ("Bedside cupboard / nightstand", "Keeps essentials close while leaving floor space open.", 5_575, 21_975),
        # Source: damro.com/product-category/bedroom/bedroom-furniture/wardrobes/ (2-3 door range)
        ("2-3 door wardrobe", "Hides storage, keeps the room visually open.", 45_975, 82_400),
        # Source: damrobf.com/budget-bedroom/ (Hanging Mirror)
        ("Hanging wall mirror", "Improves perceived spaciousness and natural light bounce.", 7_500, 7_900),
    ],
    ("living_room", "contemporary"): [
        # Source: damro.lk/product-category/living-room/coffee-tables-tv-stands-rugs/coffee-and-side-tables/
        ("Coffee / center table", "Natural wood or two-tone finish suits a contemporary living room.", 18_475, 62_900),
        # Source: damro.lk/product-category/living-room/sofa-and-lobby-chairs/ (Loranzi/Kevin Sofa range, fabric)
        ("3-seater fabric sofa, muted tone", "Functional, uncluttered silhouette for a contemporary room.", 80_700, 140_200),
        # Source: damro.com/product-category/living-room/coffee-tables-tv-stands-rugs/wall-shelves-and-display-stand/
        ("Wall shelf / display stand", "Adds storage and display space without floor footprint.", 3_175, 8_375),
    ],
    ("living_room", "industrial"): [
        # Same wall shelf line doubles as "exposed shelving" for industrial style
        ("Exposed wall-mounted shelving", "Signature industrial texture and open storage look.", 3_175, 8_375),
        # Source: damro.com/product-category/living-room/sofa-and-lobby-chairs/ (Clifton Sofa, Leather line)
        ("Leather sofa, dark tone", "Classic industrial material choice, single-seater price shown.", 89_100, 174_000),
    ],
    ("kitchen", "contemporary"): [
        # Source: damro.lk/product-category/dining/island-pantry/ (Veyron/Leyon Island Pantry, granite top)
        ("Modular pantry cupboard / island unit", "Sleek, minimal contemporary kitchen storage.", 180_300, 336_800),
        # No verified Sri Lankan retail price found for standalone pendant lighting -
        # kept as a rough estimate only, flagged honestly rather than presented as sourced.
        ("Pendant lighting over island", "Functional focal point. (Estimate - not from a verified retailer listing)", 6_000, 20_000),
    ],
    ("office", "contemporary"): [
        # Source: damro.lk/products/office-furniture (Study Desk with Drawer TSD 001/002)
        ("Study desk with drawer", "Keeps the workspace visually calm and organized.", 7_775, 8_675),
        # Source: damro.com/product-category/office-chairs-by-series/ (Task/Visitor Chair range)
        ("Task or visitor chair", "Comfortable seating without visual clutter.", 5_600, 24_675),
    ],
}

# Generic fallback recommendations used when no exact (room_type, style) match exists
GENERIC_FALLBACK = [
    # Source: ikman.lk Damro "Shelves & Pantry Cupboards" listings (typical range)
    ("Multi-functional storage unit", "Maximizes usable space in any room type.", 8_700, 46_000),
    ("Neutral base palette with one accent color", "Paint/styling choice, not a purchasable item - no fixed price.", None, None),
    # Source: damrobf.com/budget-bedroom/ (Hanging Mirror)
    ("Mirror placement to visually expand the room", "Improves perceived spaciousness.", 7_500, 7_900),
]


def _format_price_range(price_min, price_max) -> str | None:
    if price_min is None or price_max is None:
        return None
    if price_min == price_max:
        return f"Rs. {price_min:,}"
    return f"Rs. {price_min:,} - {price_max:,}"


def _fits_budget(price_min, price_max, budget: str | None) -> bool | None:
    """Returns True/False if we can compare, None if there's nothing to compare
    (e.g. a styling tip with no price) or budget wasn't specified.
    "Fits" means the item's cheapest option is within what the user said
    they're willing to spend - a Rs. 5,000 item always fits a Rs. 100,000
    budget; only items whose minimum price exceeds the ceiling are flagged."""
    if price_min is None or budget not in BUDGET_CEILINGS:
        return None
    return price_min <= BUDGET_CEILINGS[budget]


def generate_recommendations(
    room_type: str,
    style: str,
    dominant_colors: list[str],
    budget: str | None = None,
    lifestyle: str | None = None,
) -> list[dict]:
    key = (room_type, style)
    items = FURNITURE_CATALOG.get(key, GENERIC_FALLBACK)

    recommendations = []
    for title, desc, price_min, price_max in items:
        recommendations.append({
            "category": "furniture",
            "title": title,
            "description": desc,
            "estimated_price_range": _format_price_range(price_min, price_max),
            "fits_budget": _fits_budget(price_min, price_max, budget),
        })

    # Sort so items that fit the stated budget appear first (fits=True, then
    # unknown/no-price, then over-budget) without hiding any options outright
    recommendations.sort(key=lambda r: (r["fits_budget"] is False, r["fits_budget"] is None))

    # Color palette recommendation from the actual extracted dominant colors
    if dominant_colors:
        recommendations.append({
            "category": "color",
            "title": "Suggested palette from your room",
            "description": f"Primary tones detected: {', '.join(dominant_colors[:3])}. "
                            f"Pair these with one neutral (white/grey/beige) accent.",
            "estimated_price_range": None,
            "fits_budget": None,
        })

    if lifestyle == "remote_worker" and room_type in ("bedroom", "living_room"):
        recommendations.append({
            "category": "layout",
            "title": "Dedicated work corner",
            "description": "Consider a small desk nook near natural light to separate work and rest zones.",
            "estimated_price_range": _format_price_range(7_775, 24_675),  # study desk + task chair range
            "fits_budget": _fits_budget(7_775, 24_675, budget),
        })

    return recommendations