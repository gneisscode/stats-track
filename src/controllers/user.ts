import { Request, Response } from "express";
import { Stat, School, User } from "@models";


export class UserController {
  static async getUserById(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(401).json({
          message: "Unauthorized action",
        });
      }

      let presenter;

      try {
        // Attempt to find the user by ID
        presenter = await User.findById(id).select("-password");
      } catch (error: any) {
        // Handle CastError separately
        if (error.name === "CastError") {
          return res.status(404).json({ message: "Invalid user ID" });
        }
        // For other errors, return a 500 status code
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!presenter) {
        return res.status(404).json({ message: "Presenter not found" });
      }

      res.status(200).json({
        data: { presenter },
        message: "Presenter retrieved successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      //@ts-ignore
      const id = req.user.id;
      const presenterId = req.params.id;

      if (!presenterId) {
        return res.status(401).json({
          message: "Unauthorized action",
        });
      }

      try {
        //check that update request is initiated by the actual authenticated user
        if (id === presenterId) {
          const { firstName, lastName, username } = req.body;

          let user;

          // Attempt to find the user by ID

          user = await User.findById(id);

          if (!user) {
            return res.status(404).json({ message: "Presenter not found" });
          }

          //check that username is available

          const takenUsername = await User.findOne({ username });

          if (takenUsername) {
            return res.status(400).json({
              message: "Username already taken, try another one.",
            });
          }

       

          user = User.findOneAndUpdate({ _id: id }, {
            firstName,
            lastName,
            username,
          }, {new: true, select: "-password"});

        

          return res.status(200).json({
            data: { user },
            message: "Presenter updated successfully",
          });
        } else {
          return res.status(401).json({
            message: "Unauthorized action",
          });
        }
      } catch (error: any) {
        // Handle CastError separately
        if (error.name === "CastError") {
          return res.status(404).json({ message: "Invalid user ID" });
        }
        // For other errors, return a 500 status code
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
    } catch (error){
       console.error(error);
       return res.status(500).json({ error: "Internal server error" });

    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      //@ts-ignore
      const id = req.user.id;
      const presenterId = req.params.id;

      if (!presenterId) {
        return res.status(401).json({
          message: "Unauthorized action",
        });
      }
      try {
        if (id === presenterId) {
          // Attempt to find and delete the user by ID
          const deleted = await User.findOneAndDelete({
            _id: id,
          });

          if (!deleted) {
            return res.status(404).json({ message: "Presenter not found" });
          }

          //delete all stats related to the presenter

          await Stat.deleteMany({ presenter: id });

          //update the sessions for all schools related to the presenter

          //To-Do : create a relationship between schools and presenters
          await School.updateMany(
            { presenter: id },
            {
              $inc: { sessions: -1 },
            },
            { new: true }
          );

          return res.status(200).json({
            data: { deleted },
            message: "Presenter deleted successfully",
          });
        } else {
          return res.status(401).json({
            message: "Unauthorized action",
          });
        }
      } catch (error: any) {
        // Handle CastError separately
        if (error.name === "CastError") {
          return res.status(404).json({ message: "Invalid user ID" });
        }
        // For other errors, return a 500 status code
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Internal server error" });
    }
  }
}
