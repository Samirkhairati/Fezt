import { Request, Response } from "express";
import handler from "../middleware/handler.middleware";
import Event, { IEvent } from "../models/event.model";
import Club, { IClub } from "../models/club.model";
import User, { IUser } from "../models/user.model";


const createEvent = handler(async (req: any, res: Response) => {
    const club: IClub | null = await Club.findOne({ _id: req.body.club });
    const popuplatedClub = await club?.populate('user')
    //@ts-ignore
    if (popuplatedClub?.user._id.toString() !== req.user._id.toString()) res.status(400).json({ message: 'You are not authorized to create an event for this club' })
    else {
        const newEvent: IEvent = new Event({
            name: req.body.name,
            image: req.body.image || 'https://semantic-ui.com/images/wireframe/image.png',
            price: req.body.price,
            date: req.body.date,
            registrations: 0,
            club: req.body.club,
        });
        const createdEvent = await newEvent.save();
        res.json({
            name: createdEvent.name,
            image: createdEvent.image,
            price: createdEvent.price,
            date: createdEvent.date,
            registrations: createdEvent.registrations,
            club: createdEvent.club,
            _id: createdEvent._id,
        })
    }

}, '@createEvent ERROR: ');

const updateEvent = handler(async (req: any, res: Response) => {
    const event: IEvent | null = await Event.findOne({ _id: req.body._id });
    if (!event) res.status(400).json({ message: 'Event does not exist' });
    else {
        const club: IClub | null = await Club.findOne({ _id: req.body.club });
        const popuplatedClub = await club?.populate('user')
        //@ts-ignore
        if (popuplatedClub?.user._id.toString() !== req.user._id.toString()) res.status(400).json({ message: 'You are not authorized to edit an event for this club' })
        event.name = req.body.name || event.name;
        event.image = req.body.image || event.image;
        event.price = req.body.price || event.price;
        event.date = req.body.date || event.date;
        await event.save();
        res.json({
            name: event.name,
            image: event.image,
            price: event.price,
            date: event.date,
            registrations: event.registrations,
            club: event.club,
            _id: event._id,
        })
    }

}, '@editEvent ERROR: ');

const deleteEvent = handler(async (req: any, res: Response) => {
    const event: IEvent | null = await Event.findOne({ _id: req.query._id });
    if (!event) res.status(400).json({ message: 'Event does not exist' });
    else {
        const club: IClub | null = await Club.findOne({ _id: req.query.club });
        const popuplatedClub = await club?.populate('user')
        //@ts-ignore
        if (popuplatedClub?.user._id.toString() !== req.user._id.toString()) res.status(400).json({ message: 'You are not authorized to delete an event for this club' })
        await Event.findByIdAndDelete(event._id);
        res.json({ message: 'Event deleted' });
    }
}, '@deleteEvent ERROR: ')

const readEvents = handler(async (req: Request, res: Response) => {
    const { page = 1 } = req.query;
    const pageNumber = parseInt(page as string, 10);
    const limitNumber = 3;
    const events: IEvent[] = await Event.find({})
        .skip((pageNumber - 1) * limitNumber)
        .limit(limitNumber)
        .populate('club');
    const totalCount = await Event.countDocuments({});
    const hasNextPage = pageNumber * limitNumber < totalCount;

    res.status(200).json({
        data: events,
        currentPage: pageNumber,
        nextPage: hasNextPage ? pageNumber + 1 : null,
    });
}, '@readEvents ERROR: ');


const readEventsByUser = handler(async (req: Request, res: Response) => {
    const clubs: IClub[] = await Club.find({ user: req.query.userId });
    const events = await Event.find({ club: { $in: clubs.map(club => club._id) } })
        .populate('club');
    res.status(200).json(events);
}, '@readEventsByClub ERROR: ');

const registerEvent = handler(async (req: any, res: Response) => {
    console.log('hi')
    const event: IEvent | null = await Event.findById(req.body.eventId);
    const user: IUser | null = await User.findById(req.body.userId);
    const club: IClub | null = await Club.findById(req.body.clubId);
    console.log('hi')
    if (!event) res.status(400).json({ message: 'Event does not exist' });
    else if (!user) res.status(400).json({ message: 'User does not exist' });
    else if (!club) res.status(400).json({ message: 'Club does not exist' });
    else if (req.user._id.toString() !== user._id.toString()) res.status(400).json({ message: 'You are not authorized to register this user' })
    else {
        console.log('hi')
        event.registrations = event.registrations! + 1;
        user.balance = user.balance! - event.price!;
        club.revenue = club.revenue! + event.price!;
        user.events?.push(event._id);
        event.registered?.push(user._id);
        const message = `₹${event.price} has been deducted from your account. Current balance: ₹${user.balance}`
        await event.save();
        await user.save();
        await club.save();
        res.json({ message });
    }
}, '@registerEvent ERROR: ');

export { createEvent, readEvents, updateEvent, deleteEvent, registerEvent, readEventsByUser }