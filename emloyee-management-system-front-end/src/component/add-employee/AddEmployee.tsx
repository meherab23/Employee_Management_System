import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEllipsisH, FaMoneyBill, FaPlus, FaSignOutAlt, FaTimes, FaUser } from 'react-icons/fa';
import './AddEmployee.scss';

const AddEmployee: React.FC = () => {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string }>({});
    const [successMessage, setSuccessMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
    const navigate = useNavigate();

    const validate = () => {
        const newErrors: { name?: string; phone?: string; email?: string } = {};
        
        if (!name) newErrors.name = 'Name is required.';
        if (!phone) newErrors.phone = 'Phone number is required.';
        else if (!/^\d{11}$/.test(phone)) newErrors.phone = 'Phone number must be 11 digits.';
        if (!email) newErrors.email = 'Email is required.';
        else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'Email is invalid.';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            axios.post(`${process.env.REACT_APP_API_BASE_URL}/employees/`, { name, phone, email })
                .then(() => {
                    setSuccessMessage('Successfully added employee!');
                    setTimeout(() => {
                        navigate('/employee-list');
                    }, 1500);
                })
                .catch(error => {
                    console.error('Error adding employee:', error);
                    setErrors({ name: 'Failed to add employee, please try again.' });
                });
        }
    };

    const toggleSidebar = () => setIsSidebarOpen(prevState => !prevState);

    const handleLogoutClick = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        setIsLogoutModalOpen(false);
        navigate('/'); 
    };

    const cancelLogout = () => {
        setIsLogoutModalOpen(false);
    };

    return (
        <div className="dashboard-container">
            <div className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
                <div className="toggle-sidebar" onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    {isSidebarOpen ? <FaTimes className="toggle-icon" /> : <FaEllipsisH className="toggle-icon" />}
                </div>
                {isSidebarOpen && (
                    <div className="sidebar-content">
                        <h2>Menu</h2>
                        <Link to="/employee-list" className="employee-list-menu-item">
                            <FaUser className="sidebar-icon" /> Employee List
                        </Link>
                        <Link to="/salary-list" className="salary-list-menu-item">
                            <FaMoneyBill className="sidebar-icon" /> Salary List
                        </Link>
                    </div>
                )}
            </div>

            <div className="header">
                <div className="content">
                    <h1>Add New Employee</h1>
                    <div className="logout-icon" onClick={handleLogoutClick}>
                        <FaSignOutAlt />
                    </div>
                    <form className="add-employee-form" onSubmit={handleSubmit}>
                        <label>Name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                        />
                        {errors.name && <span className="error-message">{errors.name}</span>}

                        <label>Phone Number</label>
                        <input 
                            type="tel"
                            value={phone} 
                            onChange={(e) => setPhone(e.target.value)}
                        />
                        {errors.phone && <span className="error-message">{errors.phone}</span>}

                        <label>Email</label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}

                        <button type="submit" className="submit-button">Add Employee</button>
                    </form>
                    {successMessage && <div className="success-message">{successMessage}</div>}
                </div>
            </div>

            {isLogoutModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h2>Confirm Logout</h2>
                        <p>Are you sure you want to log out?</p>
                        <div className="modal-actions">
                            <button onClick={confirmLogout}>Yes, Logout</button>
                            <button onClick={cancelLogout}>No</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AddEmployee;
