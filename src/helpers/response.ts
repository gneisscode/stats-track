import { Response } from "express";
import { Error } from "mongoose";
const { ValidationError } = Error;

export function errorResponse(err: any, res: Response) {
  console.error(err);
  if (err instanceof ValidationError) {
    const errorMessages = Object.values(err.errors).map((e) => e.message);
    res
      .status(400)
      .json({
        message: errorMessages || "An error occured, please try again later.",
      });
  } else {
    res.status(500).send({
      error: "An error occured, please try again later.",
    });
  }
}

export function successResponse(data: any, message: string, res: Response) {
  res.send({
    data,
    message,
  });
}
