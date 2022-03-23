const express = require("express");
const router = express.Router();
const users = require("../Controllers/users");

router.get("/users", users.getUser);
router.post("/users", users.createUser);
router.put("/users/:id", users.updateUser);
router.delete("/users/:id", users.deleteUser);
router.post("/login", users.login);
router.get("/me", users.validateToken, users.me);

module.exports = router;
