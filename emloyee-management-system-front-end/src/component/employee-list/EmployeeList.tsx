import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEllipsisH, FaEdit, FaTrash, FaPlus, FaSearch, FaMoneyBill, FaSignOutAlt, FaTimes, FaAngleLeft, FaAngleRight } from 'react-icons/fa';
import './EmployeeList.scss';

interface Employee {
    id: string;
    name: string;
    phone: string;
    email: string;
}

const EmployeeList: React.FC = () => {
    const [employees, setEmployees] = useState<Employee[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [employeeToDelete, setEmployeeToDelete] = useState<string | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await axios.get(`${apiUrl}/employees/`);
                setEmployees(response.data);
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, [apiUrl]);

    const handleDelete = async () => {
        if (employeeToDelete) {
            try {
                await axios.delete(`${apiUrl}/employees/${employeeToDelete}`);
                setEmployees((prevEmployees) => prevEmployees.filter(employee => employee.id !== employeeToDelete));
                setConfirmationMessage('Employee deleted successfully!');
                setTimeout(() => setConfirmationMessage(''), 1500);
                setIsModalOpen(false);
                setEmployeeToDelete(null);
            } catch (error) {
                console.error('Error deleting employee:', error);
            }
        }
    };

    const handleLogoutConfirm = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        setIsLogoutModalOpen(false);
        navigate('/');
    };

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;

    const filteredEmployees = employees.filter(({ name, phone, email }) =>
        [name, phone, email].some(field => field.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    const currentEmployees = filteredEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
    const totalPages = Math.ceil(filteredEmployees.length / employeesPerPage);

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setCurrentPage(1);
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
                        <Link to="/add" className="add-employee-menu-item">
                            <FaPlus className="sidebar-icon" /> Add Employee
                        </Link>
                        <Link to="/salary-list" className="salary-list-menu-item">
                            <FaMoneyBill className="sidebar-icon" /> Salary List
                        </Link>
                    </div>
                )}
            </div>

            <div className="main-content">
                <div className="navbar">
                    <h1>Employee List</h1>
                    <div className="controls">
                        <div className="search-container">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by name, number or email"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="search-bar"
                            />
                        </div>
                        <div className="logout-container" onClick={handleLogoutConfirm}>
                            <FaSignOutAlt className="logout-icon" />
                        </div>
                    </div>
                </div>

                {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>}

                <table className="employee-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentEmployees.map((employee, index) => (
                            <tr key={employee.id}>
                                <td>{index + 1 + (currentPage - 1) * employeesPerPage}</td>
                                <td>{employee.name}</td>
                                <td>{employee.phone}</td>
                                <td>{employee.email}</td>
                                <td className="actions">
                                    <Link to={`/edit/${employee.id}`} className="edit-icon">
                                        <FaEdit />
                                    </Link>
                                    <FaTrash
                                        className="delete-icon"
                                        onClick={() => {
                                            setEmployeeToDelete(employee.id);
                                            setIsModalOpen(true);
                                        }}
                                    />
                                    <FaMoneyBill
                                        className="salary-icon"
                                        onClick={() => navigate(`/add-salary/${employee.id}`)}
                                    />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="pagination-container">
                    <div className="pagination">
                        <button className="pagination-icon" onClick={handlePreviousPage} disabled={currentPage === 1}>
                            <FaAngleLeft />
                        </button>
                        <span className="pagination-info">Page {currentPage} of {totalPages}</span>
                        <button className="pagination-icon" onClick={handleNextPage} disabled={currentPage === totalPages}>
                            <FaAngleRight />
                        </button>
                    </div>
                </div>

                {isModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Confirm Deletion</h2>
                            <p>Are you sure you want to delete this employee?</p>
                            <div className="modal-actions">
                                <button onClick={handleDelete}>Yes, Delete</button>
                                <button onClick={() => setIsModalOpen(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}

                {isLogoutModalOpen && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>Confirm Logout</h2>
                            <p>Are you sure you want to log out?</p>
                            <div className="modal-actions">
                                <button onClick={confirmLogout}>Yes, Logout</button>
                                <button onClick={() => setIsLogoutModalOpen(false)}>Cancel</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EmployeeList;
