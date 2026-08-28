# # from datetime import datetime
# # from pydantic import BaseModel, ConfigDict


# # class UploadOut(BaseModel):
# #     model_config = ConfigDict(from_attributes=True)

# #     id: int
# #     original_filename: str
# #     budget: str | None
# #     lifestyle: str | None
# #     preferred_style: str | None
# #     uploaded_at: datetime


# # class PredictionOut(BaseModel):
# #     model_config = ConfigDict(from_attributes=True)

# #     id: int
# #     upload_id: int
# #     room_type: str
# #     room_confidence: float
# #     style: str
# #     style_confidence: float
# #     comfort_score: float
# #     crowdedness: float
# #     movement_efficiency: float
# #     layout_balance: float
# #     dominant_colors: str
# #     created_at: datetime


# # class RecommendationItem(BaseModel):
# #     category: str          # e.g. "furniture", "color", "decor", "layout"
# #     title: str
# #     description: str
# #     estimated_price_range: str | None = None


# # class RecommendationOut(BaseModel):
# #     prediction_id: int
# #     room_type: str
# #     style: str
# #     items: list[RecommendationItem]
# from datetime import datetime
# from pydantic import BaseModel, ConfigDict


# class UploadOut(BaseModel):
#     model_config = ConfigDict(from_attributes=True)

#     id: int
#     original_filename: str
#     budget: str | None
#     lifestyle: str | None
#     preferred_style: str | None
#     uploaded_at: datetime


# class PredictionOut(BaseModel):
#     model_config = ConfigDict(from_attributes=True)

#     id: int
#     upload_id: int
#     room_type: str
#     room_confidence: float
#     style: str
#     style_confidence: float
#     comfort_score: float
#     crowdedness: float
#     movement_efficiency: float
#     layout_balance: float
#     dominant_colors: str
#     dominant_color_percentages: str | None = None
#     created_at: datetime


# class RecommendationItem(BaseModel):
#     category: str          # e.g. "furniture", "color", "decor", "layout"
#     title: str
#     description: str
#     estimated_price_range: str | None = None


# class RecommendationOut(BaseModel):
#     prediction_id: int
#     room_type: str
#     style: str
#     items: list[RecommendationItem]
from datetime import datetime
from pydantic import BaseModel, ConfigDict


class UploadOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    original_filename: str
    budget: str | None
    lifestyle: str | None
    preferred_style: str | None
    uploaded_at: datetime


class PredictionOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    upload_id: int
    room_type: str
    room_confidence: float
    style: str
    style_confidence: float
    comfort_score: float
    crowdedness: float
    movement_efficiency: float
    layout_balance: float
    dominant_colors: str
    dominant_color_percentages: str | None = None
    created_at: datetime


class RecommendationItem(BaseModel):
    category: str          # e.g. "furniture", "color", "decor", "layout"
    title: str
    description: str
    estimated_price_range: str | None = None
    fits_budget: bool | None = None  # None = no price to compare, or no budget given


class RecommendationOut(BaseModel):
    prediction_id: int
    room_type: str
    style: str
    items: list[RecommendationItem]