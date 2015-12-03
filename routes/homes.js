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

router.param('locationType', function(req,res,next,locationType){
	req.locationType = locationType
	next();
})

router.get('/address/:address/:locationType', function(req, res, next){
	console.log(req.locationType)
	var address = "%" + req.address.replace(/-/g, " ") + "%"
	var address = address.replace(" USA", "")
	if(req.locationType != "postal_code"){
		var address = address.replace(/ [0-9]{5}/, "")
	}else{
		var address = 
	}
	console.log(address)
	var concat = ""
	switch (req.locationType) {
		case "postal_code":
			concat = "zip";
			break;
		case "street_address":
			concat = "concat(street, ' ', city, ' ', state)";
			break;
		case "locality":
			concat = "concat(street, ' ', city, ' ', state)"
			break;
		default:
			concat = "concat(street, ' ', city, ' ', state)"
	}
	var query = "select * from homes where " + concat + " LIKE $1"
	pg.connect(conString, function(err, client, done){
		if(err){
			res.json(err)
		}
		client.query(query, [address], function(err, results){
			done();
			if(err){
				res.json(err)
			}
			res.json(results.rows)
		})
	})
})
router.get('/id/:address', function(req, res, next){
	console.log(req.address)
	pg.connect(conString, function(err, client, done){
		if(err){
			res.json(err)
		}
		client.query('select * from homes where id = $1::int', [req.address], function(err, results){
			done();
			if(err){
				res.json(err)
			}
			res.json(results.rows)
		})
	})
})

module.exports = router