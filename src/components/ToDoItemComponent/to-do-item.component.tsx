import React from "react";
import { ToDoItemPropsInterface } from "../../interfaces/to-do-item-props-interface";
import { ToDoTaskInterface } from "../../interfaces/to-do-task-interface";

export default function ToDoItemComponent(props: ToDoItemPropsInterface): JSX.Element {
    return (
        <React.Fragment>
            {
                props.listOfTasks.map((task: ToDoTaskInterface, index: number) => (
                    <li key={task._id} className={task.isFinished ? 'fulfilled' : ''}>
                        <input type='checkbox' defaultChecked={task.isFinished} onChange={(event) => props.onCheckboxClick(task._id, event)} />
                        {`${index + 1} ${task.toDo}`}
                    </li>
                ))
            }
        </React.Fragment>
    );
}