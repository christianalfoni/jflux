/*
 * GENERATEID
 * ====================================================================================
 * Creates IDs to use in lists when waiting for updates ID from backend or creating
 * mutable lists that does not have IDs.
 * ====================================================================================
 */

var generateId = function (identifier) {
    return typeof identifier === 'string' ?
      identifier + '_' + generateId._currentId++ :
      '' + generateId._currentId++;
};

generateId._currentId = 0;

module.exports = generateId;