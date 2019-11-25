const axios = require('axios');
const config = require('../config.json');

function overAiAgent(sessionId, text) {
  return axios.post(config.OVER_AI_URL, {
    sessionId,
    input: text,
    assistant: 'default',
    agentId: config.OVER_AI_AGENT_ID,
    devId: config.OVER_AI_DEV_ID,
    userId: 'enrico.portolan@vonage.com',
    OauthIdentity: {
      oauthExpiry: null,
      oauthRefreshToken: null,
    },
  },
  {
    headers: {
      Authorization: config.OVER_AI_TOKEN,
      'Content-Type': 'application/json',
    },
  }).then((res) => res.data);
}

module.exports = {
  overAiAgent,
};
