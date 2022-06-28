import { Request, Response, NextFunction } from 'express';
import Stream from '../models/stream';

/**
 * Get current stream of a user
 */
export default async (req: Request, res: Response, next: NextFunction) => {
    let userId = req.query.userId?.toString();

    // validate if user ID exists
    if (userId == null || userId == "") {
        return res.status(400).json({
            message: "Missing userId"
        });
    }

    // validate if user exists
    const userStream = await Stream.findOne({
        userId,
    });
    if (userStream == null) {
        return res.status(404).json({
            message: "User not found",
        });
    }

    return res.status(200).json({
        message: "Streams successfully retrieved",
        userId: userStream.userId,
        streamIds: userStream.streamIds,
    });
};
