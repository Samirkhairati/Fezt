# 🎊 Fezt 

### Overview
Fezt is a platform designed to streamline event management and item purchases within a campus environment. The frontend is developed using React and Vite, while the backend is built with Express. MongoDB serves as the database, and TypeScript is used throughout the codebase.

## Screenshots

<img width="584" alt="image" src="https://github.com/Samirkhairati/Fezt/assets/34453746/60e424ef-76c1-4149-a850-0823c56c06a3">
<img width="560" alt="image" src="https://github.com/Samirkhairati/Fezt/assets/34453746/df3ca404-be30-4700-9ce9-7aa11a6ecd83">
<img width="533" alt="image" src="https://github.com/Samirkhairati/Fezt/assets/34453746/e15be335-d6fb-488f-969d-110b07a27ae9">
<img width="508" alt="image" src="https://github.com/Samirkhairati/Fezt/assets/34453746/7289cc98-026b-464a-89f7-8aa439eabd62">
<img width="496" alt="image" src="https://github.com/Samirkhairati/Fezt/assets/34453746/3dec2e15-ed31-49e4-8895-e14dfe63eea0">
<img width="557" alt="image" src="https://github.com/Samirkhairati/Fezt/assets/34453746/6962d98a-51ed-4c7b-bdb9-1bec6946663a">
<img width="538" alt="image" src="https://github.com/Samirkhairati/Fezt/assets/34453746/82742bd6-d592-4130-8b8b-0803e9f6abc6">

### CRUD Functionality
- **User Types**: There are two types of users: students and vendors.
- **Student Authentication**: Students can log in via Google OAuth, restricted to their BITS ID.
- **Vendor Authentication**: Vendors log in using their email and password.
- **Account Creation**: 
  - Email verification is required for both students and vendors. An email containing a verification code is sent, which must be entered to proceed with account creation.
  - Account creation involves completing forms with various fields, managed using react-hook-form and react-query.
- **Student Capabilities**:
  - Students can create, update, and delete clubs.
  - Clubs can create, update, and delete events.
  - Students can register for multiple events.
  - Students can place orders for multiple items sold by vendors.
- **Vendor Capabilities**:
  - Vendors can mark orders as accepted, ready, and delivered.

### Authentication
- **JWT Authentication**: Implemented for both students and vendors.
- **Google Sign-In**: Students sign in using their Google accounts via Firebase.
- **Email Services**: NodeMailer is used to send emails for confirmation, verification, and password recovery.

### Additional Features
- **Server-Side Caching**: Redis is used for caching to improve server performance.
- **Progressive Loading**: Events and items are progressively loaded as users scroll, enhancing user experience.
- **Dashboard**: Separate dashboards for students and vendors are created to manage clubs, events, items, and orders.

### Virtual Currency System
- **Initial Balance**: Each user starts with a balance of 12,000 virtual currency units.
- **Event Registration**: When students register for events, the event price is deducted from their account and added to the revenue of the club organizing the event.
- **Purchasing Items**: When students buy items, the virtual currency is transferred to the vendor's account.
- **Revenue Management**: Club revenues are displayed in a tabular format, showing the income from event registrations. 

This setup ensures an efficient and user-friendly system for managing campus activities and transactions.


## Technologies used
1. React + Vite (frontend), Typescript
2. Express (backend), Typescript
3. MongoDB
4. Redis
5. React Hook Form
6. React Query
7. Node mailer

## Usage
For the installation,
```npm install```
```npm install --prefix client```
```npm install --prefix server```
For Development, run this in the root folder (sets up both the frontend and backend)
```npm run test```
For Production, run this in the root folder (builds the frontend and serves it with the backend)
```npm run full```

