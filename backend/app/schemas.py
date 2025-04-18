from pydantic import BaseModel, HttpUrl, ConfigDict
from typing import Optional
from datetime import datetime


class URLCreate(BaseModel):
    original_url: HttpUrl
    custom_alias: Optional[str] = None
    expiration: Optional[datetime] = None


class URLInfo(BaseModel):
    short_code: str
    original_url: HttpUrl
    created_at: datetime
    expiration: Optional[datetime]
    visits: int


    model_config = ConfigDict(from_attributes=True)
