import React from "react";
import { ToDoInputInterface } from "../../interfaces/to-do-input-interface";

export default function InputsComponent(props: ToDoInputInterface): JSX.Element {
    return (
        <React.Fragment>
            <div className="auth-input name">
                <label>
                    User name
                    <input className="name-input" type="text" onChange={(e) => props.handleChange(e)} ref={props.nameRef} value={props.value}></input>
                </label>
            </div>
            <div className="auth-input password">
                <label>
                    User password
                    <input className="password-input" type="password" onChange={(e) => props.handleChange(e)} ref={props.pwdRef}></input>
                </label>
            </div>

            {
                window.location.pathname === '/sign-up' &&
                <div className="auth-input confirm-password">
                    <label>
                        Confirm password
                        <input className="confirm-password-input" type="password" onChange={(e) => props.handleChange(e)} ref={props.checkPwdRef}></input>
                    </label>
                </div>
            }
        </React.Fragment>
    );
}
