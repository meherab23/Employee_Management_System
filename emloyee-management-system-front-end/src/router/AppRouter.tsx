import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AddEmployee from '../component/add-employee/AddEmployee';
import EditEmployee from '../component/edit-employee/EditEmployee';
import EmployeeList from '../component/employee-list/EmployeeList';
import AddSalaryData from '../component/add-salary-data/AddSalaryData';
import SalaryList from '../component/salary-list/SalaryList';
import EditSalary from '../component/edit-salary/EditSalary';
import Login from '../component/log-in/Login';


const AppRoutes: React.FC = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/employee-list" element={<EmployeeList />} />
                <Route path="/add" element={<AddEmployee />} />
                <Route path="/edit/:id" element={<EditEmployee />} />
                <Route path="/add-salary/:id" element={<AddSalaryData />} />
                <Route path="/salary-list" element={<SalaryList />} />
                <Route path="/edit-salary/:id" element={<EditSalary />} />
                <Route path="/edit-salary/:salaryId" element={<EditSalary />} />

                
            </Routes>
        </Router>
    );
};

export default AppRoutes;
