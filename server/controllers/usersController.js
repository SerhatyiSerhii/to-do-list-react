const data = {
    users: require('../model/users.json'),
    setUsers: function (data) { this.users = data }
}

const getAllUsers = (req, res) => {
    res.json(data.users);
}

const createNewUser = (req, res) => {
    const newUser = {
        id: data.users[data.users.length - 1].id + 1 || 1,
        name: req.body.name,
        password: req.body.password,
    }

    if (!isUserVaild(newUser)) {
        return res.status(400).json({errorMessage: 'Some required fields are missed!'});
    }

    data.setUsers([...data.users, newUser]);
    res.status(201).json(newUser);
}

const updateUser = (req, res) => {
    const user = data.users.find(user => user.id === +req.body.id);

    if (!user) {
        return res.status(400).json({"message": `User ID ${req.body.id} not found`})
    }

    if (req.body.name) {
        user.name = req.body.name;
    }

    if (req.body.password) {
        user.password = req.body.password;
    }

    const filteredArr = data.users.filter(user => user.id !== +req.body.id);
    const unsortedArr = [...filteredArr, user];

    data.setUsers(unsortedArr.sort((a, b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.users);
}

const deleteUser = (req, res) => {
    const user = data.users.find(user => user.id === +req.body.id);

    if (!user) {
        return res.status(400).json({"message": `User ID ${req.body.id} not found`})
    }

    const filteredArr = data.users.filter(user => user.id !== +req.body.id);

    data.setUsers([...filteredArr]);

    res.json(data.users);
}

const getUser = (req, res) => {
    const user = data.users.find(user => user.id === +req.params.id);

    if (!user) {
        return res.status(400).json({"message": `User ID ${req.params.id} not found`})
    }

    res.json(user);
}

const isUserVaild = (user) => Boolean(user.name) && Boolean(user.password);

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser
}