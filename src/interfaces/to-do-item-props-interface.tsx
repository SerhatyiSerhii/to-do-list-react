import { ToDoTaskInterface } from "./to-do-task-interface";

export interface ToDoItemPropsInterface {
    listOfTasks: ToDoTaskInterface[],
    onCheckboxClick: (toDoItemId: number, event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
}