var env = require('../'),
  expect = require('chai').expect;

describe('gulp-env', function() {
  it('should exist', function() {
    expect(env).to.exist;
  });

  it('should add process.env vars from a local file', function() {
    env({file: "test/mock-env"})

    expect(process.env.STARK).to.equal("direwolf");
    expect(process.env.BARATHEON).to.equal("stag");
    expect(process.env.LANNISTER).to.equal("lion");
  });
})
