const User = require('../model/User');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { name, password } = req.body;

    if (!name || !password) {
        return res.status(400).json({'message': 'User name and password are required'});
    }

    const foundUser = await User.findOne({ name: name }).exec();

    if (!foundUser) {
        return res.sendStatus(401); // Unauthoried
    }

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password);

    if (match) {
        // create JWTs
        const accessToken = jwt.sign(
            {
                "name": foundUser.name
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '5m'
            }
        );
        const refreshToken = jwt.sign(
            {
                "name": foundUser.name
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '10m'
            }
        );

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true }); // secure: true - only serves on https

        res.json({ accessToken, toDoList: result.toDoList, userId: result._id });
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    handleLogin
};