import React, { useState, useEffect } from 'react';

const EmployeeUpdate = ({ selectedEmployee, updateEmployee }) => {
    const [formData, setFormData] = useState({
        f_Image: '', 
        f_Name: '',
        f_Email: '',
        f_Mobile: '',
        f_Designation: '',
        f_Gender: '',
        f_Course: [],
    });

    useEffect(() => {
        if (selectedEmployee) {
            setFormData({
                f_Image: selectedEmployee.image || '', 
                f_Name: selectedEmployee.name,
                f_Email: selectedEmployee.email,
                f_Mobile: selectedEmployee.mobile,
                f_Designation: selectedEmployee.designation,
                f_Gender: selectedEmployee.gender,
                f_Course: selectedEmployee.courses.split(', '), 
            })
        }
    }, [selectedEmployee]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (checked) {
                setFormData((prevData) => ({
                    ...prevData,
                    f_Course: [...prevData.f_Course, value],
                }));
            } else {
                setFormData((prevData) => ({
                    ...prevData,
                    f_Course: prevData.f_Course.filter((course) => course !== value),
                }));
            }
        } else if (type === 'radio') {
            setFormData({ ...formData, [name]: value });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedEmployee = {
            f_Image: formData.f_Image,
            f_Name: formData.f_Name,
            f_Email: formData.f_Email,
            f_Mobile: formData.f_Mobile,
            f_Designation: formData.f_Designation,
            f_Gender: formData.f_Gender,
            f_Course: formData.f_Course.join(', '),
        };

        try {
            const response = await fetch(`http://localhost:3000/api/v1/editEmployee/${selectedEmployee.f_Id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedEmployee),
            });

            if (!response.ok) {
                throw new Error('Failed to update employee');
            }

            const result = await response.json();
            alert(result.message);
            updateEmployee(result.employee);
        } catch (error) {
            console.error('Error updating employee:', error);
            alert('Failed to update employee');
        }
    };

    if (!selectedEmployee) return <div>No employee selected for update.</div>;

    return (
        <div className="employee-update-container">
            <h3>Update Employee</h3>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Name:</label>
                    <input type="text" name="f_Name" value={formData.f_Name} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Email:</label>
                    <input type="email" name="f_Email" value={formData.f_Email} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Mobile No:</label>
                    <input type="text" name="f_Mobile" value={formData.f_Mobile} onChange={handleChange} />
                </div>

                <div className="form-group">
                    <label>Designation:</label>
                    <select name="f_Designation" value={formData.f_Designation} onChange={handleChange}>
                        <option value="">Select</option>
                        <option value="HR">HR</option>
                        <option value="Manager">Manager</option>
                        <option value="Sales">Sales</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Gender:</label>
                    <label><input type="radio" name="f_Gender" value="Male" checked={formData.f_Gender === 'Male'} onChange={handleChange} /> Male</label>
                    <label><input type="radio" name="f_Gender" value="Female" checked={formData.f_Gender === 'Female'} onChange={handleChange} /> Female</label>
                </div>

                <div className="form-group">
                    <label>Courses:</label>
                    <label><input type="checkbox" name="courses" value="MCA" checked={formData.f_Course.includes('MCA')} onChange={handleChange} /> MCA</label>
                    <label><input type="checkbox" name="courses" value="BCA" checked={formData.f_Course.includes('BCA')} onChange={handleChange} /> BCA</label>
                    <label><input type="checkbox" name="courses" value="BSC" checked={formData.f_Course.includes('BSC')} onChange={handleChange} /> BSC</label>
                </div>

                <div className="form-group">
                    <button type="submit">Update</button>
                </div>
            </form>
        </div>
    );
};

export default EmployeeUpdate;
