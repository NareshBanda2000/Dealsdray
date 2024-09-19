import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import EmployeeManagement from './Components/EmployeeManagement';
import EmployeeList from './Components/EmployeeList';
import Dashboard from './Components/Dashboard';
import EmployeeCreation from './Components/EmployeeCreation';
import Login from './Components/Login';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/employee-management" element={<EmployeeManagement />} />
                <Route path="/employee-list" element={<EmployeeList />} />
                <Route path="/employee-creation" element={<EmployeeCreation />} />
            </Routes>
        </Router>
    );
};

export default App;
