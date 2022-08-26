
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../ButtonComponent/button.component";
import InputsComponent from "../InputsComponent/inputs.component";
import axios from "../../api/axios";
import AuthContext from "../../context/AuthProvider";

const AUTH_URL = '/auth';

export function AuthComponent() {
    const { setAuth }  = React.useContext(AuthContext) as any;
    const [nameErrors, setNameErrors] = useState<boolean | undefined>(true);
    const [passwordErrors, setPasswordErrors] = useState<boolean | undefined>(true);
    const [invalid, setInvalid] = useState<boolean>(true);
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [accessToken, setAccessToken] = useState<string>('');

    let navigate = useNavigate();

    useEffect(() => {
        setInvalid((!nameErrors && !passwordErrors) ? false : true);
    }, [nameErrors, passwordErrors]);

    const handleInput = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.className === 'name-input') {
            setNameErrors(event.target.value.trim() ? false : true);
            setName(event.target.value.trim());
        } else {
            setPasswordErrors(event.target.value.trim() ? false : true);
            setPassword(event.target.value.trim());
        }
    }

    const handleSignIn = async (event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined) => {
        event?.preventDefault();

        try {
            const result = await axios.post(AUTH_URL,
                JSON.stringify({
                    name,
                    password
                }),
                {
                    headers: {'Content-Type': 'application/json',},
                    withCredentials: true
                }
            );
            const accessToken = result.data.accessToken;
            const toDoList = result.data.toDoList;
            const userId = result.data.userId;
            setAuth({name, password, accessToken, toDoList, userId});
            navigate('/list', { replace: true });
        } catch (err) {
            console.error(err);
        }
    }

    const handleSignUp = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined): void => {
        event?.preventDefault();
        navigate('/sign-up', { replace: true });
    }

    const handleBackClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined): void => {
        event?.preventDefault();
        navigate('/', { replace: true });
    }

    const handleNewUser = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined): void => {
        event?.preventDefault();
        navigate('/list', { replace: true });
    }

    return (
        <div className="auth-container">
            <form onSubmit={() => handleSignIn()}>
                <InputsComponent handleChange={handleInput} />
                <div className="auth-form-btns">
                    {
                        window.location.pathname === '/' ?
                            <React.Fragment>
                                <div className="btns-message">Please sign in</div>
                                <div className="btns">
                                    <ButtonComponent handleClick={handleSignIn} invalid={invalid} text={'Sign in'} />
                                    <ButtonComponent handleClick={handleSignUp} text={'Sign up'} />
                                </div>
                            </React.Fragment> :
                            <React.Fragment>
                                <div className="btns-message">Please sign up</div>
                                <div className="btns">
                                    <ButtonComponent handleClick={handleNewUser} invalid={invalid} text={'Create User'} />
                                    <ButtonComponent handleClick={handleBackClick} text={'Back'} />
                                </div>
                            </React.Fragment>
                    }
                </div>
            </form>
        </div>
    );
}