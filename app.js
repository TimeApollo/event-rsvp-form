const express = require('express');
const mongoose = require('mongoose');

const app = express();
mongoose.connect('mongodb://localhost:27017/rsvp' , { useNewUrlParser: true })

const publicPath = "./public";
const port = 3000;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection:'));

app.set('view engine', 'pug');

app.use(express.static(publicPath));
app.use(express.urlencoded({ extended: true }));

const responseSchema = mongoose.Schema({
  name: String,
  email: String,
  attending: String,
  guests: Number,
})

const Response = mongoose.model('Response' , responseSchema, 'responses');

app.get('/' , function( req , res ){
  res.render( 'index' , {Document: "Master Splinter's Surprise Party"})
})

app.get('/guests' , function( req , res ){
  Response.find(function (err , guests){
    if(err) return console.error(err);
    console.log(guests);
    res.render( 'guests' , 
                {Document: "Master Splinter's Surprise Party Guest List" , 
                Guests: guests})
  });
})

app.post('/reply' , function(req, res, next ){
  
  console.log( 'in db call' , req.body )
  let guest = new Response({ name: req.body.name , email: req.body.email , 
                             attending: req.body.attend , guests: req.body.numGuests })

  guest.save();
  
  res.render( 'submitted' , {Document: "Master Splinter's Surprise Party"})
})

app.listen(3000 , () => {
  console.log('listening on port 3000')
})