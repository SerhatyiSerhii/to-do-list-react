import React from "react";
import { ToDoButtonInterface } from "../../interfaces/to-do-button-interface";

export default function ButtonComponent(props: ToDoButtonInterface): JSX.Element {
    return (
        <button onClick={(e) => props.handleClick(e)} disabled={props.invalid}>
            {props.text}
        </button>
    );
}