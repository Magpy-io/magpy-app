import { ErrorBackendUnreachable } from '../ExceptionsManager';

const userId = 'userId';
const userId2 = 'userId2';
const serverId = '657ccaba54ac70b873e81f8f';

const validUserName = 'UserName';

const validUserEmail = 'bla@gg.io';
const validUserPassword = 'password';
const userEmailTaken = 'takenEmail';

const validUserToken = 'validUserToken';
const invalidUserToken = 'invalidUserToken';
const validUserToken2 = 'validUserToken2';
const expiredUserToken = 'expiredUserToken';

const validKey = '382e854a9a4294851f4a42e90dabbcd3e0969515d2f90c5de65f4e724c7cf05a';
const invalidKey = 'invalidKey';
let validRandomKey = '';

const validServerToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NTdjY2FiYTU0YWM3MGI4NzNlODFmOGYiLCJpYXQiOjE3MDI2NzcxNzgsImV4cCI6MTcwMjc2MzU3OH0.G_oAm339tpuNPWVADzmNFj8nWohRZW0kZqHNUnB2_C8';
const invalidServerToken = 'invalidServerToken';
const expiredServerToken = 'expiredServerToken';

let shouldNextRequestFail = false;
let shouldNextRequestFailServerUnreachable = false;

function failNextRequest() {
  shouldNextRequestFail = true;
}

function failNextRequestServerUnreachable() {
  shouldNextRequestFailServerUnreachable = true;
}

function checkFails(): { ok: false; errorCode: 'SERVER_ERROR'; message: string } | false {
  if (shouldNextRequestFail) {
    shouldNextRequestFail = false;

    return { ok: false, errorCode: 'SERVER_ERROR', message: '' };
  }

  if (shouldNextRequestFailServerUnreachable) {
    shouldNextRequestFailServerUnreachable = false;
    throw new ErrorBackendUnreachable();
  }

  return false;
}

function setRandomValidKey(key: string) {
  validRandomKey = key;
}

function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export {
  userId,
  userId2,
  serverId,
  validUserName,
  validUserToken,
  validUserToken2,
  expiredUserToken,
  invalidUserToken,
  validKey,
  invalidKey,
  validRandomKey,
  setRandomValidKey,
  validServerToken,
  invalidServerToken,
  expiredServerToken,
  failNextRequest,
  failNextRequestServerUnreachable,
  checkFails,
  validUserEmail,
  validUserPassword,
  userEmailTaken,
  timeout,
};
