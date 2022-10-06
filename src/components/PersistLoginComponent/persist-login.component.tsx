import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import useRefreshToken from "../../hooks/useRefreshToken";
import useAuth from "../../hooks/useAuth";
import React from "react";
import useLocalStorage from "../../hooks/useLocalStorage";

const PersistLogin = (): JSX.Element => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const { auth } = useAuth();
    const [persist] = useLocalStorage('persist', false);

    useEffect(() => {
        let isMounted = true;

        const verifyRefreshToken = async () => {
            try {
                await refresh();
            }
            catch (err) {
                console.error(err);
            }
            finally {
                isMounted && setIsLoading(false);
            }
        }

        !auth?.accessToken ? verifyRefreshToken() : setIsLoading(false);

        return () => {
            isMounted = false;
        }
    }, []);

    return (
        <>
            
            {
                !persist
                    ? <Outlet />
                    : isLoading 
                        ? <div className="container-text">
                            <p className="loading-text">Loading...</p>
                          </div>
                        : <Outlet />
            }
        </>
    )
}

export default PersistLogin;