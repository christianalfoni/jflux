var utils = require('./../src/utils.js');

describe("isParam()", function () {
  it("should return true when text is a param in format of {something}", function () {
    expect(utils.isParam('{something}')).toBe(true);
    expect(utils.isParam('something')).toBe(false);
    expect(utils.isParam('{something')).toBe(false);
    expect(utils.isParam('something}')).toBe(false);
    expect(utils.isParam('so{me}')).toBe(false);
  });
});