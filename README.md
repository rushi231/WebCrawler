 # Web Crawler Application

  This is a project where users can crawl websites and extract the URLS. Built with React, Node,js and Express.


## Features

- **User Authentication**: Sign up and sign in
- **Web Crawling**: Enter a URL and specify how many pages to crawl
- **URL Extraction**: Automatically extracts and displays all URLs found on crawled pages
- **User Management**: Admins can view, block, unblock, delete users, and change user roles

## Tech Stack

### Frontend
- **React.js** - UI framework
- **CSS** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **bcrypt** - Password hashing
- **jsonwebtoken (JWT)** - Authentication tokens
- **Cheerio** - HTML parsing for web crawling

## Installation

### Prerequisites
- Node.js

### Backend Setup
1. Navigate to the backend directory:
```bash
cd backend
```


2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory:
```
JWT_SECRET=your_secret_key_here
PORT=5000
```

4. Start the backend server:
```bash
node server.js
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the React development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:3000`

## Usage

### For Users:
1. **Sign Up**: Create an account with username and password
2. **Sign In**: Log in with your  username and password
3. **Crawl Websites**: 
   - Enter a URL to crawl
   - Click "Crawl" to start
4. **View Results**: See all extracted URLs

### For Admin Users:
All regular user features, plus:
- **Manage Users**: Access user management dashboard
- **View All Users**: See list of all registered users
- **Change User Roles**: Promote users to Admin or demote to User
- **Block or Unblock Users**: Prevents or allows user access
- **Delete Users**: Remove users

## Future Improvements

- [ ] JSON file storage to MongoDB or PostgreSQL
- [ ] Implement rate limiting to prevent abuse
- [ ] Add user profiles and crawl history
- [ ] Store crawl results in database for later retrieval
- [ ] Implement token refresh mechanism
- [ ] Password reset functionality
