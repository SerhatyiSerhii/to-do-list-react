import express from 'express';

const port = 8080;
const host = 'localhost';

const app = express();

app.use(express.json());

app.use((_req, res, next) => {
    ['Acces-Control-Allow-Origin', 'Access-Control-ALlow-Methods', 'Access-COntroll-Allow-Headers'].forEach(header => res.setHeader(header, '*'));
    next();
});

let users = [
    {
        name: 'testUser',
        password: '123456789',
        id: 1,
    }
];

app.get('/users/:id', (req, res) => {
    const userIndex = findUserIndex(req, res);

    const user = users[userIndex];

    res.json(user);
});

app.post('/users', (req, res) => {
    const user = req.body.user;

    if (!isUserVaild(user)) {
        res.status(400).json({errorMessage: 'Some required fields are missed!'});
    }

    user.id = Date.now();

    users.push(user);

    res.json(user);
})

app.put('/users/:id', (req, res) => {
    const userIndex = findUserIndex(req, res);

    const user = req.body.user;

    if(!isUserVaild(user)) {
        res.status(400).json({errorMessage: 'Some required fields are missed!'});
    }

    user.id = +req.params.id;

    users[userIndex] = req.body.user;

    res.json(user);
});

app.delete('/users/:id', (req, res) => {
    const userId = +req.params.id;

    if (!users.some(user => user.id === userId)) {
        res.status(400).json({errorMessage: 'User does not exist!'});
        return;
    }

    users = users.filter(user => user.id !== userId);

    res.json({});
});

const isUserVaild = (user) => Boolean(user.name) && Boolean(user.password);

const findUserIndex = (req, res) => {
    const index = users.findIndex((user) => {
        return user.id === +req.params.id;
    });

    if (index === -1) {
        res.status(400).json({errorMessage: 'User does not exist!'});
        return;
    }

    return index;
}

app.listen(port, () => {
    console.log(`Server is running at http://${host}:${port}`);
});