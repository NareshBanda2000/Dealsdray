import React, { useState } from 'react';
import EmployeeList from './EmployeeList';
import EmployeeUpdate from './EmployeeUpdate';

const EmployeeManagement = () => {
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    return (
        <div>
            {selectedEmployee ? (
                <EmployeeUpdate selectedEmployee={selectedEmployee} updateEmployee={setSelectedEmployee} />
            ) : (
                <EmployeeList setSelectedEmployee={setSelectedEmployee} />
            )}
        </div>
    );
};

export default EmployeeMnagement;

