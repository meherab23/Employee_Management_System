from repository.employee_repository import EmployeeRepository 
from repository.salary_repository import SalaryRepository
from db.mongo import get_employees_collection, get_salaries_collection  
from models.employee_model import Employee  
from models.salary_model import Salary

class EmployeeService:
    def __init__(self):
        self.employee_repository = EmployeeRepository(get_employees_collection())
        self.salary_repository = SalaryRepository(get_salaries_collection())

    def get_all_employees(self):
        return self.employee_repository.find_all_employees()

    def get_employee_by_id(self, employee_id: str):
        return self.employee_repository.find_employee_by_id(employee_id)

    def add_employee(self, employee: Employee):
        return self.employee_repository.insert_employee(employee.dict())

    def update_employee(self, employee_id: str, employee: Employee):
        result = self.employee_repository.update_employee(employee_id, employee.dict())
        return result.modified_count == 1

    def delete_employee(self, employee_id: str):
        self.delete_salaries_by_employee_id(employee_id)
        
        result = self.employee_repository.delete_employee(employee_id)
        return result.deleted_count == 1

    def add_salary(self, salary: Salary):
        return self.salary_repository.insert_salary(salary.dict())  
    
    def get_all_salaries(self):
        return self.salary_repository.find_all_salaries()

    def get_salary_by_id(self, salary_id: str):
        return self.salary_repository.find_salary_by_id(salary_id) 

    def update_salary(self, salary_id: str, salary: Salary):
        result = self.salary_repository.update_salary(salary_id, salary.dict()) 
        return result.modified_count == 1

    def delete_salary(self, salary_id: str):
        result = self.salary_repository.delete_salary(salary_id)
        return result.deleted_count == 1



