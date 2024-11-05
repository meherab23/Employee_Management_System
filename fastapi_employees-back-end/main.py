from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware
import pymongo

app = FastAPI()
client = pymongo.MongoClient("mongodb://localhost:27017")
db = client["fastapi_db"]
employees_collection = db["employees"]
salaries_collection = db["salaries"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Employee(BaseModel):
    name: str
    phone: str
    email: str

class Salary(BaseModel):
    employeeId: str 
    salaryAmount: float 
    salaryIssueDate: str  

def employee_helper(employee) -> dict:
    return {
        "id": str(employee["_id"]),
        "name": employee["name"],
        "phone": employee["phone"],
        "email": employee["email"]
    }

def salary_helper(salary) -> dict:
    return {
        "id": str(salary["_id"]),
        "employeeId": salary["employeeId"],
        "salaryAmount": salary["salaryAmount"],
        "salaryIssueDate": salary["salaryIssueDate"]
    }

@app.post("/employees/")
def add_employee(employee: Employee):
    employee_id = employees_collection.insert_one(employee.dict()).inserted_id
    return {"id": str(employee_id)}

@app.get("/employees/")
def get_employees():
    employees = [employee_helper(employee) for employee in employees_collection.find()]
    return employees

@app.get("/employees/{id}")
def get_employee(id: str):
    employee = employees_collection.find_one({"_id": ObjectId(id)})
    if employee:
        return employee_helper(employee)
    raise HTTPException(status_code=404, detail="Employee not found")

@app.put("/employees/{id}")
def update_employee(id: str, employee: Employee):
    if employees_collection.find_one({"_id": ObjectId(id)}):
        employees_collection.update_one({"_id": ObjectId(id)}, {"$set": employee.dict()})
        return {"message": "Employee updated"}
    raise HTTPException(status_code=404, detail="Employee not found")

@app.delete("/employees/{id}")
def delete_employee(id: str):
    delete_result = employees_collection.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "Employee deleted"}
    raise HTTPException(status_code=404, detail="Employee not found")


@app.post("/salaries/")
def add_salary(salary: Salary):
    employee = employees_collection.find_one({"_id": ObjectId(salary.employeeId)})
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")

    salary_id = salaries_collection.insert_one(salary.dict()).inserted_id
    return {"id": str(salary_id)}

@app.get("/salaries/")
def get_salaries():
    salaries = [salary_helper(salary) for salary in salaries_collection.find()]
    return salaries

@app.get("/salaries/employee/{employee_id}")
def get_salary_by_employee(employee_id: str):
    salary = salaries_collection.find_one({"employeeId": employee_id})
    if salary:
        return salary_helper(salary)
    raise HTTPException(status_code=404, detail="Salary not found")

@app.put("/salaries/employee/{employee_id}")
def update_salary(employee_id: str, salary: Salary):
    try:
        print(f"Updating salary for employeeId: {employee_id}")
        existing_salary = salaries_collection.find_one({"employeeId": employee_id})

        if existing_salary:
            salary_update_result = salaries_collection.update_one(
                {"_id": existing_salary["_id"]},  
                {"$set": salary.dict()}  
            )
            if salary_update_result.modified_count == 1:
                return {"message": "Salary updated successfully"}
            else:
                return {"message": "No changes made to the salary"}
        raise HTTPException(status_code=404, detail="Salary not found")
    except Exception as e:
        print("Error during salary update:", e)
        raise HTTPException(status_code=500, detail="Internal server error")
    
@app.delete("/salaries/{id}")
def delete_salary(id: str):
    delete_result = salaries_collection.delete_one({"_id": ObjectId(id)})
    if delete_result.deleted_count == 1:
        return {"message": "salary records deleted successfully"} 
    raise HTTPException(status_code=404, detail="No salary records found for this employee")
