import React, { useContext, useEffect } from "react";
import { ToDoListComponent } from "../ToDoListComponent/to-do-list.component";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import AuthContext from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { ToDoTaskInterface } from "../../interfaces/to-do-task-interface";

export default function ToDoListWithHookComponent(props: any): JSX.Element {
    const axiosPrivate = useAxiosPrivate();
    const context = useContext(AuthContext);
    const controller = new AbortController();
    const navigate = useNavigate();

    const PUT_URL = '/users/';

    useEffect(() => {
        return () => {
            controller.abort();
        }
    }, []);

    const handleCheckboxClick = async (toDoItemId: number | undefined, event: React.ChangeEvent<HTMLInputElement>): Promise<any> => {
        try {
            const result = await axiosPrivate.put(
                PUT_URL + (context as any).auth.userId,
                JSON.stringify({
                    finished: {
                        id: toDoItemId,
                        isFinished: event.target.checked
                    }
                }),
                {
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + (context as any).auth.accessToken
                    },
                    withCredentials: true
                }
            );
    
            return result;
        } catch (err) {
            console.error(err);
            navigate('/', { replace: true });
        }
    }

    const addToDoItem = async (inputValue: string): Promise<any> => {
        try {
            const result = await axiosPrivate.put(
                PUT_URL,
                JSON.stringify({
                    id: (context as any).auth.userId,
                    toDoItem: { toDo: inputValue }
                }),
                {
                    signal: controller.signal,
                    headers: {
                        'Content-type': 'application/json',
                        'Authorization': 'Bearer ' + (context as any).auth.accessToken
                    },
                    withCredentials: true
                }
            );


            return result;
        } catch (err) {
            console.error(err);
            navigate('/', { replace: true });
        }
    }

    const removeFulfilledToDoItems = async (listOfTasks: ToDoTaskInterface[]): Promise<any> => {
        const listOfToDoItems = listOfTasks.slice();

        const fulfilledToDoItems = listOfToDoItems.filter((toDoItem: ToDoTaskInterface) => {
            return toDoItem.isFinished === true;
        }).map((toDoItem: ToDoTaskInterface) => toDoItem._id);

        try {
            const result = await axiosPrivate.put(
                PUT_URL + (context as any).auth.userId,
                JSON.stringify({
                    toDoList: [...fulfilledToDoItems]
                }),
                {
                    signal: controller.signal,
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + (context as any).auth.accessToken
                    }
                }
            );

            return result;
        } catch (err) {
            console.error(err);
            navigate('/', { replace: true });
        }
    }

    return <ToDoListComponent {...props} handleCheckboxClick={handleCheckboxClick} addToDoItem={addToDoItem} removeFulfilledToDoItems={removeFulfilledToDoItems}/>
}