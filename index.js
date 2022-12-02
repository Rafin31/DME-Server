const app = require("./app");
const errorHandler = require("./middlewares/errorHandler");
const port = process.env.PORT || 5000;


const userRoutes = require('./routes/v1/user.route')

//routes
app.use('/api/v1/users', userRoutes) //  user route 


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

