const fs = require('fs');
const path = require('path');

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
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
}



async function getUser(req,res){
    
    try {
        const users = readUsers();

        const protect = users.map(u =>  ({
        id: u.id,
        username: u.username,
        role: u.role,
        createdAt: u.createdAt,
        blocked: u.blocked

        }));
        return res.status(200).json({users: protect});
    } catch (err){
        return res.status(500).json({error: err.message})
    }

}

async function deleteUser(req,res) {
    try{
        const {id} = req.params;

        if(!id){
            return res.status(400).json({error: 'User id required'})
        }
        
        // can only make delete button aviablet to auth. come back here 
        if(req.user.id === id){
            return res.status(403).json({error: 'You do not have permission to delete.'})
        }
    
        const users = readUsers();
        const idx = users.findIndex(u => u.id === id);
    
        if (idx == -1){
            return res.status(404).json({error: err.message})
        }
        users.splice(idx, 1);
        writeUsers(users);
        return res.status(200).json({message: 'User deleted.'})
    } catch (err){
        return res.status(500).json({error: err.message})
    }

}

async function updateRole(req,res) {

    try {

        const {id} = req.params;
        const {role} = req.body;

        if (!id || !role){
            return res.status(400).json({ error: 'User id and role is required' });
        }

        if (!['User', 'Admin'].includes(role)) {
        return res.status(400).json({ error: 'Role has to be "User" or "Admin"' });
        }

        const users = readUsers();
        const user = users.find(u => u.id === id);
        if (!user){
            return res.status(404).json({error: err.message });
        } 
        user.role = role;
        writeUsers(users);
        return res.status(200).json({message: 'Role updated.'})
    
    } catch (err){
        return res.status(500).json({error: err.message})
    }


}

async function blockUser(req,res) {
    try{
        const {id} = req.params;
        if (!id) {
            return res.status(400).json({ error: 'User id required' });
        }
        const { block } = req.body; 
        const users = readUsers();
        const user = users.find(u => u.id === id);
        if (!user) { 
            return res.status(404).json({ error: 'User not found' });
        }

        if (typeof block === 'boolean'){
            user.blocked = block
        } else{
            user.blocked = !user.blocked;
        }
        writeUsers(users);
        return res.status(200).json({message: 'User is blocked.'})
    
    } catch (err){
        return res.status(500).json({error: err.message})
    }
}

module.exports = {deleteUser,updateRole,blockUser, getUser}