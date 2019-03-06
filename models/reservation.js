var mongoose = require('mongoose');
var moment = require('moment')

var Schema = mongoose.Schema;

var ReservationSchema = new Schema(
	{
		first_name: {type: String, required: true, max: 100},
		last_name: {type: String, required: true, max: 100},
		email: {type: String, required: true, max: 100},
		arrival: {type: Date, required: true},
		departure: {type: Date, required: true},
		rooms: [ {type: Number} ]
	}
);

ReservationSchema
.virtual('arrival_formatted')
.get(function() {
	return moment(this.arrival).format('DD/MM/YYYY')
})

ReservationSchema
.virtual('departure_formatted')
.get(function() {
	return moment(this.departure).format('DD/MM/YYYY')
})
module.exports = mongoose.model('Reservation', ReservationSchema)
