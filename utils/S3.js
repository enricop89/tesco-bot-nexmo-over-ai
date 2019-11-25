const AWS = require('aws-sdk');

const S3 = new AWS.S3();
const config = require('../config.json');

AWS.config.setPromisesDependency(require('bluebird'));

/**
 * Save the object in S3 bucket
 * @param {*} redirect
 */
function saveImageToS3() {
  return S3.putObject().promise()
    .then(() => Promise.resolve())
    .catch(() => Promise.reject({
      statusCode: 500,
      message: 'Error saving images',  
    }));
}

module.exports = {
  saveImageToS3,
};
