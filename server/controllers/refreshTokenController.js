const User = require('../model/User');

const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;

    const foundUser = await User.findOne({ refreshToken }).exec();

    if (!foundUser) {
        return res.sendStatus(403); // Forbidden
    }

    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if (err || foundUser.name !== decoded.name) {
                return res.sendStatus(403);
            }

            const accessToken = jwt.sign(
                {
                    "name": decoded.name
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '5m'
                }
            );

            res.json({ accessToken, name: foundUser.name, toDoList: foundUser.toDoList, userId: foundUser._id });
        }

    ) 
}

module.exports = {
    handleRefreshToken
};