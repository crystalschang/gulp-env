var env = require('../'),
  expect = require('chai').expect;

describe('gulp-env', function() {
  it('should exist', function() {
    expect(env).to.exist;
  });

  beforeEach(function() {
    delete process.env.STARK;
    delete process.env.BARATHEON;
    delete process.env.LANNISTER;
  });

  it('should add process.env vars from a local module', function() {
    expect(process.env.STARK).not.to.equal("direwolf");
    expect(process.env.BARATHEON).not.to.equal("stag");
    expect(process.env.LANNISTER).not.to.equal("lion");

    env({file: "test/mock-env-module"})

    expect(process.env.STARK).to.equal("direwolf");
    expect(process.env.BARATHEON).to.equal("stag");
    expect(process.env.LANNISTER).to.equal("lion");
  });

  it('should add process.env vars from a local json file', function() {
    expect(process.env.STARK).not.to.equal("direwolf");
    expect(process.env.BARATHEON).not.to.equal("stag");
    expect(process.env.LANNISTER).not.to.equal("lion");

    env({file: "test/mock-env-json.json"})

    expect(process.env.STARK).to.equal("direwolf");
    expect(process.env.BARATHEON).to.equal("stag");
    expect(process.env.LANNISTER).to.equal("lion");
  });

})
