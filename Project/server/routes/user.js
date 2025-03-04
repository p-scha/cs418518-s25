import { Router } from "express";
import connection from "../database/database.js";
import crypto from "crypto";
import { ComparePassword, HashedPassword } from "../utils/helper.js";
import { sendEmail } from "../utils/mailer.js";
const user = Router();

//CRUD

user.get("/", (req, res) => {
  // res.send("Hello World!");
  // res.json({'message':'User get API Response!'})

  connection.execute("select * from user_information", function (err, result) {
    if (err) {
      res.send(err);
    } else {
      res.json({
        status: 200,
        message: "User fetced successfully",
        data: result,
      });
    }
  });
});

//get user by id
user.get("/:id", (req, res) => {
  // res.send("Hello World!");
  res.json({ message: "Get user by ID API Response!" + req.params.id });
});


// Update user's first name and last name
user.put("/:id", (req, res) => {
  connection.execute(
    "update user_information set u_first_name=?, u_last_name=? where u_id=?", [
    req.body.FirstName, req.body.LastName, req.params.id
  ],
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json({
          status: 200,
          message: "User updated successfully",
          data: result,
        });
      }
    }
  );
});


// Delete user record
user.delete("/:id", (req, res) => {
  connection.execute(
    "delete from user_information where u_id=?", [
    req.params.id
  ],
    function (err, result) {
      if (err) {
        res.send(err);
      } else {
        res.json({
          status: 200,
          message: "User deleted successfully",
          data: result,
        });
      }
    }
  );
});

// User logs in
user.post("/login", (req, res) => {
  connection.execute(
    "select * from user_information where u_email=?", 
    [req.body.Email],
    function (err, result) {
      if (err) {
        console.log("Error");
        return res.send(err);
      } 

      if (result.length == 1) {
        const user = result[0];
        const hashedPassword = user.u_password;

        // Check if the email is verified first
        if (!user.is_verified) {
          return res.status(403).json({ message: "Please verify your email before logging in." });
        }

        // Check the password
        if (ComparePassword(req.body.Password, hashedPassword)) {
          sendEmail(req.body.Email, "Login OTP Verification", "Your OTP is 1234");
          req.session.userId = user.u_id; // Store user ID in session
          req.session.isVerified = user.is_verified; // Store verification status in session

          return res.json({
            status: 200,
            message: "Login successful",
            data: result,
          });
        } else {
          // If password doesn't match
          return res.status(403).json({
            status: 403,
            message: "Password is incorrect",
          });
        }
      } else {
        // If email is not found
        return res.status(404).json({
          status: 404,
          message: "User not found",
        });
      }
    }
  );
});


// User registers new account
user.post("/register", (req, res) => {
  const { FirstName, LastName, Email, Password, IsAdmin } = req.body;

  // Check if email already exists in the database
  connection.execute(
      "SELECT * FROM user_information WHERE u_email = ?",
      [Email],
      function (err, result) {
          if (err) {
              return res.status(500).json({ message: 'Database error' });
          }

          // Error for if email already exists in database
          if (result.length > 0) {
              return res.status(400).json({ message: 'Email is already in use' });
          }

          // Hash the password before storing it
          const hashedPassword = HashedPassword(Password);
          const verificationToken = crypto.randomBytes(32).toString("hex"); // Generate token

          // Insert the user into the database
          connection.execute(
              "INSERT INTO user_information (u_first_name, u_last_name, u_email, u_password, is_admin, is_verified, verification_token) VALUES (?, ?, ?, ?, ?, ?, ?)",
              [
                FirstName, 
                LastName, 
                Email, 
                hashedPassword, 
                IsAdmin, 
                false,
                verificationToken
              ], 
              function (err, result) {
                  if (err) {
                      return res.status(500).json({ message: 'Error registering user' });
                  }
                  
                  // Send verification email with token
                  const verificationLink = `http://localhost:8080/user/verify/${verificationToken}`;
                  sendEmail(Email, "Verify Your Email", `Click the link to verify: ${verificationLink}`);

                  res.json({
                      status: 200,
                      message: "User created successfully",
                      data: result,
                  });
              }
          );
      }
  );
});
// });

