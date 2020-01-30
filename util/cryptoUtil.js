import {createHmac} from 'crypto';
import jwt from 'jsonwebtoken';


function hashPwd(pwd){
  return createHmac('sha256', "secret!") //more information: https://nodejs.org/api/crypto.html
    .update(pwd)
    .digest('hex');
}

async function createToken(data, secret, options) {
  return new Promise((resolve, reject) => {
      jwt.sign(data, secret, options, (err, token) => {
          if (err) {
              reject(err);
          } else {
              resolve(token);
          }
      });
  });
}

export const cryptoUtil = {hashPwd, createToken};


