import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeCreation.css';

const EmployeeCreation = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        designation: '',
        gender: '',
        courses: [],
        image: null,
    });

    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            if (checked) {
                setFormData({ ...formData, courses: [...formData.courses, value] });
            } else {
                setFormData({ ...formData, courses: formData.courses.filter(course => course !== value) });
            }
        } else if (type === 'file') {
            setFormData({ ...formData, [name]: e.target.files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = 'Name is required';
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.mobile) {
            newErrors.mobile = 'Mobile number is required';
        } else if (!/^\d{10}$/.test(formData.mobile)) {
            newErrors.mobile = 'Mobile number should be 10 digits';
        }
        if (!formData.designation) newErrors.designation = 'Designation is required';
        if (!formData.gender) newErrors.gender = 'Gender is required';
        if (!formData.courses.length) newErrors.courses = 'Please select at least one course';
        if (!formData.image) newErrors.image = 'Image is required';
        else if (!['image/jpeg', 'image/png'].includes(formData.image.type)) {
            newErrors.image = 'Only jpg/png files are allowed';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const formDataToSend = new FormData();
            formDataToSend.append('f_Name', formData.name);
            formDataToSend.append('f_Email', formData.email);
            formDataToSend.append('f_Mobile', formData.mobile);
            formDataToSend.append('f_Designation', formData.designation);
            formDataToSend.append('f_Gender', formData.gender);
            formDataToSend.append('f_Course', formData.courses.join(', '));
            formDataToSend.append('f_Image', formData.image);

            try {
                const response = await fetch('/api/createEmployee', {
                    method: 'POST',
                    body: formDataToSend,
                });

                if (response.ok) {
                    const result = await response.json();
                    alert('Employee created successfully!')
                    setFormData({
                        name: '',
                        email: '',
                        mobile: '',
                        designation: '',
                        gender: '',
                        courses: [],
                        image: null,
                    });
                    navigate('/');
                } else {
                    const errorData = await response.json();
                    alert(errorData.message || 'Failed to create employee');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('An error occurred while creating the employee');
            }
        }
    };

    return (
        <div className="employee-creation-container">
            <div>
                <h2>Create Employee</h2>
            </div>

            <div className="form-container">
                <h3>Employee Creation Form</h3>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Name:</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} />
                        {errors.name && <span className="error">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label>Email:</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                        {errors.email && <span className="error">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label>Mobile No:</label>
                        <input type="text" name="mobile" value={formData.mobile} onChange={handleChange} />
                        {errors.mobile && <span className="error">{errors.mobile}</span>}
                    </div>

                    <div className="form-group">
                        <label>Designation:</label>
                        <select name="designation" value={formData.designation} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="HR">HR</option>
                            <option value="Manager">Manager</option>
                            <option value="Sales">Sales</option>
                        </select>
                        {errors.designation && <span className="error">{errors.designation}</span>}
                    </div>

                    <div className="form-group">
                        <label>Gender:</label>
                        <label><input type="radio" name="gender" value="Male" onChange={handleChange} /> Male</label>
                        <label><input type="radio" name="gender" value="Female" onChange={handleChange} /> Female</label>
                        {errors.gender && <span className="error">{errors.gender}</span>}
                    </div>

                    <div className="form-group">
                        <label>Courses:</label>
                        <label><input type="checkbox" name="courses" value="MCA" onChange={handleChange} /> MCA</label>
                        <label><input type="checkbox" name="courses" value="BCA" onChange={handleChange} /> BCA</label>
                        <label><input type="checkbox" name="courses" value="BSC" onChange={handleChange} /> BSC</label>
                        {errors.courses && <span className="error">{errors.courses}</span>}
                    </div>

                    <div className="form-group">
                        <label>Image Upload:</label>
                        <input type="file" name="image" accept=".jpg,.jpeg,.png" onChange={handleChange} />
                        {errors.image && <span className="error">{errors.image}</span>}
                    </div>

                    <div className="form-group">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EmployeeCreation;
