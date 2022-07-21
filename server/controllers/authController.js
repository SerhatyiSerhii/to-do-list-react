const usersDB = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({'message': 'User name and password are required'});
    }

    const foundUser = usersDB.users.find(person => person.name === name);

    if (!foundUser) {
        return res.sendStatus(401); // Unauthoried
    }

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
        // create JWTs
        res.json({"success": `User ${name} is logged in!`});
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    handleLogin
};