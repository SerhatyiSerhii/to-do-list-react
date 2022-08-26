import { ToDoTaskInterface } from "./to-do-task-interface";

export interface ToDoItemPropsInterface {
    listOfTasks: ToDoTaskInterface[],
    onCheckboxClick: (toDoItemId: number | undefined, event: React.ChangeEvent<HTMLInputElement>) => void
}