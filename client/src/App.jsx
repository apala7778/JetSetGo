import React from 'react';
import axios from "axios";

import { Route , Routes } from 'react-router-dom';
import './App.css'
import IndexPage from './pages/indexPage.jsx';
import LoginPage from './pages/loginPage';
import Layout from './Layout';
import RegisterPage from './pages/RegisterPage';

import  {UserContextProvider} from './userContext'
import ProfilePage from './pages/ProfilePage';
import PlacesPage from './pages/PlacesPage';
import PlacesFormPage from './pages/PlacesFormPage';
import PlacePage from './pages/PlacePage';
import BookingPage from './pages/BookingPage';

import BookingsPage from './pages/BookingsPage';

axios.defaults.baseURL = 'http://127.0.0.1:4000';

axios.defaults.withCredentials = true;

function App() {

   return (
     <UserContextProvider>

      <Routes>
      <Route path="/" element={<Layout/>} >
      <Route index element={<IndexPage/>}  />
      <Route path="/login" element={<LoginPage/>} />
      <Route path="/register" element={<RegisterPage/>} />
      <Route path="/account" element={<ProfilePage/>} />
      <Route path="/account/places" element={<PlacesPage/>} />
      <Route path="/account/places/new" element={<PlacesFormPage/>} />
      <Route path="/account/places/:id" element={<PlacesFormPage/>} />
      <Route path="/place/:id" element={<PlacePage/>} />
      <Route path="/account/bookings" element={<BookingPage/>} />
      <Route path="/account/bookings/:id" element={<BookingsPage/>} />
  
      </Route>
   
     </Routes>
     </UserContextProvider>
    
   )
}

export default App
