const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const bookRouter = require('/router/bookdb');

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use('/api', bookRouter);
app.use("/customer/auth", (req, res, next) => {
    // Extract username and password from request (you need to define how these are sent)
    const { username, password } = req.body;
  
    if (authenticatedUser(username, password)) {
      // Generate JWT access token
      let accessToken = jwt.sign(
        { data: username },
        'access', 
        { expiresIn: 60 * 60 }
      );

        // Store access token and username in session
        req.session.authorization = {
            accessToken, 
            username
          };
      
          return res.status(200).json({ message: "User authenticated", accessToken });
        } else {
          return res.status(401).json({ message: "Invalid username or password" });
        }
      });


const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));
