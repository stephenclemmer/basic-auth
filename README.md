# LAB - Class 06: Basic Auth

Author: Stephen Clemmer paired with Brandon Pitts

### Links and Resources

back-end server url: TBD

PORT - 3001

**Problem Domain**
Authentication System Phase 1: Deploy an Express server that implements Basic Authentication, with signup and signin capabilities, using a Postgres database for storage.

**UML**
![Lab 6 UML](./assets/Lab%2006%20Basic%20Auth%20UML.png)

**Tests**
TBD

**File Structure**
├── .gitignore
├── .eslintrc.json
├── __tests__
│   ├── auth.router.test.js
│   ├── basic-auth.test.js
│   ├── 500.test.js
├── src
│   ├── auth
│   │   ├── router.js
│   │   ├── middleware
│   │   │   ├── basic.js
│   │   ├── models
│   │   │   ├── users-model.js
│   ├── error-handlers
│   │   ├── 404.js
│   │   ├── 500.js
│   ├── server.js
├── index.js
└── package.json

### Features

- Users can create a new account using an HTTP REST client
- Make a POST request to the/signup route with username and password
- Your server supports JSON
- On a successful account creation, return a 201 status with the user object in the body
- On any error, trigger your error handler with an appropriate error

- Users can log into their account to access protected information using am HTTP REST client
- Make a POST request to the /signin route
- Send a basic authentication header with a properly encoded username and password combination
- On a successful account login, return a 200 status with the user object in the body
- On any error, trigger your error handler with the message “Invalid Login”

### Basic Server

- Extract the core server logic into 2 files:
- index.js (entry point)
- Connect to the database
- Require the ‘server’ and start it
- server.js service wiring
- Exports an express app/server and a start method

### Authentication Modules

Keep your authentication related files in a folder called /auth so they are independent of the server itself.

- Extract the authentication logic for /signin as middleware.
- Create a new node module.
- Interact with the headers and the users model.
- Add the user record (if valid) to the request object and call next().
- Call next() with an error in the event of a bad login.
- Extract the Sequelize Model into a separate module.
- Model the user data.
- Add a before-create hook in the model … Before we save a record:
- Hash the plain text password given before you save a user to the database.
- Create a method in the schema to authenticate a user using the hashed password.
- Create a module to house all of routes for the authentication system.
- Create a POST route for /signup
- Accepts either a JSON object or FORM Data with the keys “username” and “password”.
- Creates a new user record in a Postgres database.
- Returns a 201 with the created user record.
- Create a POST route for /signin.
- Use your basic authentication middleware to perform the actual login task.
- router.post('/signin', basicAuth, (req,res) => {});
- When validated, send a JSON object as the response with the following properties: user: The users’ database record

### Routes

- Make a POST request to the signup route with username and password
- Make a POST request to the signin route with username and password
