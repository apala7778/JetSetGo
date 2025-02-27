import React, { useEffect } from 'react';
import {createContext , useState } from 'react';
import axios from 'axios';

export const UserContext = createContext({});

 export  function UserContextProvider({children}) {

    
    const [user, setUser] = useState(null);
    const [ready , setReady] = useState(false);

    useEffect(()=>{
            axios.get('/api/profile').then(({data})=> {
                setUser(data);
                setReady(true);
            })
    }, []) 
    return (
        < UserContext.Provider value={{user,setUser , ready}} >
            {children}
        </UserContext.Provider>
    );
 }
