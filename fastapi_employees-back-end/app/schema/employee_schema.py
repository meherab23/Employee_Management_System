from pydantic import BaseModel, Field
from bson import ObjectId
from typing import Optional

class Employee(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id") 
    name: str
    phone: str
    email: str

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}

class Salary(BaseModel):
    id: Optional[str] = Field(default=None, alias="_id")
    employee_id: str
    amount: float
    issue_date: str 

    class Config:
        allow_population_by_field_name = True
        json_encoders = {ObjectId: str}
