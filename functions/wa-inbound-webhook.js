const { getProducts, storeLocator } = require('../utils/tescoAPI');
const { convertLonLanToAddress } = require('../utils/maps');
const { overAiAgent } = require('../utils/overai');
const { sendWhatsappMessage, buildMediaTemplateMessage } = require('../utils/nexmo');

const whatsAppKeyword = ['enricop-blog-post-1'];

/**
 * Handle the types fo response from overAI
 * @param {} from from number
 * @param {*} to to number
 * @param {*} response response from OVEAI
 */
async function handleOverAIResponse(from, to, response) {
  const { nluResponse: { result } } = response;
  console.log('[handleOverAIResponse] - nlu response', result);
  let content = {};
  switch (result.action) {
    case 'welcome':
      console.log('welcome', result.response);
    case 'request.action':
    case 'request.location':
    case '':
      const replaceLineBreak = result.response.replace(/{linebreak}/g, '\n');
      console.log('replaceLineBreak', replaceLineBreak);
      content = { type: 'text', text: replaceLineBreak };
      await sendWhatsappMessage(from, to, content);
      break;
    case 'product-request':
      // if dialog complete is true it means the user has typed the product is looking for
      if (result.dialog_complete) {
        // todo call Tesco API to get Product image
        const productResult = await getProducts(result.parameters[0].value);
        const product = productResult.uk.ghs.products.results[0];
        if (product) {
          content.type = 'image';
          content.image = {};
          content.image.url = product.image;
          content.image.caption = `${product.name} - Price: ${product.price} £`;
        } else {
          content.type = 'text';
          content.text = 'Product not found';
        }
      } else {
        // if null just send the message back again to prompt the product request
        content = { type: 'text', text: result.response };
      }
      await sendWhatsappMessage(from, to, content);
      break;
    default:
      console.log('Action not defined');
  }
}


module.exports.handler = async (event) => {
  let body = null;
  if (process.env.IS_LOCAL) {
    body = event.body;
  } else {
    body = JSON.parse(event.body);
  }

  const { to, from, message } = body;
  const { content } = message;
  let nearestShop = null;
  try {
    switch (content.type) {
      // If I receive an inbound message with type location, I should reply with the nearest shop.
      case 'location':
        // Converting longitude and latitude into zip code to use Tesco API
        const userAddress = await convertLonLanToAddress({ lat: content.location.lat, lon: content.location.long });
        nearestShop = await storeLocator(userAddress.zipCode);
        const { location: { name, geo, contact } } = nearestShop;
        const toSend = buildMediaTemplateMessage({
          lon: geo.coordinates.longitude,
          lat: geo.coordinates.latitude,
          address: `${contact.address.lines[0].text} ${contact.address.town} ${contact.address.postcode}`,
          name,
        });
        await sendWhatsappMessage(to, from, toSend);
        break;
      case 'text':
        if (whatsAppKeyword.indexOf(content.text.toLowerCase()) === -1){
          const result = await overAiAgent(`${from.number}-${new Date().getDate()}`, content.text);
          await handleOverAIResponse(to, from, result);
        }
        break;
    }
    return {
      statusCode: 200,
    };
  } catch (err) {
    console.log('Err', err);
    return {
      statusCode: 500,
    };
  }
};
