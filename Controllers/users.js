const User = require("../Models/users");
const moment = require("moment");
const bcrypt = require("bcryptjs");
const token = require("jsonwebtoken");
const { passwordStrength } = require("check-password-strength");

exports.getUser = (req, res) => {
  User.find()
    .then((users) => res.status(200).json(users))
    .catch((err) => res.status(500).json(err));
};

exports.createUser = (req, res) => {
  if (
    !req.body.name ||
    !req.body.gender ||
    !req.body.dateOfBirth ||
    !req.body.aadharNumber ||
    !req.body.password
  ) {
    res.status(400).json({ message: "Missing required parameters" });
  } else if (
    req.body.aadharNumber.length < 12 ||
    req.body.aadharNumber.length > 12
  ) {
    res.status(400).json({ message: "Aadhar number should be of 12 digit" });
  } else if (passwordStrength(req.body.password).id === 0) {
    res.status(400).json({ message: "Password is Too Weak" });
  } else {
    User.findOne({ aadharNumber: req.body.aadharNumber })
      .then((user) => {
        if (user) {
          res.status(409).json({ message: "Aadhar Number already exist!" });
        } else {
          const hash = bcrypt.hashSync(req.body.password, 8);
          User.create({
            name: req.body.name,
            gender: req.body.gender,
            dateOfBirth: req.body.dateOfBirth,
            aadharNumber: req.body.aadharNumber,
            password: hash,
            createdAt: moment().toISOString(),
            modifiedAt: moment().toISOString(),
          })
            .then((users) => res.status(201).json(users))
            .catch((err) => res.status(500).json(err));
        }
      })
      .catch((err) => res.status(500).json(err));
  }
};

exports.updateUser = (req, res) => {
  if (req.body.aadharNumber) {
    res.status(400).json({ message: "Aadhar Number can't be modified!" });
  } else {
    User.findByIdAndUpdate(
      req.params.id,
      { $set: req.body, modifiedAt: moment().toISOString() },
      { new: true }
    )
      .then((users) => res.status(200).json(users))
      .catch((err) => res.status(500).json(err));
  }
};

exports.deleteUser = (req, res) => {
  User.findOne({ aadharNumber: req.body.aadharNumber }).then((user) => {
    if (!user) {
      res.status(404).json({ message: "User Not Found!" });
    } else {
      User.findByIdAndDelete(req.params.id)
        .then((users) => res.status(204).json(users))
        .catch((err) => res.status(500).json(err));
    }
  });
};

exports.me = (req, res) => {
  User.findOne({ aadharNumber: req.aadharNumber })
    .then((users) => res.status(200).json(users))
    .catch(() => res.status(404).json({ message: "User Not Found!" }));
};

exports.login = (req, res) => {
  User.findOne({ aadharNumber: req.body.aadharNumber }).then((user) => {
    if (!user) {
      res.status(404).json({ message: "User Not Found!" });
    } else {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        const Token = token.sign(
          {
            id: user.aadharNumber,
          },
          "myAadhaar",
          { expiresIn: "1h" }
        );
        res.status(200).json({ Token: Token });
      } else {
        res.status(404).json({ message: "Incorrect Password" });
      }
    }
  });
};

exports.validateToken = (req, res, next) => {
  let tokenVerification = "";
  if ("authorization" in req.headers) {
    tokenVerification = req.headers["authorization"];
    if (!tokenVerification)
      return res
        .status(403)
        .send({ auth: false, message: "No token provided" });
    else {
      token.verify(tokenVerification, "myAadhaar", (err, decoded) => {
        if (err)
          return res
            .status(500)
            .send({ auth: false, message: "Invalid Token or Token expired" });
        else {
          req.aadharNumber = decoded.id;
          next();
        }
      });
    }
  } else {
    res.status(401).json({
      message: "UnAuthorized! Missing 'Authorization' token in header",
    });
  }
};
