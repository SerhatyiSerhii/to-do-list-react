const User = require('../model/User');

const jwt = require('jsonwebtoken');

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;

    if (!cookies?.jwt) {
        return res.sendStatus(401);
    }

    const refreshToken = cookies.jwt;
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true });

    const foundUser = await User.findOne({ refreshToken }).exec();

    // Detected refresh token reuse
    if (!foundUser) {
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            async (err, decoded) => {
                if (err) return res.sendStatus(403); // Forbidden

                console.log('attempted refresh token reuse!');
                const hackedUser = await User.findOne({ name: decoded.name }).exec();

                hackedUser.refreshToken = [];

                const result = await hackedUser.save();
                console.log(result);
            }
        );

        return res.sendStatus(403); // Forbidden
    }

    const newRefreshTokenArray = foundUser.refreshToken.filter(rt => rt !== refreshToken);

    // evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) {
                console.log('expired refresh token')
                foundUser.refreshToken = [...newRefreshTokenArray];
                const result = await foundUser.save();
                console.log(result);
            }

            if (err || foundUser.name !== decoded.name) {
                return res.sendStatus(403);
            }

            // Refresh token was still valid
            const accessToken = jwt.sign(
                {
                    "name": decoded.name
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
    
            // Saving refreshToken with current user
            foundUser.refreshToken = [...newRefreshTokenArray, newRefreshToken];
            await foundUser.save();

            res.cookie('jwt', newRefreshToken, { httpOnly: true, sameSite: 'None', maxAge: 24 * 60 * 60 * 1000, secure: true }); 

            res.json({ accessToken, name: foundUser.name, toDoList: foundUser.toDoList, userId: foundUser._id });
        }

    ) 
}

module.exports = {
    handleRefreshToken
};