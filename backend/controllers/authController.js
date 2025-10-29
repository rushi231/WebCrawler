const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// current directory. join path segments into 1.
const usersFilePath = path.join(__dirname, '../data/users.json');

function readUsers() {
    try {
        const data = fs.readFileSync(usersFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

function writeUsers(users) {
    // 2 spaces. better formating. 
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}

async function signUp(req, res) {
    try {
        const { username, password, role } = req.body;

        if (!username || !password) {
            return res.status(400).json({ error: 'Username and password required' });
        }

        if (role && role !== 'User' && role !== 'Admin') {
            return res.status(400).json({ error: 'Role must be User or Admin' });
        }

        const users = readUsers();
        const userExists = users.find(u => u.username === username);

        if (userExists) {
            return res.status(400).json({ error: "Username already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: Date.now().toString(),
            username,
            password: hashedPassword,
            role: role || 'User',
            createdAt: new Date().toISOString(),
            blocked: false
        };

        // push to array
        users.push(newUser);
        // add to file back.
        writeUsers(users);

        const token = jwt.sign(
            { id: newUser.id, username: newUser.username, role: newUser.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
            message: 'User created successfully',
            token,
            user: {
                id: newUser.id,
                username: newUser.username,
                role: newUser.role,
                blocked: newUser.blocked
            }
        });

    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
}

async function signIn(req, res) {
    try {
        const { username, password } = req.body;
        
        if (!password || !username) {
            return res.status(401).json({ error: 'Username and password required' });
        }

        const users = readUsers();
        const user = users.find(u => u.username === username);
       
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);


        if (!passwordMatch) {
            return res.status(401).json({error: 'Wrong Password'})
        }
        if (user.blocked) {
            return res.status(403).json({ error: 'The user is blocked.' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role,
                blocked: user.blocked
            }
        });
    } catch (error) {
        res.status(500).json({ error: 'Server error: ' + error.message });
    }
}

module.exports = { signUp, signIn };