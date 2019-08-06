
exports.chaincodeInteraction = {
  //  @args:
  //    config:
  //      useIndex: array
  //      pageSize: int (optional)
  //      bookmark: string (optional)
  async getObjectByProperties(stub, arg, config = {}) {
    const keys = Object.keys(arg)
    let query = {
      'selector': {}
    }
    if (config['useIndex']) {
      query['use_index'] = config['useIndex']
    }
    for (const key of keys) {
      query['selector'][key] = {
        '$eq': arg[key]
      }
    }
    if (config['pageSize']) {
      const { iterator, metadata } = await stub.getQueryResultWithPagination(JSON.stringify(query), config['pageSize'], config['bookmark'])
      const results = await this.getAllResults(iterator, false)
      return {
        results: results,
        metadata: {
          RecordsCount: metadata.fetched_records_count,
          Bookmark: metadata.bookmark,
        }
      }
    } else {
      const iterator = await stub.getQueryResult(JSON.stringify(query))
      const results = await this.getAllResults(iterator, false)
      return {
        results: results
      }
    }
  },

  async getAllResults(iterator, isHistory) {
    let allResults = [];
    while (true) {
      let res = await iterator.next();

      if (res.value && res.value.value.toString()) {
        let jsonRes = {};
        console.log(res.value.value.toString('utf8'));

        if (isHistory && isHistory === true) {
          jsonRes.TxId = res.value.tx_id;
          jsonRes.Timestamp = res.value.timestamp;
          jsonRes.IsDelete = res.value.is_delete.toString();
          try {
            jsonRes.Value = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Value = res.value.value.toString('utf8');
          }
        } else {
          jsonRes.Key = res.value.key;
          try {
            jsonRes.Record = JSON.parse(res.value.value.toString('utf8'));
          } catch (err) {
            console.log(err);
            jsonRes.Record = res.value.value.toString('utf8');
          }
        }
        allResults.push(jsonRes);
      }
      if (res.done) {
        console.log('end of data');
        await iterator.close();
        return allResults;
      }
    }
  }
}

exports.USER_ROLE = {
    ADMIN: 1,
    ISSUER: 2,
    TEACHER: 3
}




