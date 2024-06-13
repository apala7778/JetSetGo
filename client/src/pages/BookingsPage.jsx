import React, { useEffect, useState } from 'react'
import AccountNav from '../AccountNav';
import axios from 'axios';
import PlaceImg from '../PlaceImg';
import { differenceInCalendarDays, format } from 'date-fns';
import { Link } from 'react-router-dom';


const BookingsPage = () => {
  const[bookings , setBookings] = useState([]);

 useEffect(()=> {
       axios.get('/bookings').then(response => {
        setBookings(response.data);
       })
 },[])

  return (
    <div>
        <AccountNav />
        <div>
            {
              bookings?.length > 0 && bookings.map(booking => (
                <Link to={`/account/bookings/${booking._id}`} className='flex gap-4 bg-grey-200 rounded-2xl overflow-hidden'>
                  <div className='w-48'>
                    <PlaceImg place={booking.place} />
                    </div>
                    <div className='py-3'>
                      <h2 className="text-xl">{booking.place.title}</h2>
                      <div className="flex gap-2 items-center border-t border-gray-300 mt-2 py-2">
                      {format(new Date(booking.checkIn), 'yyyy-MM-dd')} &rarr; {format(new Date(booking.checkIn), 'yyyy-MM-dd')}  nights <br />
                      </div>
                      <div className='text-xl'>
                        Number of{differenceInCalendarDays(new Date(booking.checkIn), new Date(booking.checkOut))}
                          Total price: ${booking.price}
                        </div>

                     
                 
                      </div>
                 </Link>
              ))
            }
        </div>
    </div>
  )
}

export default BookingsPage
