import React from "react";
import { ToDoInputInterface } from "../../interfaces/to-do-input-interface";

export default function InputsComponent(props: ToDoInputInterface): JSX.Element {
    return (
        <React.Fragment>
            <div className="auth-input name">
                <label>
                    User name
                    <input className="name-input" type="text" onChange={(e) => props.handleChange(e)}></input>
                </label>
            </div>
            <div className="auth-input password">
                <label>
                    User password
                    <input className="password-input" type="text" onChange={(e) => props.handleChange(e)}></input>
                </label>
            </div>
        </React.Fragment>
    );
}
