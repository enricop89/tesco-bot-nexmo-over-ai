const NodeGeocoder = require('node-geocoder');
const config = require('../config.json');

const options = {
  provider: 'google',
  httpAdapter: 'https', // Default
  apiKey: config.GOOGLE_MAPS_APIKEY,
};
const geocoder = NodeGeocoder(options);

function convertLonLanToAddress({ lat, lon }) {
  return geocoder.reverse({ lat, lon })
    .then((res) => ({
      formattedAddress: res[0].formattedAddress,
      zipCode: res[0].zipcode,
    }))
    .catch((err) => {
      console.log(err);
      throw err;
    });
}

module.exports = {
  convertLonLanToAddress,
};
