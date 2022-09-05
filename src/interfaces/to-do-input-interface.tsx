import { ChangeEvent } from "react";

export interface ToDoInputInterface {
    handleChange: (event: ChangeEvent<HTMLInputElement>) => void;
    nameRef: any;
    pwdRef: any;
    checkPwdRef: any;
}