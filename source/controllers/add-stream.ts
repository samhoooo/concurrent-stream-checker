import { Request, Response, NextFunction } from 'express';
import Stream from '../models/stream';
import { v4 as uuidv4 } from 'uuid';

/**
 * Add a stream upon user requests
 */
export default async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.body.userId;

    // validate if user ID exists
    if (userId == null || userId == "") {
        return res.status(400).json({
            message: "Missing userId",
        });
    }
    const userStream = await Stream.findOne({
        userId,
    });

    // validate if user exists
    if (userStream == null) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    // validate Stream table
    if (userStream.streamIds == null) {
        return res.status(500).json({
            message: "Error in getting streamIds",
        });
    }

    // validate if stream number limit exists
    if (userStream.streamIds.length >= 3) {
        return res.status(400).json({
            message: "You have reach the streaming limit!",
        });
    } 

    // add stream and generate stream number
    const streamId = uuidv4();
    userStream.streamIds.push(streamId);
    userStream.save();
    console.log(userStream);

    // return response
    return res.status(200).json({
        message: "Stream sucessfully added",
        streamId,
        userId,
        existingStreams: userStream.streamIds,
    });
};