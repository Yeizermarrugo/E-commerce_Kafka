const router = require("express").Router();

const userService = require("./user.http");
const passportJwt = require("../middleware/auth.middleware");

//* /api/v1/perfectskin/users/
router.get("/", [passportJwt], userService.getAll);

// router.post('/', userService.register)

//? /api/v1/users/me
router.get("/me", passportJwt, userService.getMyUserById);
router.patch("/me", passportJwt, userService.editMyuser);
router.delete("/me", passportJwt, userService.removeMyUser);

router.get("/:id", passportJwt, userService.getById);
router.delete("/:id", passportJwt, userService.remove);

module.exports = { router };
