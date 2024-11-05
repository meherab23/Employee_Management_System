import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import './EditSalary.scss';

const EditSalary: React.FC = () => {
    const [employeeId, setEmployeeId] = useState('');
    const [salaryAmount, setSalaryAmount] = useState('');
    const [issueDate, setIssueDate] = useState('');
    const [errors, setErrors] = useState<{ employeeId?: string; salaryAmount?: string; issueDate?: string }>({});
    const [successMessage, setSuccessMessage] = useState('');
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    
    console.log("id", issueDate, id)
 useEffect(() => {
        axios.get(`${apiUrl}/salaries/employee/${id}`)
            .then(response => {
                console.log(response.data)
                setEmployeeId(response.data.employeeId);
                setSalaryAmount(response.data.salaryAmount);
                setIssueDate(response.data.salaryIssueDate);
            })
            .catch(error => {
                console.error('Error fetching salary:', error);
            });
    }, [id, apiUrl]);

    
    const validate = () => {
        const newErrors: { employeeId?: string; salaryAmount?: string; issueDate?: string } = {};

        if (!employeeId) {
            newErrors.employeeId = 'Employee ID is required.';
        }
        if (!salaryAmount) {
            newErrors.salaryAmount = 'Salary amount is required.';
        }
        if (!issueDate) {
            newErrors.issueDate = 'Issue date is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log(employeeId, salaryAmount, issueDate, "from edit salary");
    
        if (validate()) {
            
            const payload = {
                employeeId,          
                salaryAmount,
                salaryIssueDate: issueDate, 
            };
            
            console.log('Payload being sent:', payload);
    
            axios.put(`${apiUrl}/salaries/employee/${employeeId}`, payload)
                .then(() => {
                    setSuccessMessage('Salary successfully updated!');
                    setTimeout(() => {
                        navigate('/salary-list');
                    }, 1500);
                })
                .catch(error => {
                    console.error('Error updating salary:', error.response ? error.response.data : error);
                });
        }
    };
    return (
            
            <div className="content">

            <div className="header">
                <h1>Edit Salary</h1>
                <div className="back-icon" onClick={() => navigate('/salary-list')}>
                    <FaArrowLeft />
                </div>
            </div>
                <form className="edit-salary-form" onSubmit={handleSubmit}>
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <label>Employee ID</label>
                    <input 
                        type="text" 
                        readOnly
                        value={employeeId} 
                        onChange={(e) => setEmployeeId(e.target.value)} 
                        required 
                    />
                    {errors.employeeId && <span className="error-message">{errors.employeeId}</span>}

                    <label>Salary Amount</label>
                    <input 
                        type="text"
                        value={salaryAmount} 
                        onChange={(e) => setSalaryAmount(e.target.value)}
                        required 
                    />
                    {errors.salaryAmount && <span className="error-message">{errors.salaryAmount}</span>}

                    <label>Issue Date</label>
                    <input 
                        type="date" 
                        value={issueDate} 
                        onChange={(e) => setIssueDate(e.target.value)} 
                        required 
                    />
                    {errors.issueDate && <span className="error-message">{errors.issueDate}</span>}

                    <button type="submit" className="submit-button">Update Salary</button>
                </form>
            </div>
    );
};

export default EditSalary;
