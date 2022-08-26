const User = require('../model/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();

    if (!users) {
        return res.status(204).json({'message': 'No users found.'});
    }

    res.json(users);
}

const createNewUser = async (req, res) => {
    if (!req?.body?.name || !req?.body?.password) {
        return res.status(400).json({'message': 'Some required fields are missed!'});
    }

    try {
        const result = await User.create({
            name: req.body.name,
            password: req.body.password,
            toDoList: []
        });

        res.status(201).json(result);
    } catch (err) {
        console.error(err);
    }
}

const updateUser = async (req, res) => {
    if (!req?.body?.id) {
        return res.status(400).json({'message': 'Id parameter is required.'});
    }

    const user = await User.findOne({ _id: req.body.id }).exec();

    if (!user) {
        return res.status(204).json({"message": `No user matches ID ${req.body.id}.`});
    }

    if (req.body?.name) {
        user.name = req.body.name;
    }

    if (req.body?.password) {
        user.password = req.body.password;
    }

    if (req.body?.toDoItem) {
        user.toDoList = [...user.toDoList, {...req.body.toDoItem, isFinished: false}];
    }

    const result = await user.save();

    res.json(result);
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) {
        res.status(400).json({'message': 'User ID required.'});
    }

    const user = await User.findOne({ _id: req.body.id }).exec();

    if (!user) {
        return res.status(204).json({"message": `No user matches ID ${req.body.id}.`});
    }

    const result = await user.deleteOne({ _id: req.body.id });

    res.json(result);
}

const getUser = async (req, res) => {
    if (!req?.params?.id) {
        res.status(400).json({'message': 'User ID required.'});
    }

    const user = await User.findOne({ _id: req.params.id }).exec();

    if (!user) {
        return res.status(204).json({"message": `No user matches ID ${req.params.id}.`});
    }

    res.json(user);
}

const updateToDoList = async (req, res) => {
    if (!req?.params?.id) {
        return res.status(400).json({'message': 'Id parameter is required.'});
    }

    const user = await User.findOne({ _id: req.params.id }).exec();

    if (!user) {
        return res.status(204).json({"message": `No user matches ID ${req.params.id}.`});
    }

    if (req.body?.toDoList) {
        let updatedToDoList = user.toDoList;

        req.body.toDoList.forEach(element => {
            updatedToDoList = updatedToDoList.filter(item => item._id.toString() !== element);
        });

        user.toDoList = updatedToDoList;
    }

    if (req.body?.finished) {
        user.toDoList.find(toDo => toDo._id.toString() === req.body.finished.id).isFinished = req.body.finished.isFinished;
    }

    const result = await user.save();

    res.json(result);
}

module.exports = {
    getAllUsers,
    createNewUser,
    updateUser,
    deleteUser,
    getUser,
    updateToDoList
}