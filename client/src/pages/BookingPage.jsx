import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import axios from 'axios';


const BookingPage = () => {
    const {id} = useParams();
     const[booking , setBooking] = useState(null);
     useEffect(()=> {
        if(id) {
          axios.get('/bookings').then(response=> {
            const foundBooking  =  response.data.find(({_id})=> {
              _id === id
           })
               if(foundBooking) {
                setBooking(foundBooking)
               }
          }
        
            ) 
        };
     },[id]);

     if(!booking) {
      return '';
     }
  return (
    <div>
         Booking Id : {id}
    </div>
  )
}

export default BookingPage