// Verification after register
user.get("/verify/:token", (req, res) => {
  const { token } = req.params;

  connection.execute(
      "SELECT * FROM user_information WHERE verification_token = ?",
      [token],
      function (err, result) {
          if (err) return res.status(500).json({ message: "Database error" });

          if (result.length === 0) {
              return res.status(400).json({ message: "Invalid or expired token" });
          }

          connection.execute(
              "UPDATE user_information SET is_verified = ?, verification_token = NULL WHERE verification_token = ?",
              [true, token],
              function (err, updateResult) {
                  if (err) return res.status(500).json({ message: "Error verifying email" });

                  res.json({ status: 200, message: "Email verified successfully! You can now log in." });
              }
          );
      }
  );
});

// Request Password Reset
user.post("/forgotpassword", (req, res) => {
  const { email } = req.body;

  connection.execute("SELECT * FROM user_information WHERE u_email = ?", [email], (err, result) => {
      if (err) {
          return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
          return res.status(404).json({ message: "User not found" });
      }

      const resetToken = crypto.randomBytes(32).toString("hex");
      const resetLink = `http://localhost:5173/reset-password/${resetToken}`; // Replace with your actual frontend URL

      // Store the reset token in the database (you may want to set an expiration time here)
      connection.execute(
          "UPDATE user_information SET reset_token = ?, reset_token_expiration = ? WHERE u_email = ?",
          [resetToken, Date.now() + 3600000, email],  // Set expiration time to 1 hour
          (err, updateResult) => {
              if (err) {
                  return res.status(500).json({ message: "Error updating reset token" });
              }

              // Send the password reset email
              sendEmail(email, "Password Reset Request", `Click this link to reset your password: ${resetLink}`);

              res.json({ status: 200, message: "Password reset link sent to your email." });
          }
      );
  });
});

// Resetting password
user.post("/resetpassword", (req, res) => {
  const { token, newPassword } = req.body;

  // Ensure the new password is at least 8 characters long
  if (newPassword.length < 8) {
      return res.status(400).json({ message: "Password must be at least 8 characters long." });
  }

  // Find the user by the reset token
  connection.execute("SELECT * FROM user_information WHERE reset_token = ?", [token], (err, result) => {
      if (err) {
          return res.status(500).json({ message: "Database error" });
      }

      if (result.length === 0) {
          return res.status(400).json({ message: "Invalid or expired reset token" });
      }

      const user = result[0];

      // Check if the token is expired
      if (Date.now() > user.reset_token_expiration) {
          return res.status(400).json({ message: "Reset token has expired" });
      }

      // Hash the new password before saving it
      const hashedPassword = bcrypt.hashSync(newPassword, 10);

      // Update the password in the database
      connection.execute(
          "UPDATE user_information SET u_password = ?, reset_token = NULL, reset_token_expiration = NULL WHERE u_email = ?",
          [hashedPassword, user.u_email],
          (err, updateResult) => {
              if (err) {
                  return res.status(500).json({ message: "Error resetting password" });
              }

              res.json({ status: 200, message: "Password has been reset successfully!" });
          }
      );
  });
});

// Change password after user logins
user.post("/change-password", (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!req.session.userId) {
      return res.status(401).json({ message: "Please log in first." });
  }

  const userId = req.session.userId;

  connection.execute(
      "SELECT * FROM user_information WHERE u_id = ?",
      [userId],
      async (err, result) => {
          if (err) return res.status(500).json({ message: "Database error" });

          if (result.length === 0) {
              return res.status(404).json({ message: "User not found" });
          }

          const user = result[0];
          const hashedPassword = user.u_password;

          // Validate the current password
          if (!ComparePassword(currentPassword, hashedPassword)) {
              return res.status(403).json({ message: "Current password is incorrect" });
          }

          // Hash the new password and update it in the database
          const newHashedPassword = HashedPassword(newPassword);

          connection.execute(
              "UPDATE user_information SET u_password = ? WHERE u_id = ?",
              [newHashedPassword, userId],
              function (err) {
                  if (err) return res.status(500).json({ message: "Error updating password" });

                  res.json({ status: 200, message: "Password changed successfully" });
              }
          );
      }
  );
});


export default user;
