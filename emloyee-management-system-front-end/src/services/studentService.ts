import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

interface employee {
    _id?: string; 
    name: string;
    age: number;
    phoneNumber: string;
    email: string;
}

const getemployees = async (): Promise<employee[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/employees`);
        return response.data; 
    } catch (error) {
        console.error('Error fetching employees:', error);
        throw new Error('Failed to fetch employees'); 
    }
};

const getemployeeById = async (employeeId: string): Promise<employee> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/employees/${employeeId}`);
        return response.data; 
    } catch (error) {
        console.error(`Error fetching employee with ID: ${employeeId}`, error);
        throw new Error('Failed to fetch employee'); 
    }
};

const addemployee = async (employee: employee): Promise<employee> => {
    try {
        const response = await axios.post(`${API_BASE_URL}/employees`, employee);
        return response.data; 
    } catch (error) {
        console.error('Error adding employee:', error);
        throw new Error('Failed to add employee'); 
    }
};

const updateemployee = async (employeeId: string, employee: employee): Promise<employee> => {
    try {
        const response = await axios.put(`${API_BASE_URL}/employees/${employeeId}`, employee);
        return response.data; 
    } catch (error) {
        console.error(`Error updating employee with ID: ${employeeId}`, error);
        throw new Error('Failed to update employee'); 
    }
};

const deleteemployee = async (employeeId: string): Promise<void> => {
    try {
        await axios.delete(`${API_BASE_URL}/employees/${employeeId}`); 
    } catch (error) {
        console.error(`Error deleting employee with ID: ${employeeId}`, error);
        throw new Error('Failed to delete employee');
    }
};

export default {
    getemployees,
    getemployeeById,
    addemployee,
    updateemployee,
    deleteemployee,
};
