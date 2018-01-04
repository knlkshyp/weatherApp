const axios = require('axios');
const args = process.argv[2];

var loc = encodeURIComponent(args);
var url = `https://maps.googleapis.com/maps/api/geocode/json?address=${loc}`;

axios.get(url).then((resolve) => {
    if (resolve.data.status === 'ZERO_RESULTS') {
        throw new Error('Invalid address');
    }
    console.log(resolve.data.results[0].formatted_address);
    var latitude = resolve.data.results[0].geometry.location.lat;
    var longitude = resolve.data.results[0].geometry.location.lng;
    url = `https://api.darksky.net/forecast/[API Key]/${latitude},${longitude}`;
    axios.get(url).then((resolve) => {
        var temperature = resolve.data.currently.temperature;
        var celsius = (temperature - 32) * 5 / 9;
        var summary = resolve.data.currently.summary;
        console.log(`Temperature : ${celsius} °C`);
        console.log(`Weather : ${summary}`);
    });
}).catch((reject) => {
    if (reject.code === 'ENOTFOUND') {
        console.log('Unable to connect to the servers.');
    } else {
        console.log(reject.message);
    }
});
