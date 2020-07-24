const express = require('express');
const Joi = require('joi'); //used for validation
const app = express();
app.use(express.json());
 
const bookings = [
{bookingid: 1,userid: 1, roomid: 1,bonus: 'Y',status:'BOOKED'}
]

const users = [
{name: 'John', userid: 1, bonus: 800},
{name: 'Michael', userid: 2, bonus: 1000},
{name: 'Andrew', userid: 3, bonus: 1500},
{name: 'Brian', userid: 4, bonus: 2000}
]

const rooms = [
{roomid: 1, Hotel: 'West Inn', price:1000},
{roomid: 2, Hotel: 'Marriott', price:2000},
{roomid: 3, Hotel: 'Hilton', price:3000},
{roomid: 4, Hotel: 'Courtyard', price:4000}
]
 
//READ Request Handlers
app.get('/', (req, res) => {
res.send('Welcome to Hotel Booking API V1 !!!');
});

app.get('/api/rooms', (req,res)=> {
res.send(rooms);
});

app.get('/api/users', (req,res)=> {
res.send(users);
});

app.get('/api/rooms/:id', (req, res) => {
const  room = rooms.find(c => c.roomid === parseInt(req.params.id));
 
if (!room) res.status(404).send('Ooops... Cant find what you are looking for!');
res.send(room);
});

app.get('/api/rooms/:id', (req, res) => {
const  user = users.find(c => c.roomid === parseInt(req.params.id));
 
if (!user) res.status(404).send('Ooops... Cant find what you are looking for!');
res.send(users);
});
 
app.post('/api/rooms', (req, res)=> {
 
const { error } = validateRoom(req.body);
if (error){
res.status(400).send(error.details[0].message)
return;
}
const room = {
roomid: rooms.length + 1,
Hotel: req.body.Hotel,
price: req.body.price
};
rooms.push(room);
res.send(room);
});

function validateRoom(room) {
const schema = {
Hotel: Joi.string().min(3).required(),
price: Joi.required()
};
return Joi.validate(room, schema);
 
}

 
//CREATE Request Handler
app.post('/api/book', (req, res)=> {
 
const { error } = validateBooking(req.body);
if (error){
res.status(400).send(error.details[0].message)
return;
}
const booking = createbooking(req.body);
bookings.push(booking);
res.send(`Congrulations ... Booking with id ${booking.bookingid} has been confirmed and status is ${booking.status}!`)
});

function createbooking(body)
{
	let bstatus= null;
	const  room = rooms.find(c => c.roomid === parseInt(body.roomid));
	const  user = users.find(c => c.userid === parseInt(body.userid));
	console.log('Room price : '+ room.price+' user bonus : '+user.bonus);
	if(room.price <= user.bonus) 
	{
		user.bonus = user.bonus - room.price;
		bstatus= 'APPROVED';
		
	}
	else 
	{
		bstatus ='PENDING APPROVAL';
	}
	
	const booking = {
	   bookingid: bookings.length + 1,
       userid: body.userid,
	   roomid: body.roomid,
	   bonus: body.bonus,
	   status: bstatus
};

return booking;
}

function validateBooking(body) {
	console.log('inside validateBooking');
const schema = {
Hotel: Joi.string().min(3).required(),
roomid: Joi.required(),
userid: Joi.number().required()
};
return Joi.validate(body, schema);
 
}
 
//UPDATE Request Handler
app.put('/api/rooms/:id', (req, res) => {
const room = rooms.find(c=> c.roomid === parseInt(req.params.id));
if (!room) res.status(404).send('Not Found!!');
 
const { error } = validateRoom(req.body);
if (error){
res.status(400).send(error.details[0].message);
return;
}
 
room.title = req.body.title;
res.send(room);
});
 
//DELETE Request Handler
app.delete('/api/rooms/:id', (req, res) => {
 
const room = rooms.find( c=> c.roomid === parseInt(req.params.id));
if(!room) res.status(404).send('Not Found!!');
 
const index = rooms.indexOf(room);
rooms.splice(index,1);
 
res.send(room);
});
 
 
//PORT ENVIRONMENT VARIABLE
const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}..`));