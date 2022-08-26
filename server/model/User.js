const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    toDoList: [
        {
            toDo: String,
            isFinished: Boolean
        }
    ],
    refreshToken: String
});

module.exports = mongoose.model('Data_base_user', userSchema);