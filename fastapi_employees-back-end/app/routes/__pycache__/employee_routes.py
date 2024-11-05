from fastapi import APIRouter, HTTPException
from bson import ObjectId
from service.employee_service import EmployeeService
from models.employee_model import Employee  
from models.salary_model import Salary  

router = APIRouter()
employee_service = EmployeeService()

@router.post("/employees/")
def add_employee(employee: Employee):
    employee_id = employee_service.add_employee(employee)
    return {"id": str(employee_id)}

@router.get("/employees/")
def get_employees():
    return employee_service.get_all_employees()

@router.get("/employees/{id}")
def get_employee(id: str):
    employee = employee_service.get_employee_by_id(id)
    if not employee:
        raise HTTPException(status_code=404, detail="Employee not found")
    return employee

@router.put("/employees/{id}")
def update_employee(id: str, employee: Employee):
    updated = employee_service.update_employee(id, employee)
    if not updated:
        raise HTTPException(status_code=404, detail="Employee not found")
    return {"message": "Employee updated"}

@router.delete("/employees/{id}")
def delete_employee(id: str):
    deleted = employee_service.delete_employee(id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    employee_service.delete_salaries_by_employee_id(id)
    return {"message": "Employee and associated salaries deleted"}

@router.post("/salaries/")
def add_salary(salary: Salary):
    salary_id = employee_service.add_salary(salary)
    return {"id": str(salary_id)}

@router.get("/salaries/")
def get_salaries():
    return employee_service.get_all_salaries()

@router.get("/salaries/{id}")
def get_salary(id: str):
    salary = employee_service.get_salary_by_id(id)
    if not salary:
        raise HTTPException(status_code=404, detail="Salary not found")
    return salary

@router.put("/salaries/{id}")
def update_salary(id: str, salary: Salary):
    salary_id = ObjectId(id)
    updated = employee_service.update_salary(salary_id, salary)
    if not updated:
        raise HTTPException(status_code=404, detail="Salary not found")
    return {"message": "Salary updated"}

@router.delete("/salaries/{id}")
def delete_salary(id: str):
    deleted = employee_service.delete_salary(id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Employee not found")
    
    employee_service.delete_salaries_by_employee_id(id)
    return {"message": "Employee and associated salaries deleted"}
