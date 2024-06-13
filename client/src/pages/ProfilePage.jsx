// @ts-nocheck
import React, { useState } from 'react';
import {Link, Navigate, useLocation, useParams} from "react-router-dom";
import { UserContext } from '../userContext';
import { useContext } from 'react';
import axios from 'axios'; 

import Place from './PlacesPage';
import Accountt from '../AccountNav';

export default function ProfilePage() {
  const [redirect , setRedirect] = useState(null);
  const {ready,user , setUser } = useContext(UserContext);
 

   async function logout() {
      await axios.post('/logout');
      
      setRedirect('/');
      setUser(null);
   }

   if(redirect) {
      return <Navigate to={redirect} />
   }
   

  if( ready && !user && !redirect) {
    return <Navigate to={'/login'} />
  }
  const {pathname} = useLocation();
     console.log(pathname)
  let subpage = pathname.split('/')?.[2];
      console.log(subpage)
  if (subpage === undefined) {
    subpage = 'profile';
  }
  
  return (
    <div>
      <Accountt />
    
   { subpage === 'profile' &&  (
      <div className='text-center max-w-lg mx-auto'>
          logged in as {user.name} ({user.email}) <br/>
          <button onClick={logout} className='primary'>Logout</button>

        </div>

   )}

   { subpage === 'places' && (
    <div> 
      <Place />
    </div>

   )}
     
    </div>
  );
}