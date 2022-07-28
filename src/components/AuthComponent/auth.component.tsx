
import React, { ChangeEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../ButtonComponent/button.component";
import InputsComponent from "../InputsComponent/inputs.component";

export function AuthComponent() {
    const [nameErrors, setNameErrors] = useState<boolean | undefined>(true);
    const [passwordErrors, setPasswordErrors] = useState<boolean | undefined>(true);
    const [invalid, setInvalid] = useState<boolean>(true);
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');

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

    const handleSignIn = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined): void => {
        event?.preventDefault();
        fetch('http://localhost:8080/auth', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
                name,
                password
            })
        }).then(res => res.json()).then(() => navigate('/list', { replace: true }));
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