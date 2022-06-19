'use strict';

const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const users = (sequelize, DataTypes) => {
  const model = sequelize.define('User', {
    username: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false, },
    token: {
      type: DataTypes.VIRTUAL,
      // get() {
      //   return jwt.sign({ username: this.username });
      // }
    }
  });

  model.beforeCreate = async function (password) {
    let hashedPass = await bcrypt.hash(password, 10);
    // console.log(">>>>>>>>>>>>>>>>>>>hashed pass",hashedPass);
    return hashedPass;
  };

  // Basic AUTH: Validating strings (username, password) 
  model.authenticateBasic = async function (username, password) {
    const user = await this.findOne({ where: { username: username } })
    const valid = await bcrypt.compare(password, user.password)
    if (valid) { 
      let newToken = jwt.sign({ username: user.username },process.env.SECRET,{
        expiresIn: "20m"});
        console.log(">>>>>>>>>>>>>>>>>>>newToken",newToken);
        user.token = newToken;
      return user; }
    throw new Error('Invalid User');
  }

  // Bearer AUTH: Validating a token
  model.authenticateToken = async function (token) {
    try {
      const parsedToken = jwt.verify(token, process.env.SECRET||"anything");
      const user = this.findOne({ where: { username: parsedToken.username } })
      if (user) { return user; }
      throw new Error("User Not Found");
    } catch (e) {
      throw new Error(e.message)
    }
  }

  return model;
}

module.exports = users;