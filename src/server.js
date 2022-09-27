'use strict';

require('dotenv').config();
const express = require('express');

const PORT = process.env.PORT || 3002;
const app = express();
app.use(express.json());

const { Sequelize, DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const base64 = require('base-64');

// NOTE: connected to sqlite::memory out of box for proof of life
// TODO:
// connect postgres for local dev environment and prod
// handle SSL requirements
// connect with sqlite::memory for testing
const DATABASE_URL = process.env.NODE_ENV === 'test'
  ? 'sqlite::memory'
  : process.env.DATABASE_URL;

// Prepare the express app


const sequelizeDatabase = new Sequelize(DATABASE_URL);

// Process FORM intput and put the data on req.body
app.use(express.urlencoded({ extended: true }));

// Create a Sequelize model
const Users = sequelizeDatabase.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

// Signup Route -- create a new user
// Two ways to test this route with httpie
// echo '{"username":"john","password":"foo"}' | http post :3000/signup
// http post :3000/signup username=john password=foo
app.post('/signup', async (req, res, next) => {

  try {
    let { username, password } = req.body;
    let encryptedPassword = await bcrypt.hash(password, 5);

    let user = await Users.create({
      username,
      password: encryptedPassword,
    });

    res.status(201).send(user);
  } catch (err) {
    next(console.log('signup error occurred:', err));
  }
});

//     req.body.password = await bcrypt.hash(req.body.password, 5);
//     const record = await Users.create(req.body);
//     res.status(200).json(record);
//   } catch (e) { res.status(403).send('Error Creating User'); }
// });


// Signin Route -- login with username and password
// test with httpie
// http post :3000/signin -a john:foo
app.post('/signin', async (req, res) => {

  /*
    req.headers.authorization is : "Basic sdkjdsljd="
    To get username and password from this, take the following steps:
      - Turn that string into an array by splitting on ' '
      - Pop off the last value
      - Decode that encoded string so it returns to user:pass
      - Split on ':' to turn it into an array
      - Pull username and password from that array
  */

  let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
  let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
  let decodedString = base64.decode(encodedString); // "username:password"
  let [username, password] = decodedString.split(':'); // username, password

  /*
    Now that we finally have username and password, let's see if it's valid
    1. Find the user in the database by username
    2. Compare the plaintext password we now have against the encrypted password in the db
       - bcrypt does this by re-encrypting the plaintext password and comparing THAT
    3. Either we're valid or we throw an error
  */
  try {
    const user = await Users.findOne({ where: { username: username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      res.status(200).json(user);
    }
    else {
      throw new Error('Invalid User');
    }
  } catch (error) { res.status(403).send('Invalid Login'); }

});

// make sure our tables are created, start up the HTTP server.
// sequelizeDatabase.sync()
//   .then(() => {
//     app.listen(3001, () => console.log('server up'));
//   }).catch(e => {
//     console.error('Could not start server', e.message);
//   });

function start() {
  app.listen(PORT, () => console.log(`listening on port ${PORT}`));
}

module.exports = { app, start, sequelizeDatabase };
