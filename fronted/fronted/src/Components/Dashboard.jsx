import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './EmployeeCreation.css';

const EmployeeCreation = () => {
    const [formData, setFormData] = useState({
        f_Image: null,
        f_Name: '',
        f_Email: '',
        f_Mobile: '',
        f_Designation: '',
        f_Gender: '',
        f_Course: [],
    });

    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === 'checkbox') {
            setFormData((prev) => {
                const courses = checked
                    ? [...prev.f_Course, value]
                    : prev.f_Course.filter((course) => course !== value);
                return { ...prev, f_Course: courses };
            });
        } else if (type === 'file') {
            setFormData({ ...formData, f_Image: e.target.files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.f_Name) newErrors.f_Name = 'Name is required';
        if (!formData.f_Email) newErrors.f_Email = 'Email is required';
        if (!formData.f_Mobile) newErrors.f_Mobile = 'Mobile number is required';
        if (!formData.f_Designation) newErrors.f_Designation = 'Designation is required';
        if (!formData.f_Gender) newErrors.f_Gender = 'Gender is required';
        if (!formData.f_Course.length) newErrors.f_Course = 'Please select at least one course';
        if (!formData.f_Image) newErrors.f_Image = 'Image is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            const formDataToSend = new FormData();
            for (const key in formData) {
                formDataToSend.append(key, formData[key]);
            }

            try {
                const response = await fetch('/api/createEmployee', {
                    method: 'POST',
                    body: formDataToSend,
                });
                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                    navigate('/employee-list');
                } else {
                    setErrors({ ...errors, submit: data.message });
                }
            } catch (error) {
                console.error('Error creating employee:', error);
            }
        }
    };

    return (
        <div className="employee-creation-container">
            <h2>Create Employee</h2>
            <form onSubmit={handleSubmit}>
            </form>
        </div>
    );
};

export default EmployeeCreation;
