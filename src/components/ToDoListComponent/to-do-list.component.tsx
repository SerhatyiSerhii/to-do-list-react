import React from "react";
import { ToDoStateInterface } from "../../interfaces/to-do-state-interface";
import { ToDoTaskInterface } from "../../interfaces/to-do-task-interface";
import ToDoItemComponent from "../ToDoItemComponent/to-do-item.component";
import AuthContext from "../../context/AuthProvider";

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
    }

    componentDidMount() {
        const { auth } = this.context as any;

        this.setState({
            listOfTasks: auth.toDoList,
        });
    }

    async addToDoItem(inputValue: string | undefined): Promise<void> {
        (this.props as any).addToDoItem(inputValue).then((response: any) => {
            this.setState({
                listOfTasks: response.data.toDoList,
                inputValue: ''
            });
        });
    }

    async removeFulfilledToDoItems(listOfTasks: ToDoTaskInterface[]): Promise<void> {
        (this.props as any).removeFulfilledToDoItems(listOfTasks).then((response: any) => {
            this.setState({
                listOfTasks: response.data.toDoList
            });
        });
    }

    onInputChange(event: { target: { value: string | undefined } }): void {
        const taskInputValue = event.target.value

        this.setState({
            inputValue: taskInputValue,
        });
    }

    async handleCheckboxClick(toDoItemId: number | undefined, event: React.ChangeEvent<HTMLInputElement>): Promise<void> {
        try {
            (this.props as any).handleCheckboxClick(toDoItemId, event).then((result: any) => {
                if (result) {
                    this.setState({
                        listOfTasks: result.data.toDoList,
                    });
                }                
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
                        <button onClick={() => this.addToDoItem(this.state.inputValue)}>Add new task</button>
                        <button onClick={() => this.removeFulfilledToDoItems(this.state.listOfTasks)}>Remove fulfilled tasks</button>
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