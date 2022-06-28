import { Request, Response, NextFunction } from 'express';
import Stream from '../models/stream';
import { FilterQuery } from "mongoose";

/**
 * Remove a stream upon user termination
 */
export default async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.body.userId;
    let streamId = req.body.streamId;

    if (userId == null || userId == "") {
        return res.status(400).json({
            message: "Missing userId",
        });
    }

    let query: any = {
        userId,
    };
    if (streamId != null) {
        query = { 
            ...query,
            streamIds: {
                "$in" : [streamId],
            },
        }
    }
    const userStream = await Stream.findOne(query);

    // Validate if the stream exists
    if (userStream == null) {
        return res.status(404).json({
            message: "User or Stream not found",
        });
    }

    if (streamId != null) {
        // remove the stream with stream ID
        await Stream.deleteOne({
            userId,
            streamId,
        });
    } else {
        // remove the latest stream
        userStream.streamIds.pop();
        userStream.save();
    }

    // return response
    return res.status(200).json({
        message: 'stream terminated',
        userId,
        existingStreams: userStream.streamIds,
    });
};