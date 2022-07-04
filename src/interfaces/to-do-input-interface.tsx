import { ChangeEvent } from "react";

export interface ToDoInputInterface {
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
}