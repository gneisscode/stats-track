import { Request, Response } from "express";
import  bcrypt from "bcrypt"
import jwt from "jsonwebtoken";
import { User } from "@models";
import { errorResponse } from "@helpers";


export class AuthControllers {
    static async signUp (req:Request, res:Response) {
        try {
            const {firstName, lastName, email, username, password} = req.body
          

            const takenUsername = await User.findOne({username})
            const takenEmail = await User.findOne({email})

            if(takenUsername){
                return res.status(400).json({
                    message: "Username already taken, try another one."
                })
            }

            if(takenEmail){
                return res.status(400).json({
                    message: "Email already exists. Log in or enter another email."
                })
            }

            const passwordHash = await bcrypt.hash(password, 10);
            const user = new User({
                email: email.toLowerCase(),
                firstName: firstName,
                lastName: lastName,
                username: username.toLowerCase(),
                password: passwordHash,
            })

            await user.save()

            const { _id, organisation} = user

             const userData = {
               id: _id,
               username: username.toLowerCase(),
               email: email.toLowerCase(),
               firstName: firstName,
               lastName: lastName,
               organisation,
         
             };
            
             const token = jwt.sign(
               { user: userData },
               process.env.JWT_SECRET || "",
               {
                 expiresIn: "7d",
               }
             );

              return res.status(200).json({
                data: { token, user: userData },
                message: "Account registration successful.",
              });
        } catch (err) {
            errorResponse(err, res);
            
        }
    }

    static async signIn (req: Request, res:Response) {

        try {
            const {email, password} = req.body
            const user = await User.findOne({email: email.toLowerCase()})

            if(!user){
                return res.status(401).json({
                    message: "Invalid email or password"
                })
            }
            const passwordMatch = await bcrypt.compare(password, user.password)

            if(!passwordMatch){
                return res.status(401).json({
                    message: "Invalid email or password"
                })
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

                  const token = jwt.sign(
                    { user: userData },
                    process.env.JWT_SECRET || "",
                    {
                      expiresIn: "7d",
                    }
                  );

                  return res.status(200).json({
                    data: {token, user: userData},
                    message: "User logged in successfully"
                  })

            
        } catch (err) {
            errorResponse(err, res)
        }

    }
}