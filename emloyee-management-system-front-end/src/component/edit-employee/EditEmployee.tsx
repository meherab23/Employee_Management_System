import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { FaArrowLeft } from 'react-icons/fa';
import './EditEmployee.scss';

const Editemployee: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
    const [successMessage, setSuccessMessage] = useState('');
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const apiUrl = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        axios.get(`${apiUrl}/employees/${id}`)
            .then(response => {
                setName(response.data.name);
                setPhone(response.data.phone);
                setEmail(response.data.email);
            })
            .catch(error => {
                console.error('Error fetching employee:', error);
            });
    }, [id, apiUrl]);

    const validate = () => {
        const newErrors: { name?: string; phone?: string; email?: string } = {};

        if (!name) {
            newErrors.name = 'Name is required.';
        }
        if (!phone) {
            newErrors.phone = 'Phone number is required.';
        } else if (!/^\d{11}$/.test(phone)) {
            newErrors.phone = 'Phone number must be 11 digits.';
        }
        if (!email) {
            newErrors.email = 'Email is required.';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            axios.put(`${apiUrl}/employees/${id}`, { name, phone, email })
                .then(() => {
                    setSuccessMessage('employee successfully updated!'); 
                    setTimeout(() => {
                        navigate('/employee-list'); 
                    }, 1500);
                })
                .catch(error => {
                    console.error('Error updating employee:', error);
                });
        }
    };

    return (
        <div className="content">

        <div className="header">
            <h1>Edit Employee</h1>
            <div className="back-icon" onClick={() => navigate('/salary-list')}>
                <FaArrowLeft />
            </div>
        </div>
                <form className="add-employee-form" onSubmit={handleSubmit}>
                    {successMessage && <div className="success-message">{successMessage}</div>}

                    <label>Name</label>
                    <input 
                        type="text" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        required 
                    />
                    {errors.name && <span className="error-message">{errors.name}</span>}

                    <label>Phone Number</label>
                    <input 
                        type="tel"
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        required 
                    />
                    {errors.phone && <span className="error-message">{errors.phone}</span>}

                    <label>Email</label>
                    <input 
                        type="email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}

                    <button type="submit" className="submit-button">Update employee</button>
                </form>
            </div>
    );
};

export default Editemployee;
