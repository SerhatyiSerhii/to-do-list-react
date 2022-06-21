import { ToDoTaskInterface } from "./to-do-task-interface";

export interface ToDoStateInterface {
    listOfTasks: ToDoTaskInterface[],
    inputValue: string | undefined
}