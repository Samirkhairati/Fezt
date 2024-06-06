import jwt from 'jsonwebtoken';
import { Request, Response } from "express";
import handler from "../middleware/handler.middleware";
import Club, { IClub } from "../models/club.model";

const createClub = handler(async (req: Request, res: Response) => {
    //checking lower case name
    const club: IClub | null = await Club.findOne({ name: { $regex: new RegExp(`^${req.body.name}$`, 'i') } });
    if (club) throw new Error('Club already exists');

    const newClub: IClub = new Club({
        name: req.body.name,
        revanue: 0,
        user: req.body.userId,
    });
    const createdClub = await newClub.save();
    res.json({
        name: createdClub.name,
        userId: createdClub.user,
        _id: createdClub._id,
        revenue: createdClub.revenue,
    })
}, '@createClub ERROR: ');

const readClubs = handler(async (req: Request, res: Response) => {
    const clubs: IClub[] = await Club.find({ user: req.body.userId });
    res.json(clubs);
}, '@createClub ERROR: ');

const updateClub = handler(async (req: any, res: Response) => {
    const club: IClub | null = await Club.findOne({ _id: req.body._id });
    if (!club) throw new Error('Club does not exist');
    if (club.user.toString() !== req.user._id.toString()) throw new Error('You are not authorized to update this club');

    club.name = req.body.name;
    await club.save();
    res.json({
        name: club.name,
        userId: club.user,
        _id: club._id,
        revenue: club.revenue,
    })
}, '@createClub ERROR: ');

const deleteClub = handler(async (req: any, res: Response) => {
    const club: IClub | null = await Club.findOne({ _id: req.body._id });
    if (!club) throw new Error('Club does not exist');
    if (club.user.toString() !== req.user._id.toString()) throw new Error('You are not authorized to delete this club');
    await Club.findByIdAndDelete(club._id);
    res.json({ message: 'Club deleted' });
}, '@createClub ERROR: ')


export { createClub, readClubs, updateClub, deleteClub}