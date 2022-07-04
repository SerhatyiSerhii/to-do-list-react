import React from "react";
import { ToDoStateInterface } from "../../interfaces/to-do-state-interface";
import { ToDoTaskInterface } from "../../interfaces/to-do-task-interface";
import ToDoItemComponent from "../ToDoItemComponent/to-do-item.component";

let uniqueIdNumber = 0;

function uniqueIdNumberGenerator(): number {
    return uniqueIdNumber++;
}

export class ToDoListComponent extends React.Component<{}, ToDoStateInterface> {
    constructor(props: {} | Readonly<{}>) {
        super(props);

        this.state = {
            listOfTasks: [
                {
                    taskId: uniqueIdNumberGenerator(),
                    taskDescription: 'Buy milk',
                    taskCompleted: false,
                },
                {
                    taskId: uniqueIdNumberGenerator(),
                    taskDescription: 'Buy bread',
                    taskCompleted: false,
                },
                {
                    taskId: uniqueIdNumberGenerator(),
                    taskDescription: 'Feed cat',
                    taskCompleted: false,
                },
            ],
            inputValue: '',
        }

        this.addToDoItem = this.addToDoItem.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.handleCheckboxClick = this.handleCheckboxClick.bind(this);
        this.removeFulfilledToDoItems = this.removeFulfilledToDoItems.bind(this);
    };

    addToDoItem(): void {
        const listOfToDoItems = this.state.listOfTasks.slice();

        const newToDoItem = {
            taskId: uniqueIdNumberGenerator(),
            taskDescription: this.state.inputValue,
            taskCompleted: false,
        }

        listOfToDoItems.push(newToDoItem);

        this.setState({
            listOfTasks: listOfToDoItems,
            inputValue: ''
        })
    }

    removeFulfilledToDoItems(): void {
        const listOfToDoItems = this.state.listOfTasks.slice();

        const unfulfilledToDoItems = listOfToDoItems.filter((toDoItem: { taskCompleted: boolean; }) => {
            return toDoItem.taskCompleted !== true;
        });

        this.setState({
            listOfTasks: unfulfilledToDoItems,
        })
    }

    onInputChange(event: { target: { value: string | undefined } }): void {
        const taskInputValue = event.target.value

        this.setState({
            inputValue: taskInputValue,
        });
    }

    handleCheckboxClick(toDoItemId: number, event: React.MouseEvent<HTMLInputElement, MouseEvent>): void {
        const listOfToDoItems = this.state.listOfTasks.slice();

        const updatedListOfTasks = listOfToDoItems.map((listItem: ToDoTaskInterface) => {
            if (listItem.taskId === toDoItemId) {
                listItem.taskCompleted = (event.target as HTMLInputElement).checked;
            }

            return listItem;
        });

        this.setState({
            listOfTasks: updatedListOfTasks
        });
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