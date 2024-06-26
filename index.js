const { app } = require("./app");
const { io } = require("./app");
const errorHandler = require("./middlewares/errorHandler");
const multer = require("multer");
const port = process.env.PORT || 5000;

const userRoutes = require('./routes/v1/user.route')
const dmeRoutes = require('./routes/v1/dme.route');
const EquipmentOrderRoutes = require('./routes/v1/equipmentOrder.route');
const VeteranOrderRoutes = require('./routes/v1/veteranOrder.route');
const RepairOrderRoutes = require('./routes/v1/repairOrder.route');
const patientRouter = require('./routes/v1/patient.route');
const doctorRouter = require('./routes/v1/doctor.route');
const therapistRouter = require('./routes/v1/therapist.route');
const dmeStaffRouter = require('./routes/v1/dmeStaff.route');
const vaStaffRouter = require('./routes/v1/vaProsthetics.route');
const veteranRouter = require('./routes/v1/veteran.route');
const privateMessageRouter = require('./routes/v1/privateMessage.route');





//routes
app.use('/api/v1/users', userRoutes) //  user route 
app.use('/api/v1/dme', dmeRoutes) //  dme route 

app.use('/api/v1/order', EquipmentOrderRoutes) // Equipment order route 
app.use('/api/v1/veteran-order', VeteranOrderRoutes) // Equipment order route 
app.use('/api/v1/repair-order', RepairOrderRoutes) // Equipment order route 
app.use('/api/v1/patient', patientRouter) //  patient route 
app.use('/api/v1/doctor', doctorRouter) //  doctor route 
app.use('/api/v1/therapist', therapistRouter) //  therapist route 
app.use('/api/v1/dme-staff', dmeStaffRouter) //  staff route 
app.use('/api/v1/va-staff', vaStaffRouter) //  va-staff route 
app.use('/api/v1/veteran', veteranRouter) //  veteran route 
app.use('/api/v1/private-message', privateMessageRouter) //  private-message route 

app.all("*", (req, res) => {
    res.status(404).send({ success: "false", message: "No API end point found" });
});

app.listen(port, () => {
    console.log("Express is listening in port", port);
})

//handling global errors
app.use(errorHandler)



//can handel "unhandledRejection" bellow like this.
process.on("unhandledRejection", (error) => {
    console.log("unhandledRejection".inverse.red, error.name, error.message);
});

