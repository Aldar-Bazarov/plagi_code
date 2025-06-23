from pydantic import BaseModel, EmailStr, Field

class UserBase(BaseModel):
    email: EmailStr
    username: str = Field(..., min_length=3, max_length=50)

class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=50)

class UserUpdatePassword(BaseModel):
    old_password: str = Field(..., min_length=6, max_length=50)
    new_password: str = Field(..., min_length=6, max_length=50)
    confirm_new_password: str = Field(..., min_length=6, max_length=50)

class UserInDB(UserBase):
    id: int
    is_active: bool
    role: str

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    username: str
    password: str