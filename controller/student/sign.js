const { validationResult } = require("express-validator");
const Student = require("../../model/student");
const { createJwtToken } = require("../../auth/jwtToken");
const bcrypt = require("bcrypt");

const handleStudentSignIn = async (req, res) => {
  // Checking, Every Details is Valid or Not
  const isEveryDetailsValid = validationResult(req);

  // If Not Valid, Then Send Error
  if (!isEveryDetailsValid.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: isEveryDetailsValid.array()[0].msg,
    });
  }

  try {
    const { email, password } = req.body; // get email and password from request body

    // check if user exist or not
    const user = await Student.findOne({ email });

    // if user not found
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Wrong Credentials",
      });
    }

    // compare user's entered password store password
    const isHashPasswordMatch = await bcrypt.compare(password, user.password);

    // if password is incorrect
    if (!isHashPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Wrong Credentials",
      });
    }

    // create jwt token
    const token = createJwtToken({ id: user._id });

    // Sending success response
    res.status(200).send({
      success: true,
      message: "Login Successful",
      authorization: "Bearer " + token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

module.exports = {
  handleStudentSignIn,
};
