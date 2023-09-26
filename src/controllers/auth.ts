import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "@models";
import { errorResponse, mailHelper } from "@helpers";

export class AuthControllers {
  //user signup

  static async signUp(req: Request, res: Response) {
    try {
      const { firstName, lastName, email, username, password } = req.body;

      const takenUsername = await User.findOne({ username });
      const takenEmail = await User.findOne({ email });

      if (takenUsername) {
        return res.status(400).json({
          message: "Username already taken, try another one.",
        });
      }

      if (takenEmail) {
        return res.status(400).json({
          message: "Email already exists. Log in or enter another email.",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);
      const user = new User({
        email: email.toLowerCase(),
        firstName: firstName,
        lastName: lastName,
        username: username.toLowerCase(),
        password: passwordHash,
      });

      await user.save();

      const { _id, organisation } = user;

      const userData = {
        id: _id,
        username: username.toLowerCase(),
        email: email.toLowerCase(),
        firstName: firstName,
        lastName: lastName,
        organisation,
      };

      const token = jwt.sign({ user: userData }, process.env.JWT_SECRET || "", {
        expiresIn: "7d",
      });

      return res.status(200).json({
        data: { token, user: userData },
        message: "Account registration successful.",
      });
    } catch (err) {
      errorResponse(err, res);
    }
  }

  //user sign in

  static async signIn(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
      const passwordMatch = await bcrypt.compare(password, user.password);

      if (!passwordMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      const { _id, organisation, username, firstName, lastName } = user;

      const userData = {
        id: _id,
        username,
        email,
        firstName,
        lastName,
        organisation,
      };

      const token = jwt.sign({ user: userData }, process.env.JWT_SECRET || "", {
        expiresIn: "7d",
      });

      return res.status(200).json({
        data: { token, user: userData },
        message: "User logged in successfully",
      });
    } catch (err) {
      errorResponse(err, res);
    }
  }

  // user forgot password

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;

      const user = await User.findOne({ email: email.toLowerCase() });

      if (!user) {
        return res.status(401).json({
          message: "This email is unregistered. Please create an account.",
        });
      }

      const resetToken = jwt.sign(
        { id: user._id },
        process.env.JWT_SECRET || "",
        { expiresIn: "1h" }
      );
      user.resetToken = resetToken;
      user.tokenExpiration = new Date(Date.now() + 3600000);
      await user.save();

      try {
        mailHelper({
          recipient: email,
          subject: "Stats Tracker Account Password Reset",
          body: `<p>Here's your password reset link!<p> + ${resetToken}`,
        });
      } catch (error) {
        console.log(error);
      }

      return res.status(200).json({
        message: "Reset password link sent!",
      });
    } catch (error) {
      res.status(500).send({ message: "Server error" });
      console.log(error);
    }
  }

  // reset password

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;
      const user = await User.findOne({
        resetToken: token,
        tokenExpiration: { $gt: new Date() },
      });

      if (!user) {
        return res.status(401).json({
          message: "Invalid or expired password reset link",
        });
      }

      const passwordHash = await bcrypt.hash(password, 10);

      // update new password and clear reset token & reset token expiration time

      user.password = passwordHash;
      user.resetToken = undefined;
      user.tokenExpiration = undefined;

      await user.save();

      return res.status(200).json({
        message: "password successfully reset!",
      });
    } catch (error) {
      console.log(error);
    }
  }
}
