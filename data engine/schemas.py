# schemas.py
from pydantic import BaseModel, Field, validator
from typing import List

class AnalysisRequest(BaseModel):
    user_id: str
    # We use Like Counts for Benford because we can fetch them instantly
    like_counts: List[int] = Field(..., min_items=10, description="Like counts of last N posts")
    post_timestamps: List[float] = Field(..., min_items=10, description="Unix timestamps of posts")
    comments: List[str] = Field(..., description="Captions or comments from posts")

    @validator('like_counts')
    def check_positive(cls, v):
        if any(x < 0 for x in v):
            raise ValueError("Like counts must be positive")
        return v