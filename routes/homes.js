var express = require('express')
var router = express.Router();
var pg = require('pg')

var conString = "postgres://postgres:blazeteam1@localhost/realDemo"

/*
	Enters an address
	realdemo.com/homes/Street-City-State-Zip/?queries
	
	Map is moved from initial location
	realdemo.com/homes/Street-City-State-Zip/maxLat,maxLng,minLat,minLng
*/

router.param('address', function(req,res,next,address){
	req.address = address
	next();
})
router.get('/:address', function(req, res, next){
	console.log(req.address)
	pg.connect(conString, function(err, client, done){
		if(err){
			res.json(err)
		}
		client.query('select * from homes', function(err, results){
			done();
			if(err){
				res.json(err)
			}
			res.json(results.rows)
		})
	})
})

module.exports = router