from bson import ObjectId
from pymongo.collection import Collection

class EmployeeRepository:
    def __init__(self, employees_collection: Collection, salaries_collection: Collection):
        self.employees_collection = employees_collection
        self.salaries_collection = salaries_collection

    def find_all_employees(self):
        return list(self.employees_collection.find())

    def find_employee_by_id(self, employee_id: str):
        return self.employees_collection.find_one({"_id": ObjectId(employee_id)})

    def insert_employee(self, employee_data: dict):
        return self.employees_collection.insert_one(employee_data).inserted_id

    def update_employee(self, employee_id: str, employee_data: dict):
        return self.employees_collection.update_one({"_id": ObjectId(employee_id)}, {"$set": employee_data})

    def delete_employee(self, employee_id: str):
        return self.employees_collection.delete_one({"_id": ObjectId(employee_id)})

    def find_all_salaries(self):
        return list(self.salaries_collection.find())

    def find_salary_by_id(self, salary_id: str):
        return self.salaries_collection.find_one({"_id": ObjectId(salary_id)})

    def insert_salary(self, salary_data: dict):
        return self.salaries_collection.insert_one(salary_data).inserted_id

    def update_salary(self, salary_id: str, salary_data: dict):
        return self.salaries_collection.update_one({"_id": ObjectId(salary_id)}, {"$set": salary_data})

    def delete_salary(self, salary_id: str):
        return self.salaries_collection.delete_one({"_id": ObjectId(salary_id)})

    def delete_salary(self, salary_id: str):
        return self.salaries_collection.delete_many({"_id": ObjectId(salary_id)})

