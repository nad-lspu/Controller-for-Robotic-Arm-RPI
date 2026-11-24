from pydantic import BaseModel, EmailStr, model_validator
from typing import Optional, Literal, Self, List
from datetime import datetime

class UserBase(BaseModel):
    id: str
    name: str
    email: EmailStr

class UserCreateRequest(UserBase):
    password: str
    confirm_password: str
    user_type: Literal['student', 'professor', 'admin'] = 'student'

    @model_validator(mode='after')
    def check_same_password(self) -> Self:
        if self.password != self.confirm_password:
            raise ValueError('Password and Confirm Password does not match.')
        return self

class UserResponse(UserBase):
    created_at: datetime

class SignInResponse(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    user_id: str

class SendCommandRequest(BaseModel):
    command: str
    value: Optional[int] = None

class SendCommandResponse(BaseModel):
    command: str
    value: Optional[int] = None
    command_success: bool

class ServoAngleRequest(BaseModel):
    angle: int

class ServoAngleRecordRequest(BaseModel):
    channel_0: int
    channel_1: int
    channel_2: int
    channel_3: int
    channel_4: int

class ServoAngleResponse(ServoAngleRecordRequest):
    pass
    
class ActivityBase(BaseModel):
    title: str
    instructions: str

class ActivityRequest(ActivityBase):
    pass

class ActivityResponse(ActivityBase):
    id: int
    created_at: datetime

class ScoreBase(BaseModel):
    student_id: str
    activity_id: int
    score: float

class ScoreGetRequest(BaseModel):
    id: int | str
    sort_by: Literal['student', 'activity']
    sort_mode: Literal['ASC', 'DESC']

class ScoreResponse(ScoreBase):
    id: int

class ScoreCreateRequest(ScoreBase):
    pass

class ScoreCreateResponse(ScoreBase):
    id: int

class ScoreUpdateRequest(ScoreBase):
    pass

class ScoreUpdateResponse(ScoreBase):
    id: int