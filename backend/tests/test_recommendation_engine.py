from app.services.recommendation_engine import (
    generate_recommendations,
    _fits_budget,
    BUDGET_CEILINGS,
)


def test_cheap_item_fits_every_budget():
    """Regression test for a real bug: a cheap item was incorrectly flagged
    as 'not fitting' a higher budget tier. A Rs. 5,575 item must fit low,
    medium, and high budgets - cheaper always fits a bigger budget."""
    for budget in ["low", "medium", "high"]:
        assert _fits_budget(5_575, 21_975, budget) is True


def test_expensive_item_does_not_fit_low_budget():
    # Platform bed: Rs. 31,300-46,175, low budget ceiling is Rs. 30,000
    assert _fits_budget(31_300, 46_175, "low") is False


def test_expensive_item_fits_high_budget():
    assert _fits_budget(31_300, 46_175, "high") is True


def test_item_with_no_price_returns_none():
    assert _fits_budget(None, None, "medium") is None


def test_unknown_budget_returns_none():
    assert _fits_budget(10_000, 20_000, "not_a_real_budget") is None


def test_generate_recommendations_returns_furniture_and_color():
    recs = generate_recommendations(
        room_type="bedroom",
        style="contemporary",
        dominant_colors=["#8b775e", "#907c63"],
        budget="medium",
        lifestyle="student",
    )
    categories = {r["category"] for r in recs}
    assert "furniture" in categories
    assert "color" in categories

    furniture_items = [r for r in recs if r["category"] == "furniture"]
    assert len(furniture_items) > 0
    for item in furniture_items:
        assert item["title"]
        assert item["description"]


def test_generate_recommendations_sorts_fitting_items_first():
    recs = generate_recommendations(
        room_type="bedroom",
        style="contemporary",
        dominant_colors=["#8b775e"],
        budget="low",
        lifestyle=None,
    )
    furniture_items = [r for r in recs if r["category"] == "furniture"]
    fits_values = [r["fits_budget"] for r in furniture_items]
    # Once we hit a False, everything after should also be False or None -
    # i.e. True values are never sorted after a False value
    seen_false = False
    for fits in fits_values:
        if fits is False:
            seen_false = True
        elif fits is True:
            assert not seen_false, "A fitting item appeared after a non-fitting one"


def test_unknown_room_style_combo_falls_back_gracefully():
    recs = generate_recommendations(
        room_type="garage",
        style="brutalist",
        dominant_colors=["#000000"],
        budget="medium",
        lifestyle=None,
    )
    # Should still return the generic fallback items, not crash or return empty
    assert len(recs) > 0


def test_budget_ceilings_are_ascending():
    assert BUDGET_CEILINGS["low"] < BUDGET_CEILINGS["medium"] < BUDGET_CEILINGS["high"]