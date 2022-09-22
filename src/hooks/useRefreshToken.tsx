import axios from "../api/axios";
import useAuth from "./useAuth";

const useRefreshToken = () => {
    const { setAuth } = useAuth();

    const refresh = async () => {
        const response = await axios.get('/refresh', {
            withCredentials: true
        });

        setAuth((prev: any) => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return {
                ...prev,
                name: response.data.name,
                accessToken: response.data.accessToken,
                toDoList: response.data.toDoList,
                userId: response.data.userId
            }
        });

        return response.data.accessToken;
    }   
    
    return refresh;
}

export default useRefreshToken;