const axios = require('axios');
const config = require('../config.json');

async function getProducts(query, offset = 0, limit = 1) {
  if (!query) {
    return new Error('PRODUCT_QUERY_EMPTY');
  }
  const result = await axios({
    method: 'GET',
    url: `https://dev.tescolabs.com/grocery/products/?query=${query}&offset=${offset}&limit=${limit}`,
    headers: {
      'Ocp-Apim-Subscription-Key': config.TESCO_API_KEY,
    },
  });
  if (result && result.data) {
    return result.data;
  }
  return {};
}

async function storeLocator(address, offset = 0, limit = 1) {
  if (!address) {
    return new Error('ADDRESS_NOT_VALID');
  }
  const result = await axios({
    method: 'GET',
    url: `https://dev.tescolabs.com/locations/search?sort=near:"${address}"&offset=${offset}&limit=${limit}`,
    headers: {
      'Ocp-Apim-Subscription-Key': config.TESCO_API_KEY,
    },
  });
  if (result && result.data && result.data.results.length) {
    return result.data.results[0];
  }
  return {};
}

module.exports = {
  getProducts,
  storeLocator,
};
