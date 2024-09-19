const express = require("express")
const router = express.Router();
const adminJwtAuthenticateMiddleware = require("../middlewares/adminMiddleWare")
const jwt = require("jsonwebtoken");
const JWT_SECRET = require("../config")

const { Login,Employee} = require("../db");

router.post("/signin", async function (req, res, next) {
    const { username, password } = req.body;
    console.log("xxx");
    console.log(req.body);
    
    try {
        
        const obj = await Login.findOne({ username, password });

        if (!obj) {
            console.log(obj);            
            return res.status(401).json({ message: 'Invalid username or password' });
        }

        console.log(obj);
        
    
        const token = jwt.sign(
            { role: obj.role, userId: obj._id, username: obj.username }, 
            JWT_SECRET
        );


        res.status(200).json({ token,message:"Login Successful" });
    } catch (error) {
        console.log(error);
        res.status(500).send('Server error');
    }
});



router.post("/createEmployee", async function (req, res, next) {
    const {
        f_Image, 
        f_Name, 
        f_Email, 
        f_Mobile, 
        f_Designation, 
        f_Gender, 
        f_Course
    } = req.body;

    try {
        
        if (!f_Name || !f_Email || !f_Mobile || !f_Designation || !f_Gender || !f_Course) {
            return res.status(400).json({ message: 'All required fields must be provided' });
        }

        const newEmployee = new Employee({
            f_Image, 
            f_Name, 
            f_Email, 
            f_Mobile, 
            f_Designation, 
            f_Gender, 
            f_Course
        });

        
        await newEmployee.save();
        res.status(201).json({ message: 'Employee created successfully', employee: newEmployee });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.get("/getAllEmployees",adminJwtAuthenticateMiddleware, async (req, res) => {
    try {
        const employees = await Employee.find();

        res.status(200).json({
            message: 'Employees retrieved successfully',
            employees
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});

router.put("/editEmployee/:f_Id",adminJwtAuthenticateMiddleware, async (req, res) => {
    const { f_Id } = req.params; 
    const {
        
        f_Image, 
        f_Name, 
        f_Email, 
        f_Mobile, 
        f_Designation, 
        f_Gender, 
        f_Course
    } = req.body; 

    try {

        const updatedEmployee = await Employee.findOneAndUpdate(
            { f_Id }, 
            {
                f_Image, 
                f_Name, 
                f_Email, 
                f_Mobile, 
                f_Designation, 
                f_Gender, 
                f_Course
            },
            { new: true } 
        );

        
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        
        res.status(200).json({
            message: 'Employee updated successfully',
            employee: updatedEmployee
        });
    } catch (error) {
    
        console.error(error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});
 
router.get("/getEmployeeById/:f_Id", adminJwtAuthenticateMiddleware, async (req, res) => {
    const { f_Id } = req.params; 

    try {
      
        const employee = await Employee.findOne({ f_Id });

        
        if (!employee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        
        res.status(200).json({ employee });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});

router.delete("/deleteEmployeeById/:f_Id", adminJwtAuthenticateMiddleware, async (req, res) => {
    const { f_Id } = req.params;
    try {
        const deletedEmployee = await Employee.findOneAndDelete({ f_Id });

        
        if (!deletedEmployee) {
            return res.status(404).json({ message:'Employee not found' });
        }

        
        res.status(200).json({ message: 'Employee deleted successfully', employee: deletedEmployee });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Server error',
            error: error.message
        });
    }
});


module.exports = router;


