const {MAILER_SERVICES} = require("./consts");
const axios = require('axios');

function tokenizeCredentials (login, password) {
  return Buffer.from(`${login}:${decodeURIComponent(password)}`).toString('base64');
}

function tryInitializeMailer (fn) {
  try {
    const result = fn();
    return {result};
  } catch (error) {
    console.error(error);
    return {error};
  }
}

async function tryExecute (mailer, fn) {
  if (mailer.error) {
    console.error('Sending was skipped because mailer was not initialized correctly')
    return {error: mailer.error};
  }

  try {
    const {data} = await fn();
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      return {error: error.response.data};
    }
    console.error(error);
    return {error};
  }
}

function getMailerService ({service, error}) {
  if (service) {
    return service;
  }

  if (error && error.service) {
    return error.service;
  }

  return MAILER_SERVICES.DEFAULT;
}

function formatPayload (payload) {
  if (!payload) {
    return '[No payload]';
  }

  return typeof payload === 'string'
    ? payload
    : JSON.stringify(payload, null, 2);
}

module.exports = {
  tokenizeCredentials,
  tryInitializeMailer,
  tryExecute,
  getMailerService,
  formatPayload,
}
