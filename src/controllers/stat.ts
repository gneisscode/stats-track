import { Request, Response } from "express";
import { Stat, School, User } from "@models";
import jwt from "jsonwebtoken";

export class StatController {
  //Create a stat

  static async createStat(req: Request, res: Response) {
    try {
      //@ts-ignore
      const id = req.user._id;

      const { school, grade, total, rec, tws, feedback, seminarName} = req.body;

      let user = await User.findById(id);
      console.log(user)
      console.log(user?._id)

      let schoolExists = await School.findOne({
        name: { $regex: school, $options: "i" },
      });

      //check if school exists in DB

      if (!schoolExists) {
        const newSchool = new School({
          name: school.toLowerCase(),
        });

        schoolExists = await newSchool.save();
      }

      //create new stat for school

      const stat = new Stat({
        presenterId: user?._id,
        presenterFirstName: user?.firstName,
        presenterLastName: user?.lastName,
        presenterUserName: user?.username,
        presenterProvince: user?.province,
        schoolId: schoolExists?._id,
        schoolName: schoolExists?.name,
        seminarName: seminarName,
        grade: grade,
        total: total,
        rec: rec,
        tws: tws,
        feedback: feedback,
      });

      //save stat
      await stat.save();


      if (schoolExists) {
        await School.updateOne(
          { _id: schoolExists._id },
          {
            $push: {stats: stat._id},
            $inc: { sessions: 1 },
          }
        );
      }

      if (user) {
        const { sessions, averageRec, averageTWS } = user;

        const weightedSumRec = sessions * averageRec + (rec / total) * 100;
        const weightedSumTWS = sessions * averageTWS + (tws / total) * 100;

        const newSessions = sessions + 1;

        const newAverageRec = Math.round(weightedSumRec / newSessions);
        const newAverageTWS = Math.round(weightedSumTWS / newSessions);

        user = await User.findOneAndUpdate(
          { _id: id },
          {
            $inc: { sessions: 1 },
            $set: { averageRec: newAverageRec },
            averageTWS: newAverageTWS,
          },
          { new: true, select: "-password" }
        );
      }


      const token = jwt.sign({ user: user }, process.env.JWT_SECRET || "", {
        expiresIn: "7d",
      });

      res.status(200).json({
        data: { stat: stat.toObject(), user:{token, user:user} },
        message: "Stat created successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  //Retrieve a stat by stat ID

  static async getStatById(req: Request, res: Response) {
    try {
      const id = req.params.id;

      if (!id) {
        return res.status(401).json({
          message: "Unauthorized action",
        });
      }

      let stat;

      try {
        // Attempt to find the stat by ID
        stat = await Stat.findById(id);
      } catch (error: any) {
        // Handle CastError separately
        if (error.name === "CastError") {
          return res.status(404).json({ message: "Invalid stat ID" });
        }
        // For other errors, return a 500 status code
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }
      if (!stat) {
        return res.status(404).json({ message: "Stat not found" });
      }
      const presenter = await User.findById(stat?.presenterId).select(
        "-password"
      );
      const school = await School.findById(stat?.schoolId);

      res.status(200).json({
        data: { stat, presenter, school },
        message: "Stat retrieved successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  //Retrieve stats by presenter ID
  static async getStatsByPresenterId(req: Request, res: Response) {
    try {
      //@ts-ignore
      const id = req.params.id;
      if (!id) {
        return res.status(401).json({
          message: "Unauthorized action",
        });
      }

      let stats;

      try {
        // Attempt to find the stats by presenter ID
        stats = await Stat.find({ presenter: id });
      } catch (error: any) {
        // Handle CastError separately
        if (error.name === "CastError") {
          return res.status(404).json({ message: "Invalid user ID" });
        }
        // For other errors, return a 500 status code
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!stats) {
        return res
          .status(404)
          .json({ message: "No stats found for this presenter" });
      }

      if (stats.length === 0) {
        return res
          .status(404)
          .json({ message: "No stats found for this presenter" });
      }
      const presenter = await User.findById(id).select("-password");

      res.status(200).json({
        data: { stats, presenter },
        message: "Presenter stats retrieved successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  //Retrieve stats by school ID
  static async getStatsBySchoolId(req: Request, res: Response) {
    try {
      //@ts-ignore
      const id = req.params.id;
      if (!id) {
        return res.status(401).json({
          message: "Unauthorized action",
        });
      }


      let stats;

      try {
        // Attempt to find the stats by school ID
       stats = await Stat.find({ school: id });
      } catch (error: any) {
        // Handle CastError separately
        if (error.name === "CastError") {
          return res.status(404).json({ message: "Invalid school ID" });
        }
        // For other errors, return a 500 status code
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
      }

      if (!stats) {
        return res
          .status(404)
          .json({ message: "No stats found for this school" });
      }

      if (stats.length === 0) {
        return res
          .status(404)
          .json({ message: "No stats found for this school" });
      }

       const school = await School.findById(id);


      res.status(200).json({
        data: { stats, school },
        message: "School stats retrieved successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  //Retrieve all stats

  static async getAllStats(req: Request, res: Response) {
    try {
      const stats = await Stat.find();

      if (stats.length === 0) {
        return res.status(404).json({ message: "No stats found" });
      }

      res.status(200).json({
        stats,
        message: "All stats retrieved successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  //Update a stat
  static async updateStat(req: Request, res: Response) {
    try {
      //@ts-ignore
      const presenter = req.user.id;
      const statId = req.params.id;
      const { school, grade, total, rec, tws, feedback, seminarName } = req.body;
      
      if (!statId) {
          return res.status(401).json({
            message: "Unauthorized action",
          });
        }

      //check if stat exists in DB

      let stat = await Stat.findOne({ presenter, _id: statId });

      //check if school exists in DB

      let schoolExists = await School.findOne({
        name: { $regex: school, $options: "i" },
      });

      if (!stat) {
        return res.status(401).json({ message: "Unauthorized action" });
      }

      if (!schoolExists) {
        //create a new entry for the school
        const newSchool = new School({
          name: school.toLowerCase(),
        });

        schoolExists = await newSchool.save();

        // update the sessions for the new school

        await School.updateOne(
          { _id: schoolExists._id },
          {
            $inc: { sessions: 1 },
          }
        );

        //update the sessions for the previous school

        await School.updateOne(
          { _id: stat.schoolId },
          { $inc: { sessions: -1 } }
        );
      }

      // Calculate the old percentages
      const oldRecPercentage = (stat.rec / stat.total) * 100;
      const oldTWSPercentage = (stat.tws / stat.total) * 100;

      stat = await Stat.findOneAndUpdate(
        { _id: statId },
        {
          school: schoolExists._id,
          grade,
          total,
          rec,
          tws,
          feedback,
          seminarName,
        },
        { new: true }
      );

      // Calculate the new percentages
      const newRecPercentage = (rec / total) * 100;
      const newTWSPercentage = (tws / total) * 100;

      let user = await User.findById(presenter);

      if (user) {
        const { sessions, averageRec, averageTWS } = user;

        // Update the user's averages
        const newSessions = sessions;
        const newAverageRec = Math.round(
          (sessions * averageRec - oldRecPercentage + newRecPercentage) /
            newSessions
        );
        const newAverageTWS = Math.round(
          (sessions * averageTWS - oldTWSPercentage + newTWSPercentage) /
            newSessions
        );

        user = await User.findOneAndUpdate(
          { _id: presenter },
          {
            $set: { averageRec: newAverageRec },
            averageTWS: newAverageTWS,
          },
          { new: true, select: "-password" }
        );
      }

      res.status(200).json({
        data: { stat, user },
        message: "Stat updated successfully",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }

  //Delete a stat
  static async deleteStat(req: Request, res: Response) {
    try {
      const { schoolId } = req.body;
      //@ts-ignore
      const presenter = req.user._id;
      const id = req.params.id;
      if (!id) {
          return res.status(401).json({
            message: "Unauthorized action",
          });
        }
      const deleted = await Stat.findOneAndDelete({ presenterId: presenter, _id: id });

      if (!deleted) {
        return res.status(401).json({ message: "Unauthorized action" });
      }

      // Find the user by presenter ID
      let user = await User.findOne({ _id: presenter });
      console.log(user)

      if (user) {
        const { sessions, averageRec, averageTWS } = user;

        // Update the user's sessions and recalculate averages
        const newSessions = sessions - 1;
        const newAverageRec =
          newSessions > 0
            ? Math.round(
                (sessions * averageRec - (deleted.rec / deleted.total) * 100) /
                  newSessions
              )
            : 0;
        const newAverageTWS =
          newSessions > 0
            ? Math.round(
                (sessions * averageTWS - (deleted.tws / deleted.total) * 100) /
                  newSessions
              )
            : 0;

        user = await User.findOneAndUpdate(
          { _id: presenter },
          {
            $inc: { sessions: -1 },
            $set: { averageRec: newAverageRec, averageTWS: newAverageTWS },
          },
          { new: true, select: "-password" }
        );
      }

      // Find the school by school ID
      let school = await School.findById(schoolId);

      if (school) {
        // Update the school's sessions
        school = await School.findByIdAndUpdate(
          { _id: schoolId },
          {
            $pull: { stats: id },
            $inc: { sessions: -1 },
          },
          { new: true }
        );
      }

      res.status(200).json({
        data: { deleted, user, school },
        message: "Stat deleted",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
