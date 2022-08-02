const User = require('../model/User');
const bcrypt = require('bcrypt');

const handleNewUser = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({'message': 'User name and password are required'});
    }

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ name: name }).exec();

    if (duplicate) {
        return res.sendStatus(409); // Conflict
    }

    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(password, 10);

        // create and store the new user
        await User.create({
            name: name,
            password: hashedPwd
        });

        res.status(201).json({"message": `New user ${name} created!`});
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
}

module.exports = {
    handleNewUser
};