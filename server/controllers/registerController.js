const User = require('../model/User');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

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
        const newUser = await User.create({
            name: name,
            password: hashedPwd,
            toDoList: [],
        });

        // create JWTs
        const accessToken = jwt.sign(
            {
                "name": newUser.name
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '5m'
            }
        );
        const refreshToken = jwt.sign(
            {
                "name": newUser.name
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '1d'
            }
        );

        newUser.refreshToken = refreshToken;

        const result = await newUser.save();

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true }); // secure: true - only serves on https

        res.json({ accessToken, toDoList: result.toDoList, userId: result._id });
    } catch (err) {
        res.status(500).json({'message': err.message});
    }
}

module.exports = {
    handleNewUser
};