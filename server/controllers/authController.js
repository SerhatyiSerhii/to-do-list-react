const User = require('../model/User');
const bcrypt = require('bcrypt');

const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const cookies = req.cookies;
    console.log(`cookie available at login: ${JSON.stringify(cookies)}`);
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
        const newRefreshToken = jwt.sign(
            {
                "name": foundUser.name
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: '10m'
            }
        );

        const newRefreshTokenArray = !cookies?.jwt
            ? foundUser.refreshToken
            : foundUser.refreshToken.filter(rt => rt !== cookies.jwt);

        if (cookies?.jwt) {
            const refreshToken = cookies.jwt;
            const foundToken = await User.findOne({ refreshToken }).exec();

            // Detected refresh token reuse!
            if (!foundToken) {
                console.log('attempted refresh token reuse at login!');
                // Clear out All previous refresh tokens
                newRefreshTokenArray = [];
            }

            res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });
        }

        // Saving refreshToken with current user
        foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
        const result = await foundUser.save();
        console.log(result);

        res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true }); // secure: true - only serves on https

        res.json({ accessToken, toDoList: result.toDoList, userId: result._id });
    } else {
        res.sendStatus(401);
    }
}

module.exports = {
    handleLogin
};