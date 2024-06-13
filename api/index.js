
const express = require('express');
const cors = require('cors');
require('dotenv').config();


const mongoose = require('mongoose');
const connectDB = require('./db/Connect')
const User = require('./models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const imageDownloader = require('image-downloader');
const multer = require('multer');
const fs = require('fs');
const Place = require('./models/Place');
const Booking = require('./models/Booking');
const app = express();

const PORT = process.env.PORT || 4000;
app.use(express.json());
app.use(cookieParser());
const bcryptSalt = bcrypt.genSaltSync(10);

app.use('/uploads' , express.static(__dirname+'/uploads'));

app.use(cors({
  origin: 'http://localhost:5173', // Replace with your frontend URL
  credentials: true,
}));
 


function getUserDataFromToken (req) {
  return new Promise((resolve , reject)=> {
    jwt.verify(req.cookies.token , process.env.jWT_SECRET , {} , async(err , userData)=>{
      if(err) throw err;
      resolve(userData);
      
  });

  });
}







app.get('/test' , (req, res)=> {
    res.json('test ok')
});

app.post('/api/register' ,  async ( req, res)=> {
  
    const { name , email , password} = req.body;
    try {
        const user = await User.create({ 
            name ,
            email ,
           password: bcrypt.hashSync(password , bcryptSalt),
         });
       
        //  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5173');
        //  res.setHeader('Access-Control-Allow-Credentials', 'true');
         
      res.json(user);
    }
    catch(error) {
        res.status(422).json(error);
    }
   
});

app.post('/api/login', async (req,res) => {
 
  const {email,password} = req.body;
  
  const userDoc = await User.findOne({email});
 
  if (userDoc) {
    const passOk = bcrypt.compareSync(password, userDoc.password);
    if (passOk) {
      jwt.sign({
        email:userDoc.email,
        id:userDoc._id
      }, process.env.JWT_SECRET, {}, (err,token) => {
        if (err) throw err;
        res.cookie('token', token).json(userDoc);
      });
    } else {
      res.status(422).json('pass not ok');
    }
  } else {
    res.json('not found');
  }
});

app.get('/api/profile', (req,res) => {
 
  const {token} = req.cookies;
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
      if (err) throw err;
      const {name,email,_id} = await User.findById(userData.id);
      res.json({name,email,_id});
    });
  } else {
    res.json(null);
  }
});


app.post('/logout' , (req , res)=>{
    res.cookie('token' , '').json(true);
})

app.post('/api/upload-by-link' , async (req , res)=>{
     const {link} = req.body;
     try {
      const newName = 'photo' + Date.now() + '.jpg' ;
   await  imageDownloader.image ({
      url : link ,
      dest: __dirname + '/uploads',


     });
     res.json( newName)
     }
     catch(error) {
      res.json(error)
     }
     


})

const photoMiddleware = multer({dest:'uploads/'});

app.post('/api/upload' , photoMiddleware.array('photos' , 100) , (req, res)=>{
   const uploadedFiles =[];
   
 
  for(let i=0; i < req.files.length;  i++)  {
    const { path , originalname} = req.files[i];
   const parts = originalname.split('.');
   const ext = parts[parts.length-1];
   const newPath = path + '.' + ext;

    fs.renameSync(path , newPath);
    uploadedFiles.push(newPath.replace('uploads/',''));


  }
  res.json(uploadedFiles );
});


app.post('/api/places' , (req, res)=>{
  const { token} = req.cookies;
  const { title ,address , addedPhotos , description ,
  perks , extraInfo , checkIn , checkOut , maxGuests , price } = req.body;

  jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
    if (err) throw err;

   const placeDoc = await Place.create({
          owner: userData.id,
          title ,address , photos: addedPhotos , description ,
       perks , extraInfo , checkIn , checkOut , maxGuests,price
       
    });
    res.json(placeDoc)
  });

    app.get('/user-places', (req, res)=> {
          const {token} = req.cookies;
          jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
             const {id} = userData;
             res.json( await Place.find({owner: id}));
          });

    })

           
});

 app.get('/places/:id' , async(req,res)=> {
        const {id} = req.params;
        res.json(await Place.findById(id));
 });

   app.put('/places/:id' , async (req, res)=> {
         const {token} = req.cookies;
         const {id , title ,address , addedPhotos , description ,
          perks , extraInfo , checkIn , checkOut , maxGuests , price } = req.body;

          
          jwt.verify(token, process.env.JWT_SECRET, {}, async (err, userData) => {
            const placeDoc = await Place.findById(id);
              if(err) throw err;
                     if(userData.id === placeDoc.owner?.toString()) {
                       placeDoc?.set({ title ,address , photos: addedPhotos , description ,
                        perks , extraInfo , checkIn , checkOut , maxGuests, price});
                      await  placeDoc?.save();
                      res.json('user has been updated');

                        
                        
                     }
          });

   });

   app.get('/places' , async (req, res)=> {
        res.json(await Place.find());
   });

   app.post('/bookings' , async (req, res)=> {
    const userData = await getUserDataFromToken(req);
        const { 
          place , checkIn , checkOut , numberOfGuests , name , phone , price
        } = req.body;
     Booking.create({
      place , checkIn , checkOut , numberOfGuests , name , phone , price, 
       user:userData.id, 
     }).then(( doc)=> {
         
         res.json(doc);
     }).catch((err)=> {
        throw err;
     })


   });
  

   app.get('/bookings', async (req, res)=> {
       const userData = await getUserDataFromToken(req);
        res.json(await Booking.find({user: userData.id}).populate('place'));
   })

   
  

const start = async () => {
    try {
    await connectDB(process.env.MONGO_URI)
      app.listen(PORT, () =>
        console.log(`Server is listening on port ${PORT}..., ${__dirname}`)
      );
      
    } catch (error) {
      console.log(error);
    }
  };
  
  start();
  