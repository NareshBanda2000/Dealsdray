import React, { useState, useEffect } from 'react';
import './EmployeeList.css';

const EmployeeList = ({ setSelectedEmployee }) => {
    const [employees, setEmployees] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [employeesPerPage] = useState(5);
    const [sortOrder, setSortOrder] = useState({ column: '', order: 'asc' });

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/v1/getAllEmployees', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });
                const data = await response.json();
                if (response.ok) {
                    setEmployees(data.employees);
                } else {
                    console.error(data.message);
                }
            } catch (error) {
                console.error('Error fetching employees:', error);
            }
        };

        fetchEmployees();
    }, []);

    const deleteEmployee = async (id) => {
        try {
            const response = await fetch(`http://localhost:3000/api/v1/deleteEmployeeById/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`, 
                },
            });
            const data = await response.json();
            if (response.ok) {
                setEmployees((prevEmployees) => prevEmployees.filter((employee) => employee.f_Id !== id));
                alert(data.message);
            } else {
                console.error(data.message);
            }
        } catch (error) {
            console.error('Error deleting employee:', error);
        }
    };


    const filteredEmployees = employees.filter(employee =>
        employee.f_Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.f_Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.f_Mobile.includes(searchTerm)
    );

    
    const sortedEmployees = filteredEmployees.sort((a, b) => {
        if (sortOrder.column === '') return 0;
        const aValue = a[sortOrder.column];
        const bValue = b[sortOrder.column];
        if (aValue < bValue) return sortOrder.order === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortOrder.order === 'asc' ? 1 : -1;
        return 0;
    });

    const indexOfLastEmployee = currentPage * employeesPerPage;
    const indexOfFirstEmployee = indexOfLastEmployee - employeesPerPage;
    const currentEmployees = sortedEmployees.slice(indexOfFirstEmployee, indexOfLastEmployee);
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    
    const handleSort = (column) => {
        const order = sortOrder.column === column && sortOrder.order === 'asc' ? 'desc' : 'asc';
        setSortOrder({ column, order });
    };

    return (
        <div className="employee-list-container">
            <h3>Employee List</h3>

            <div className="search-bar">
                <label>Search: </label>
                <input
                    type="text"
                    placeholder="Enter search keyword"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <table className="employee-table">
                <thead>
                    <tr style={{ backgroundColor: 'lightblue' }}>
                        <th onClick={() => handleSort('f_Id')}>Unique Id</th>
                        <th>Image</th>
                        <th onClick={() => handleSort('f_Name')}>Name</th>
                        <th onClick={() => handleSort('f_Email')}>Email</th>
                        <th>Mobile No</th>
                        <th>Designation</th>
                        <th>Gender</th>
                        <th>Course</th>
                        <th onClick={() => handleSort('createdAt')}>Create Date</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {currentEmployees.map((employee) => (
                        <tr key={employee.f_Id} style={{ backgroundColor: 'white' }}>
                            <td>{employee.f_Id}</td>
                            <td>
                                <img
                                    src={employee.f_Image} 
                                    alt="Employee"
                                    width="50"
                                    height="50"
                                />
                            </td>
                            <td>{employee.f_Name}</td>
                            <td>{employee.f_Email}</td>
                            <td>{employee.f_Mobile}</td>
                            <td>{employee.f_Designation}</td>
                            <td>{employee.f_Gender}</td>
                            <td>{employee.f_Course.join(', ')}</td>
                            <td>{employee.createdAt}</td>
                            <td>
                                <button onClick={() => setSelectedEmployee(employee)}>Edit</button>
                                <button onClick={() => deleteEmployee(employee.f_Id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                {[...Array(Math.ceil(filteredEmployees.length / employeesPerPage))].map((_, i) => (
                    <button key={i + 1} onClick={() => paginate(i + 1)}>
                        {i + 1}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default EmployeeList;
