var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ProductSchema = new Schema({

	name: { type: String, required: true },
	price: { type: Number, required: true },
	size: String,
	brand: String,
	era: String,
	width: String,
	lngth: String,
	description: String,
	available: Boolean,
	image:{
		type: String,
		default: "none",
	}
});

ProductSchema.pre('save', function (next) {
	var currentDate = new Date();
	this.updated_at = currentDate;
	if (!this.created_at) {
		this.created_at = currentDate;
	}
	next();
});

//Create mongoose model for database
var Product = mongoose.model('Product', ProductSchema);
module.exports = Product;
