var express = require('express');
var router = express.Router();

var minTemp = 277;
var maxtemp = 283;
var minRPM = 88;
var maxRPM = 92;

var minCooling = 18;
var maxCooling = 22;

var coolingData = {};
var prodData = { '::1':
[ { temp: 280, rpm: 90, OK: true },
  { temp: 270, rpm: 80, OK: false },
  { temp: 273, rpm: 88, OK: false },
  { temp: 278, rpm: 88, OK: true },
  { temp: 200, rpm: 90, OK: false },
  { temp: 200, rpm: 90, OK: false },
  { temp: 200, rpm: 90, OK: false },
  { temp: 200, rpm: 90, OK: false },
  { temp: 200, rpm: 90, OK: false } ] }


function evalutateProduction(ip,data,cb){
  data = decodeURI(data);
  console.log('data',data);
  var payload = JSON.parse(data);

  var temp = payload.temperature || 0;
  var rpm = payload.rpm || 0;

  storeProdData(ip,{temp:temp,rpm:rpm});

  if(tempOK(temp) && rpmOK(rpm)){
    // return OK
    return cb(null, "true");
  } else {
    return cb(null, "false");
  }
}

function evalutateCooling(ip,data,cb){
  data = decodeURI(data);
  var payload = JSON.parse(data);
  var cooling = payload.cooling || 0;

  storeCoolingData(ip,cooling);

  if(coolingOK(cooling)){
    // return OK
    return cb(null, "true");
  } else {
    return cb(null, "false");
  }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('dashboard', {
    title:'IOT App Dashboard',
    pdata:prodData,
    cdata:coolingData
  });
});

router.get('/production/:payload', function(req, res, next) {
  var payload = req.params.payload;
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  evalutateProduction(ip,payload,function(err,data){
    res.end(data);
  })
});


router.get('/cooling/:payload', function(req, res, next) {
  var payload = req.params.payload;
  var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

  evalutateCooling(ip,payload,function(err,data){
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

function storeProdData(ip,data){
  data.OK = (tempOK(data.temp) && rpmOK(data.rpm));
  console.log('Storing Production Data');
  console.log(ip,data); 

  if(prodData[ip]){
    prodData[ip].push(data);
  } else {
    prodData[ip] = [data];
  }
}

function storeCoolingData(ip,cooling){
  var OK = coolingOK(cooling);
  if(coolingData[ip]){
    coolingData[ip].push({cooling:cooling,OK:OK});
  } else {
    coolingData[ip] = [{cooling:cooling,OK:OK}];
  }
}

module.exports = router;
