var express = require('express');
var router = express.Router();

var minTemp = 277;
var maxtemp = 283;
var minRPM = 88;
var maxRPM = 92;

var minCooling = 18;
var maxCooling = 22;



function evalutateProduction(data,cb){
  data = decodeURI(data);
  var payload = JSON.parse(data);

  var temp = payload.temperature || 0;
  var rpm = payload.rpm || 0;

  if(tempOK(temp) && rpmOK(rpm)){
    // return OK
    return cb(null, "true");
  } else {
    return cb(null, "false");
  }
}

function evalutateCooling(data,cb){
  data = decodeURI(data);
  var payload = JSON.parse(data);
  var cooling = payload.cooling || 0;

  if(coolingOK(cooling)){
    // return OK
    return cb(null, "true");
  } else {
    return cb(null, "false");
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/production/:payload', function(req, res, next) {
  var payload = req.params.payload;
  evalutateProduction(payload,function(err,data){
    res.end(data);
  })
});


router.get('/cooling/:payload', function(req, res, next) {
  var payload = req.params.payload;
  evalutateCooling(payload,function(err,data){
    res.end(data);
  })
});


function tempOK(temp){
  if(temp >= minTemp && temp <= maxtemp){
    return true;
  } else {
    return false;
  }
}

function rpmOK(rpm){
  if(rpm >= minRPM && rpm <= maxRPM){
    return true;
  } else {
    return false;
  }
}

function coolingOK(cooling){
  if(cooling >= minCooling && cooling <= maxCooling){
    return true;
  } else{
    return false;
  }
}

module.exports = router;
