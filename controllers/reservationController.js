var Reservation = require('../models/reservation');
var moment = require('moment')
const { body, validationResult } = require('express-validator/check');
const { sanitizeBody} = require('express-validator/filter');

exports.reservation_list = function(req, res, next) {
	Reservation.find({}, 'first_name last_name email arrival departure rooms').sort('date')
		.exec(function(err, list_reservations) {
			if (err) {return next(err); }
			res.render('reservations_list', {
				reservations_list: list_reservations
			})
		})
}

exports.reservation_create_get = function(req, res, next) {
	res.render('reservation_form', {
		title: 'Create Reservation'
	})
}

exports.reservation_create_post = [
	body('first_name', 'First name is required').isLength({min:1, max:15}).trim(),
	sanitizeBody('first_name').trim().escape(),

	(req, res, next) => {
		const errors = validationResult(req);

		var reservation = new Reservation(
			{
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				arrival: req.body.arrival,
				departure: req.body.departure,
				rooms: req.body.rooms
			}
		);
		if (!errors.isEmpty()){
			res.render('reservation_form', {
				title: 'Create Reservation', 
				reservation: reservation, 
				errors: errors.array()
			});
		}
		else {
			reservation.save(err => {
				if (err) {
					return next(err);
				}
				res.send('Added')
			})
		}
	}
];

exports.reservation_find_form_get = [
	function(req, res, next) {
		res.render('find_form', {
			title: 'Find available rooms',
		});
	}
]

exports.reservation_find_form_post = function(req, res, next) {
	const arrival = new Date(req.body.arrival);
	const departure = new Date(req.body.departure);
	const details = {$or: [
		{ $and : [{'arrival': {$lte: arrival}}, {'departure': {$gte: departure}}]}, 
		{ $and : [{'arrival': {$gte: arrival}}, {'departure': {$lte: departure}}]}, 
		{ $and : [{'arrival': {$lte: arrival}}, {'departure': {$lte: departure, $gte: arrival}}]}, 
		{ $and : [{'arrival': {$gte: arrival, $lte: departure}}, {'departure': {$gte: departure}}]} 
	]};

	Reservation.find(details, 'rooms')
		.exec((err, items) => {
			if(err){
				res.send(err)
			} else {
				const all_rooms = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				var booked_rooms = new Array;
				for (var n in items){booked_rooms.push(items[n].rooms)}
				let free_rooms = all_rooms.filter(x => !booked_rooms.flatten().includes(x))
				res.render('find_results', {
					title: 'Available rooms: '+moment(arrival).format('DD/MM/YYYY')+' to '+ moment(departure).format('DD/MM/YYYY'),
					free_rooms: free_rooms,
					arrival: arrival,
					departure: departure
				})
			}
		})
}

exports.reservation_find_form_post_create = [
	body('first_name', 'First name is required').isLength({min:1, max:15}).trim(),
	sanitizeBody('first_name').trim().escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		var reservation = new Reservation(
			{
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				arrival: req.params.arrival,
				departure: req.params.departure,
				rooms: req.body.room 
			}
		);
		reservation.save(err => {
			if (err) {
				return next(err);
			}
			res.redirect('/reservations')
		})
	}
];


exports.reservation_delete = function(req, res, next){
	const id = req.params.id 
	Reservation.findByIdAndRemove(id, err => {
		if(err) {
			return next(err);
		}
		res.redirect('/reservations')
	})
}

exports.reservation_modify_get = function(req, res, next){
	res.render('modify_form', {
		title: 'Modify reservation',
		id: req.params.id
	})
} 

exports.areservation_modify_post = (req, res, next) => {
	const errors = validationResult(req);

	var reservation = 
		{
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			email: req.body.email,
			arrival: req.body.arrival,
			departure: req.body.departure,
			rooms: req.body.rooms
		}

	Reservation.findByIdAndUpdate( req.params.id, reservation, err => {
		if (err) {
			return next(err);
		}
		res.redirect('/reservations')
	})
}


exports.reservation_modify_post = function(req, res, next) {
	const arrival = new Date(req.body.arrival);
	const departure = new Date(req.body.departure);
	const details = {$or: [
		{ $and : [{'arrival': {$lte: arrival}}, {'departure': {$gte: departure}}]}, 
		{ $and : [{'arrival': {$gte: arrival}}, {'departure': {$lte: departure}}]}, 
		{ $and : [{'arrival': {$lte: arrival}}, {'departure': {$lte: departure, $gte: arrival}}]}, 
		{ $and : [{'arrival': {$gte: arrival, $lte: departure}}, {'departure': {$gte: departure}}]} 
	]};

	Reservation.find(details, 'rooms')
		.exec((err, items) => {
			if(err){
				res.send(err)
			} else {
				const all_rooms = [1, 2, 3, 4, 5, 6, 7, 8, 9];
				var booked_rooms = new Array;
				for (var n in items){booked_rooms.push(items[n].rooms)}
				let free_rooms = all_rooms.filter(x => !booked_rooms.flatten().includes(x))
				res.render('modify_results', {
					title: 'Available rooms: '+moment(arrival).format('DD/MM/YYYY')+' to '+ moment(departure).format('DD/MM/YYYY'),
					free_rooms: free_rooms,
					arrival: arrival,
					departure: departure,
				})
			}
		})
}

exports.reservation_modify_post_create = [
	body('first_name', 'First name is required').isLength({min:1, max:15}).trim(),
	body('last_name', 'Last name is required').isLength({min:1, max:15}).trim(),
	body('email', 'Email is required').isEmail().trim(),
	body('room', 'Room is required').isLength({min:1, max:15}).trim(),
	sanitizeBody('first_name').trim().escape(),
	(req, res, next) => {
		const errors = validationResult(req);

		var reservation = 
			{
				first_name: req.body.first_name,
				last_name: req.body.last_name,
				email: req.body.email,
				arrival: req.params.arrival,
				departure: req.params.departure,
				rooms: req.body.room 
			}

		Reservation.findByIdAndUpdate( {'_id': req.params.id}, reservation, err => {
			if (err) {
				return next(err);
			}
			res.redirect('/reservations')
		})
	}
];

// helper functions
Array.prototype.flatten = function() {
	var ret = [];
	for(var i = 0; i < this.length; i++) {
		if(Array.isArray(this[i])) {
			ret = ret.concat(this[i].flatten());
		} else {
			ret.push(this[i]);
		}
	}
	return ret;
};
