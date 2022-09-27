'use strict';

const express = require('express');
const router = express.Router();
const { UsersModel } = require('./models/index');
const basicAuth = require('./middleware/basic');
// const validator = require('../middleware/validator');

const bcrypt = require('bcrypt');
const base64 = require('base-64');


router.use(express.urlencoded({ extended: true }));
router.use(express.json());

// Signup Route
router.post('/signup', async (req, res, next) => {

  try {
    let { username, password } = req.body;
    let encryptedPassword = await bcrypt.hash(password, 5);

    let user = await UsersModel.create({
      username,
      password: encryptedPassword,
    });

    res.status(201).send(user);
  } catch (err) {
    next(console.log('signup error occurred:', err));
  }
});


// Signin Route
router.post('/signin', basicAuth, async (req, res) => {
  res.status(200).send(req.user);

  let basicHeaderParts = req.headers.authorization.split(' ');  // ['Basic', 'sdkjdsljd=']
  let encodedString = basicHeaderParts.pop();  // sdkjdsljd=
  let decodedString = base64.decode(encodedString); // "username:password"
  let [username, password] = decodedString.split(':'); // username, password

  try {
    const user = await UsersModel.findOne({ where: { username: username } });
    const valid = await bcrypt.compare(password, user.password);
    if (valid) {
      res.status(200).json(user);
    }
    else {
      throw new Error('Invalid User');
    }
  } catch (error) { res.status(403).send('Invalid Login'); }

});

module.exports = router;
