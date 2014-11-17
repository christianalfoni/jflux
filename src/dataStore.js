var currentId = 0;
var stores = {};

module.exports = {
  create: function (data) {
    stores[++currentId] = {};    
    return currentId;
  },
  add: function (id, dataId, data) {    
    stores[id][dataId] = data;
  },
  clear: function (id) {
    stores[id] = {};
  },
  get: function (id, dataId) {
    return stores[id] ? stores[id][dataId] : null;  
  }
};