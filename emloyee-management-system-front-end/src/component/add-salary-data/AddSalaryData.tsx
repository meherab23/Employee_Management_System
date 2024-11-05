import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import './AddSalaryData.scss';

const AddSalaryData: React.FC = () => {
    const [salaryAmount, setSalaryAmount] = useState('');
    const [salaryIssueDate, setSalaryIssueDate] = useState('');
    const [errors, setErrors] = useState<{ salaryAmount?: string; salaryIssueDate?: string }>({});
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const { id: employeeId } = useParams();

    const validate = () => {
        const newErrors: { salaryAmount?: string; salaryIssueDate?: string } = {};

        if (!salaryAmount) {
            newErrors.salaryAmount = 'Salary amount is required.';
        } else if (isNaN(Number(salaryAmount))) {
            newErrors.salaryAmount = 'Salary amount must be a number.';
        }
        
        if (!salaryIssueDate) {
            newErrors.salaryIssueDate = 'Salary issue date is required.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            const salaryData = {
                employeeId,
                salaryAmount,
                salaryIssueDate,
            };
            axios.post(`${process.env.REACT_APP_API_BASE_URL}/salaries/`, salaryData)
                .then(() => {
                    setSuccessMessage('Successfully added salary data!');
                    setTimeout(() => {
                        navigate('/salary-list');
                    }, 1500);
                })
                .catch(error => {
                    console.error('Error adding salary data:', error);
                    setErrors({ salaryAmount: 'Failed to add salary data, please try again.' });
                });
        }
    };

    return (

            <div className="content">


            <div className="header">
                <h1>Add Salary Data</h1>
                <div className="back-icon" onClick={() => navigate('/employee-list')}>
                    <FaArrowLeft />
                </div>

            </div>
                <form className="add-salary-form" onSubmit={handleSubmit}>
                    <label>Salary Amount</label>
                    <input
                        type="text"
                        value={salaryAmount}
                        onChange={(e) => setSalaryAmount(e.target.value)}
                    />
                    {errors.salaryAmount && <span className="error-message">{errors.salaryAmount}</span>}

                    <label>Salary Issue Date</label>
                    <input
                        type="date"
                        value={salaryIssueDate}
                        onChange={(e) => setSalaryIssueDate(e.target.value)}
                    />
                    {errors.salaryIssueDate && <span className="error-message">{errors.salaryIssueDate}</span>}

                    <button type="submit" className="submit-button">Add Salary</button>
                </form>
                {successMessage && <div className="success-message">{successMessage}</div>}
            </div>
    );
};

export default AddSalaryData;
