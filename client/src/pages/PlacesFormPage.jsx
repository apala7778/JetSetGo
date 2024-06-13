import React, { useEffect } from 'react';
import { useState } from 'react';
import Perks from './Perks';
import axios from 'axios';
import PhotosUploader from '../PhotosUploader';
import { Navigate, useParams } from 'react-router-dom';
import AccountNav from '../AccountNav';

const PlacesFormPage = () => {
     const {id} = useParams();
    const [title , setTitle] = useState('');
    const [address , setAddress] = useState('');
  
    const [description , setDescription] = useState('');
    const [perks , setPerks] = useState([]);
    const [addedPhotos , setAddedPhotos] = useState([]);
    const [extraInfo , setExtraInfo] = useState('');
    const [checkIn , setCheckIn] = useState('');
    const [checkOut , setCheckOut] = useState('');
    const [maxGuests , setMaxGuests] = useState(0);
    const [price, setPrice] = useState(100);
    const [redirect , setRedirect] = useState(false);


    useEffect(()=> {
        if(!id) {
            return;
        }
         axios.get('/places/'+id).then(response => {
            const {data} = response;
            setTitle(data.title);
            setAddedPhotos(data.photos);
            setAddress(data.address);
            setDescription(data.description);
            setPerks(data.perks);
            setExtraInfo(data.extraInfo);
            setCheckIn(data.checkIn);
            setCheckOut(data.checkOut);
            setMaxGuests(data.maxGuests);
            setPrice(data.price);
         })

    }, [id]);
         

    function inputHeader(text) {
        return (
            <h2 className='text-2xl mt-4'>{text}</h2>
        );
    }

    function inputDescription(text) {
        return (
            <p className='text-gray-500 text-sm'>{text}</p>
        );
    }

    function preInput(header , description) {
        return (
            <>
               {inputHeader(header)}
               {inputDescription(description)}
            </>
        );
    }

   async  function savePlace(ev) {

        ev.preventDefault();
        const placeData = {title , address , addedPhotos , description,
            perks, extraInfo , checkIn , checkOut , maxGuests , price,};
            
         if(id) {
            //update
            await    axios.put('/api/places' ,{id, ...placeData} );
                
                setRedirect(true);
      

         }
         else {
            //add new place
            await    axios.post('/api/places' , placeData );
                
                setRedirect(true);
         }
    
       
  


    }
     
    if(redirect) {
        return <Navigate to={'/account/places'} />
    }

  
         
  return (
    <div>
          <AccountNav/>
          <div>

                            <form  onSubmit={savePlace}>
                            
                            {preInput('Title' , 'Title for your place. Should be catchy & short as in advertisement')}
                            <input type='text' value={title} onChange={ev => setTitle(ev.target.value)} placeholder="title : , for example My lovely apt" />
                            {preInput('Address' , 'Address to the place')}

                            <input type='text' value={address} onChange={ev => setAddress(ev.target.value)} placeholder='address' />
                            
                            {preInput('Photos' ,'more = better')}
                                <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos} />
                            {preInput('Description' , 'Description of the Place')}
                            <textarea  value={description} onChange={ev => setDescription(ev.target.value)} />
                            {preInput('Perks' , 'select all the perks of your place')}
                            
                                <Perks selected={perks} onChange={setPerks} />
                            {preInput('Extra info' , 'House rules , etc')}

                                <textarea  value={extraInfo} onChange={ev => setExtraInfo(ev.target.value)}/> 
                                {preInput('Check In & Out' , 'add check in and out time, remeber to give room for cleaning time for guests')}
                            
                            <div className='grid  gap-2 grid-cols-2 md:grid-cols-4'>
                                <div >
                                    <h3 className='mt-2 -mb-1'>Check in time</h3>
                                    <input value={checkIn} onChange={ev => setCheckIn(ev.target.value)} type='text' placeholder='14:00' />
                                </div>
                                <div >
                                    <h3 className='mt-2 -mb-1'>Check out time</h3>
                                    <input value={checkOut} onChange={ev => setCheckOut(ev.target.value)} type='text' placeholder='19:00' />
                                </div>
                                <div >
                                    <h3 className='mt-2 -mb-1'>Check in time</h3>
                                    <input value={maxGuests} onChange={ev => setMaxGuests(Number(ev.target.value))} type='number' placeholder='1' />
                                </div>
                                <div >
                                    <h3 className='mt-2 -mb-1'>Price per night</h3>
                                    <input value={price} onChange={ev => setPrice(Number(ev.target.value))} type='number' placeholder='100' />
                                </div>

                            </div>
                            <button className='primary my-4'>Save</button>
                            
                            </form>
                            </div>
                                </div>
  )
}

export default PlacesFormPage
