const {RpcClient} = require('common-utils')

class Smser {
  constructor (url) {
    this.rpcClient = RpcClient.new(url);
  }

  send (params) {
    return this.rpcClient.call('send', params)
  }
}

module.exports = {Smser};
