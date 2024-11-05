import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaEllipsisH, FaEdit, FaTrash, FaPlus, FaSearch, FaTimes, FaAngleLeft, FaAngleRight, FaSignOutAlt, FaUser } from 'react-icons/fa';
import './SalaryList.scss';

interface Salary {
    [x: string]: string | number | Date;
    id: string;
    employeeId: string;
    salaryAmount: number;
    issueDate: string;
}

const SalaryList: React.FC = () => {
    const [salaries, setSalaries] = useState<Salary[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [salariesPerPage] = useState(5);
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [salaryToDelete, setSalaryToDelete] = useState<string | null>(null);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); 
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const apiUrl = process.env.REACT_APP_API_BASE_URL;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSalaries = async () => {
            try {
                const response = await axios.get(`${apiUrl}/salaries/`);
                setSalaries(response.data);
            } catch (error) {
                console.error('Error fetching salaries:', error);
            }
        };

        fetchSalaries();
    }, [apiUrl]);

    const handleDelete = async () => {
        if (salaryToDelete) {
            try {
                await axios.delete(`${apiUrl}/salaries/${salaryToDelete}`);
                setSalaries((prevSalaries) => prevSalaries.filter(salary => salary.id !== salaryToDelete));
                setConfirmationMessage('Salary record deleted successfully!');
                setTimeout(() => setConfirmationMessage(''), 1500);
                setIsModalOpen(false);
                setSalaryToDelete(null);
            } catch (error) {
                console.error('Error deleting salary record:', error);
            }
        }
    };

    const indexOfLastSalary = currentPage * salariesPerPage;
    const indexOfFirstSalary = indexOfLastSalary - salariesPerPage;

    const filteredSalaries = salaries.filter(({ employeeId }) =>
        employeeId.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const currentSalaries = filteredSalaries.slice(indexOfFirstSalary, indexOfLastSalary);
    const totalPages = Math.ceil(filteredSalaries.length / salariesPerPage);

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

    const openLogoutModal = () => {
        setIsLogoutModalOpen(true);
    };

    const confirmLogout = () => {
        setIsLogoutModalOpen(false);
        navigate('/');
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
                        <Link to="/employee-list" className="employee-list-menu-item">
                            <FaUser className="sidebar-icon" /> Employee List
                        </Link>
                    </div>
                )}
            </div>

            <div className="main-content">
                <div className="navbar">
                    <h1>Salary List</h1>
                    <div className="controls">
                        <div className="search-container">
                            <FaSearch className="search-icon" />
                            <input
                                type="text"
                                placeholder="Search by employee ID"
                                value={searchTerm}
                                onChange={handleSearchChange}
                                className="search-bar"
                            />
                        </div>
                        <div className="logout-container" onClick={openLogoutModal}>
                            <FaSignOutAlt className="logout-icon" />
                        </div>
                    </div>
                </div>

                {confirmationMessage && <div className="confirmation-message">{confirmationMessage}</div>}

                <table className="salary-table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Employee ID</th>
                            <th>Salary Amount</th>
                            <th>Issue Date</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentSalaries.map((salary, index) => (
                            <tr key={salary.id}>
                                <td>{index + 1 + (currentPage - 1) * salariesPerPage}</td>
                                <td>{salary.employeeId}</td>
                                <td>{salary.salaryAmount}</td>
                                <td>{new Date(salary.salaryIssueDate).toLocaleDateString()}</td>
                                <td className="actions">
                                    <Link to={`/edit-salary/${salary.employeeId}`} className="edit-icon">
                                        <FaEdit />
                                    </Link>
                                    <FaTrash
                                        className="delete-icon"
                                        onClick={() => {
                                            setSalaryToDelete(salary.id);
                                            setIsModalOpen(true);
                                        }}
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
                            <p>Are you sure you want to delete this salary record?</p>
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
                                <button onClick={() => setIsLogoutModalOpen(false)}>No</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalaryList;
