const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://nareshbanda2000:gqME1qPdTGbkUvTH@cluster0.fbpp6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
);
const AutoIncrement = require('mongoose-sequence')(mongoose);
const loginSchema = new mongoose.Schema({
  f_userName: { 
    type: String,
  },
  f_Pwd: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    required: true, 
    enum: ['admin'],
  },
});



const employeeSchema = new mongoose.Schema({
  f_Id: { 
    type: Number, 
    unique: true 
  },
  f_Image: { 
    type: String, 
    required: false
  },
  f_Name: { 
    type: String, 
    required: true 
  },
  f_Email: { 
    type: String, 
    required: true, 
    unique: true,
  },
  f_Mobile: { 
    type: String, 
    required: true, 
  },
  f_Designation: { 
    type: String, 
    enum: ['HR', 'Manager', 'Sales'], 
    required: true 
  },
  f_Gender: { 
    type: String, 
    enum: ['Male', 'Female'], 
    required: true 
  },
  f_Course: { 
    type: [String], 
    enum: ['MCA', 'BCA', 'BSC'], 
    required: true 
  },
  f_Createdate: { 
    type: Date, 
    default: Date.now 
  }
});
employeeSchema.plugin(AutoIncrement, { inc_field: 'f_Id' });
const Employee = mongoose.model('Employee', employeeSchema);
const Login = mongoose.model('Login', loginSchema);
module.exports = { Login, Employee };