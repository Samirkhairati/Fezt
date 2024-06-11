import { Request, Response } from "express";
import handler from "../middleware/handler.middleware";
import Club, { IClub } from "../models/club.model";
import { redis } from "..";


const createClub = handler(async (req: Request, res: Response) => {
    //checking lower case name
    const club: IClub | null = await Club.findOne({ name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } });
    if (club) {
        res.status(400).json({ message: 'Club already exists' });
    } else {
        const newClub: IClub = new Club({
            name: req.body.name,
            revenue: 0,
            user: req.body.userId,
        });
        const createdClub = await newClub.save();
        res.json({
            name: createdClub.name,
            userId: createdClub.user,
            _id: createdClub._id,
            revenue: createdClub.revenue,
        })
        await redis.del('clubs');
    }

}, '@createClub ERROR: ');

const readClubs = handler(async (req: Request, res: Response) => {
    const cachedKey =  await redis.get('clubs');
    if (cachedKey) {
        res.json(JSON.parse(cachedKey));
        return;
    }
    const clubs: IClub[] = await Club.find({ user: req.query.userId });
    res.json(clubs);
    await redis.set('clubs', JSON.stringify(clubs), 'EX', 60);
}, '@readClubs ERROR: ');

const updateClub = handler(async (req: any, res: Response) => {
    const club: IClub | null = await Club.findOne({ _id: req.body._id });
    if (!club) res.status(400).json({ message: 'Club does not exist' });
    else {
        if (club.user.toString() !== req.user._id.toString()) res.status(400).json({ message: 'You are not authorized to edit this club' });
        club.name = req.body.name;
        await club.save();
        res.json({
            name: club.name,
            userId: club.user,
            _id: club._id,
            revenue: club.revenue,
        })
        await redis.del('clubs');
    }
}, '@editClub ERROR: ');

const deleteClub = handler(async (req: any, res: Response) => {
    const club: IClub | null = await Club.findOne({ _id: req.query._id });
    if (!club) res.status(400).json({ message: 'Club does not exist' });
    else {
        if (club.user.toString() !== req.user._id.toString()) res.status(400).json({ message: 'You are not authorized to delete this club' });
        await Club.findByIdAndDelete(club._id);
        res.json({ message: 'Club deleted' });
        await redis.del('clubs');
    }
}, '@deleteClub ERROR: ')

const readUserClubs = handler(async (req: any, res: Response) => {
    if (req.query.userId.toString() !== req.user._id.toString()) res.status(400).json({ message: 'You are not authorized to view these clubs' })
    const clubs: IClub[] = await Club.find({ user: req.user._id });
    res.json(clubs);
}, '@readUserClubs ERROR: ');


export { createClub, readClubs, updateClub, deleteClub, readUserClubs}