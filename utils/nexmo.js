const axios = require('axios');
const config = require('../config.json');

const nexmoMessagesJWT = `Bearer ${config.NEXMO_MESSAGES_JWT}`;

function buildMediaTemplateMessage({
  lon, lat, address, name,
}) {
  return {
    type: 'custom',
    custom: {
      type: 'template',
      template: {
        namespace: 'whatsapp:hsm:technology:nexmo',
        name: 'shop_location',
        language: {
          policy: 'deterministic',
          code: 'en',
        },
        components: [
          {
            type: 'header',
            parameters: [
              {
                type: 'location',
                location: {
                  longitude: lon,
                  latitude: lat,
                  name,
                  address,
                },
              },
            ],
          },
          {
            type: 'body',
            parameters: [
              {
                type: 'text',
                text: 'customer',
              },
              {
                type: 'text',
                text: `${name} ${address}`,
              },
            ],
          },
        ],
      },
    },

  };
}

/**
 * Send messages using Nexmo Messages REST API
 * @param {*} from
 * @param {*} to
 * @param {*} content
 */
function sendWhatsappMessage(from, to, content) {

  return axios.post(config.NEXMO_MESSAGES_URL, {
    from: {
      type: 'whatsapp',
      number: from.number,
    },
    to: {
      type: 'whatsapp',
      number: to.number,
    },
    message: {
      content,
    },
  },
  {
    headers: {
      Authorization: nexmoMessagesJWT,
      'Content-Type': 'application/json',
    },
  });
}

module.exports = {
  sendWhatsappMessage,
  buildMediaTemplateMessage,
};
