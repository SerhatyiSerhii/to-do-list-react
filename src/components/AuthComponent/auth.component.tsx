
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ButtonComponent from "../ButtonComponent/button.component";
import InputsComponent from "../InputsComponent/inputs.component";
import axios from "../../api/axios";
import useAuth from "../../hooks/useAuth";

const AUTH_URL = '/auth';
const REGISTER_URL = '/register';

export function AuthComponent() {
    const nameRef = useRef();
    const pwdRef = useRef();
    const checkPwdRef = useRef();

    const { setAuth, persist, setPersist } = useAuth();
    const [nameErrors, setNameErrors] = useState<boolean | undefined>(true);
    const [passwordErrors, setPasswordErrors] = useState<boolean | undefined>(true);
    const [confirmPwd, setConfirmPwdErrors] = useState<boolean | undefined>(true);
    const [invalid, setInvalid] = useState<boolean>(true);
    const [name, setName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [checkPwd, setCheckPwd] = useState<string>('');

    let navigate = useNavigate();

    useEffect(() => {
        if (document.querySelector('.confirm-password')) {
            setInvalid((!nameErrors && !passwordErrors && !confirmPwd) ? false : true);
        } else {
            setInvalid((!nameErrors && !passwordErrors) ? false : true);
        }
    }, [nameErrors, passwordErrors, confirmPwd]);

    useEffect(() => {
        setConfirmPwdErrors(password === checkPwd ? false : true);
    }, [password, checkPwd]);

    const handleInput = (event: ChangeEvent<HTMLInputElement>): void => {
        if (event.target.className === 'name-input') {
            setNameErrors(event.target.value.trim() ? false : true);
            setName(event.target.value.trim());
        } else if (event.target.className === 'password-input') {
            setPasswordErrors(event.target.value.trim() ? false : true);
            setPassword(event.target.value.trim());
        } else {
            setCheckPwd(event.target.value.trim());
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
                    headers: { 'Content-Type': 'application/json', },
                    withCredentials: true
                }
            );
            const accessToken = result.data.accessToken;
            const toDoList = result.data.toDoList;
            const userId = result.data.userId;
            setAuth({ name, password, accessToken, toDoList, userId });
            navigate('/list', { replace: true });
        } catch (err) {
            console.error(err);
        }
    }

    const handleSignUp = (event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined): void => {
        event?.preventDefault();

        setName('');
        setNameErrors(true);
        setPassword('');
        setPasswordErrors(true);

        (nameRef.current as any).value = '';
        (pwdRef.current as any).value = '';

        navigate('/sign-up', { replace: true });
    }

    const handleBackClick = (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined): void => {
        event?.preventDefault();

        setName('');
        setNameErrors(true);
        setPassword('');
        setPasswordErrors(true);
        setCheckPwd('');
        setConfirmPwdErrors(true);

        (nameRef.current as any).value = '';
        (pwdRef.current as any).value = '';
        (checkPwdRef.current as any).value = '';

        navigate('/', { replace: true });
    }

    const handleNewUser = async (event?: React.MouseEvent<HTMLButtonElement, MouseEvent> | undefined): Promise<void> => {
        event?.preventDefault();

        try {
            const result = await axios.post(REGISTER_URL,
                JSON.stringify({
                    name,
                    password
                }),
                {
                    headers: { 'Content-Type': 'application/json', },
                    withCredentials: true
                }
            );

            const accessToken = result.data.accessToken;
            const toDoList = result.data.toDoList;
            const userId = result.data.userId;
            setAuth({ name, password, accessToken, toDoList, userId });

            navigate('/list', { replace: true });
        } catch (err) {
            console.log(err);
        }
    }

    const togglePersist = () => {
        setPersist((prev: any) => !prev);
    }

    useEffect(() => {
        localStorage.setItem('persist', persist);
    }, [persist]);

    return (
        <div className="auth-container">
            <form onSubmit={() => handleSignIn()}>
                <InputsComponent handleChange={handleInput} nameRef={nameRef} pwdRef={pwdRef} checkPwdRef={checkPwdRef} />
                <div className="auth-form-btns">
                    {
                        window.location.pathname === '/' ?
                            <React.Fragment>
                                <div className="btns-message">Please sign in</div>
                                <div className="btns">
                                    <ButtonComponent handleClick={handleSignIn} invalid={invalid} text={'Sign in'} />
                                    <ButtonComponent handleClick={handleSignUp} text={'Sign up'} />
                                </div>
                                <div className="persist-check">
                                    <input type="checkbox" id="persist" onChange={togglePersist} checked={persist}/>
                                    <label htmlFor="persist">Trust this device</label>
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