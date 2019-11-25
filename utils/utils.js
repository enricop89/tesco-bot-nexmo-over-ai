const axios = require('axios');

async function fromUrlToImageBase64(imageUrl) {
  const image = await axios.get(imageUrl, { responseType: 'arraybuffer' });
  const returnedB64 = Buffer.from(image.data).toString('base64');
  return returnedB64;
}

module.exports = {
  fromUrlToImageBase64,
};
