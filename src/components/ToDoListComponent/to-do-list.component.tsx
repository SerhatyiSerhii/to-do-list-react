import React from "react";
import { ToDoStateInterface } from "../../interfaces/to-do-state-interface";
import { ToDoTaskInterface } from "../../interfaces/to-do-task-interface";
import ToDoItemComponent from "../ToDoItemComponent/to-do-item.component";
import AuthContext from "../../context/AuthProvider";
import axios from "../../api/axios";

const PUT_URL = '/users/';

export class ToDoListComponent extends React.Component<{}, ToDoStateInterface> {
    static contextType = AuthContext;
    context!: React.ContextType<typeof AuthContext>;

    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            listOfTasks: [],
            inputValue: '',
        }

        this.addToDoItem = this.addToDoItem.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
        this.removeFulfilledToDoItems = this.removeFulfilledToDoItems.bind(this);
    };

    componentDidMount() {
        const { auth } = this.context as any;

        this.setState({
            listOfTasks: auth.toDoList
        })
    }

    async addToDoItem(): Promise<void> {
        try {
            const result = await axios.put(
                PUT_URL,
                JSON.stringify({
                    id: (this.context as any).auth.userId,
                    toDoItem: { toDo: this.state.inputValue }
                }),
                {
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer ' + (this.context as any).auth.accessToken
                    },
                    withCredentials: true
                }
            );

            this.setState({
                listOfTasks: result.data.toDoList,
                inputValue: ''
            });
        } catch (err) {
            console.error(err)
        }
    }

    async removeFulfilledToDoItems(): Promise<void> {
        const listOfToDoItems = this.state.listOfTasks.slice();

        const fulfilledToDoItems = listOfToDoItems.filter((toDoItem: ToDoTaskInterface) => {
            return toDoItem.isFinished === true;
        }).map((toDoItem: ToDoTaskInterface) => toDoItem._id);

        try {
            const result = await axios.put(
                PUT_URL + (this.context as any).auth.userId,
                JSON.stringify({
                    toDoList: [...fulfilledToDoItems]
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + (this.context as any).auth.accessToken
                    }
                }
            );

            this.setState({
                listOfTasks: result.data.toDoList
            })
        } catch (err) {
            console.error(err);
        }
    }

    onInputChange(event: { target: { value: string | undefined } }): void {
        const taskInputValue = event.target.value

        this.setState({
            inputValue: taskInputValue,
        });
    }

    async handleCheckboxClick(toDoItemId: number | undefined, event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        try {
            const result = await axios.put(
                PUT_URL + (this.context as any).auth.userId,
                JSON.stringify({
                    finished: {
                        id: toDoItemId,
                        isFinished: event.target.checked
                    }
                }),
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + (this.context as any).auth.accessToken
                    },
                    withCredentials: true
                }
            );

            this.setState({
                listOfTasks: result.data.toDoList,
            });
        } catch (err) {
            console.error(err);
        }
    }

    render(): JSX.Element {
        return (
            <div className='container' >
                <div className='task-enter'>
                    <input onChange={this.onInputChange} value={this.state.inputValue}></input>
                    <div className='task-btns'>
                        <button onClick={this.addToDoItem}>Add new task</button>
                        <button onClick={this.removeFulfilledToDoItems}>Remove fulfilled tasks</button>
                    </div>
                </div>
                <div className='tasks-list'>
                    <div>List of tasks to do:</div>
                    <ul>
                        <ToDoItemComponent listOfTasks={this.state.listOfTasks} onCheckboxClick={this.handleCheckboxClick} />
                    </ul>
                </div>
            </div>
        );
    }
}