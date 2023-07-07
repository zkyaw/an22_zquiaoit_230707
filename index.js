// Load express for our backend
const express = require('express')
const mongoose = require('mongoose')
// Allows us to control the app's Cross Origin Resource Sharing
const cors = require('cors')

const userRoutes = require('./routes/userRoutes')

const app = express();
// We create an app variable that stores results of the express fucntion that initializes our express application and allows us to access different methods that will make backend creation easy

mongoose.connect('mongodb+srv://admin:admin123@sandbox.yik8rjs.mongodb.net/expo02?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas'));

// Allows all resources to access  our backend application
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// Define the /users string to be included for all users routes defined in the 'user' route file
app.use('/user', userRoutes);

app.listen(process.env.PORT || 4000, () => {
  console.log(`API is now online on port ${process.env.PORT || 4000}`)
})