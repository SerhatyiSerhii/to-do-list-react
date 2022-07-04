import React from "react";
import { ToDoItemPropsInterface } from "../../interfaces/to-do-item-props-interface";
import { ToDoTaskInterface } from "../../interfaces/to-do-task-interface";

export default function ToDoItemComponent(props: ToDoItemPropsInterface): JSX.Element {
    return (
        <React.Fragment>
            {
                props.listOfTasks.map((task: ToDoTaskInterface, index: number) => (
                    <li key={task.taskId} className={task.taskCompleted ? 'fulfilled' : ''}>
                        <input type='checkbox' onClick={(event) => props.onCheckboxClick(task.taskId, event)} />
                        {`${index + 1} ${task.taskDescription}`}
                    </li>
                ))
            }
        </React.Fragment>
    );
}