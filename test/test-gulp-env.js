'use strict';

var env = require('../');
var expect = require('chai').expect;
var fs = require('fs');
var resolve = require('path').resolve;
var gulp = require('gulp');

describe('gulp-env', function() {
  it('should exist', function() {
    expect(env).to.exist;
  });

  describe('reads properties from files', function() {
    afterEach(function() {
      delete process.env.STARK;
      delete process.env.BARATHEON;
      delete process.env.LANNISTER;
    });

    it('should add process.env vars from a local module', function() {
      expect(process.env.STARK).not.to.exist
      expect(process.env.BARATHEON).not.to.exist
      expect(process.env.LANNISTER).not.to.exist

      env({file: "test/mock-env-module"})

      expect(process.env.STARK).to.equal("direwolf");
      expect(process.env.BARATHEON).to.equal("stag");
      expect(process.env.LANNISTER).to.equal("lion");
    });

    it('should take the file as the sole argument as a string', function() {
      expect(process.env.STARK).not.to.exist
      expect(process.env.BARATHEON).not.to.exist
      expect(process.env.LANNISTER).not.to.exist

      env("test/mock-env-module")

      expect(process.env.STARK).to.equal("direwolf");
      expect(process.env.BARATHEON).to.equal("stag");
      expect(process.env.LANNISTER).to.equal("lion");
    });

    it('should add process.env vars from a local json file', function() {
      expect(process.env.STARK).not.to.exist
      expect(process.env.BARATHEON).not.to.exist
      expect(process.env.LANNISTER).not.to.exist

      env({file: "test/mock-env-json.json"})

      expect(process.env.STARK).to.equal("direwolf");
      expect(process.env.BARATHEON).to.equal("stag");
      expect(process.env.LANNISTER).to.equal("lion");
    });

    it('should add process.env vars from a local ini file', function() {
      expect(process.env.STARK).not.to.exist
      expect(process.env.BARATHEON).not.to.exist
      expect(process.env.LANNISTER).not.to.exist

      env({file: "test/mock-env-ini.ini"})

      expect(process.env.STARK).to.equal("direwolf");
      expect(process.env.BARATHEON).to.equal("stag");
      expect(process.env.LANNISTER).to.equal("lion");
    });

    it('should treat a file as a different type when given a type', function() {
      expect(process.env.STARK).not.to.exist
      expect(process.env.BARATHEON).not.to.exist
      expect(process.env.LANNISTER).not.to.exist

      env({file: "test/mock-env-json.txt", type: '.json'})

      expect(process.env.STARK).to.equal("direwolf");
      expect(process.env.BARATHEON).to.equal("stag");
      expect(process.env.LANNISTER).to.equal("lion");
    });

    it('should throw if the given type is unsupported', function() {
      expect(function() {
        env({file: "test/mock-env-json.txt", type: '.blarg'})
      }).to.throw();
    });

    it('should add a missing dot to the type if a type is given', function() {
      expect(process.env.STARK).not.to.exist
      expect(process.env.BARATHEON).not.to.exist
      expect(process.env.LANNISTER).not.to.exist

      env({file: "test/mock-env-json.txt", type: 'json'})

      expect(process.env.STARK).to.equal("direwolf");
      expect(process.env.BARATHEON).to.equal("stag");
      expect(process.env.LANNISTER).to.equal("lion");
    });

    it('should throw if the file doesn\'t exist', function() {
      expect(function() {
        env("test/mock-env-blarg")
      }).to.throw();
    });
  });

  describe('reads vars from vars object', function(){
    afterEach(function() {
      delete process.env.NED;
      delete process.env.ROBERT;
      delete process.env.TYWIN;
    });

    it('should add process.env vars from vars object', function() {
      expect(process.env.NED).not.to.exist
      expect(process.env.ROBERT).not.to.exist
      expect(process.env.TYWIN).not.to.exist

      env({vars: {
        NED: true,
        ROBERT: 'fat',
        TYWIN: 9001
      }})

      expect(process.env.NED).to.equal('true');
      expect(process.env.ROBERT).to.equal('fat');
      expect(process.env.TYWIN).to.equal('9001');
    });

    it('should add process.env vars in env.set', function() {
      expect(process.env.NED).not.to.exist
      expect(process.env.ROBERT).not.to.exist
      expect(process.env.TYWIN).not.to.exist

      env.set({
        NED: true,
        ROBERT: 'fat',
        TYWIN: 9001
      });

      expect(process.env.NED).to.equal('true');
      expect(process.env.ROBERT).to.equal('fat');
      expect(process.env.TYWIN).to.equal('9001');
    });
  });

  describe('reads properties from files and vars object', function() {
    afterEach(function() {
      delete process.env.STARK;
      delete process.env.BARATHEON;
      delete process.env.LANNISTER;
    });

    it('should overwrite files with inline-vars by default', function() {
      expect(process.env.STARK).not.to.exist

      env({
        file: "test/mock-env-json.json",
        vars: {
          STARK: "wolfenstein"
        }
      });

      expect(process.env.STARK).to.equal('wolfenstein')
      expect(process.env.BARATHEON).to.equal('stag')
      expect(process.env.LANNISTER).to.equal('lion')
    });
  });

  describe('calls and reads the result of handlers', function() {
    afterEach(function() {
      delete process.env.STARK;
      delete process.env.BARATHEON;
      delete process.env.LANNISTER;
    });

    it('should call the handler with exactly two arguments', function() {
      var called = false;
      var args;

      env({file: "test/mock-env-txt.txt", handler: function() {
        called = true;
        args = [].slice.call(arguments);
      }});

      expect(called).to.be.true
      expect(args).to.have.length(1);
    });

    it('should pass the contents first', function() {
      var expected = fs.readFileSync('test/mock-env-txt.txt', 'utf8');

      env({file: "test/mock-env-txt.txt", handler: function(found) {
        expect(found).to.equal(expected);
      }});
    });

    it('should not be called if the file doesn\'t exist', function() {
      var called = false;

      try {
        env({file: "test/mock-env-blarg", handler: function() {
          called = true
        }});
      } catch (e) {}

      expect(called).to.be.false
    });

    it('should add process.env vars from the result of a handler', function() {
      expect(process.env.STARK).not.to.exist
      expect(process.env.BARATHEON).not.to.exist
      expect(process.env.LANNISTER).not.to.exist

      env({file: "test/mock-env-txt.txt", handler: function() {
        return {
          STARK: "direwolf",
          BARATHEON: "stag",
          LANNISTER: "lion",
        };
      }});

      expect(process.env.STARK).to.equal("direwolf");
      expect(process.env.BARATHEON).to.equal("stag");
      expect(process.env.LANNISTER).to.equal("lion");
    });

    it('should be overwritten by inline-vars', function() {
      env({
        file: "test/mock-env-txt.txt",
        handler: function() {
          return {
            STARK: "foo",
            BARATHEON: "bar",
          };
        },
        vars: {STARK: "bar"}
      });

      expect(process.env.STARK).to.equal("bar");
      expect(process.env.BARATHEON).to.equal("bar");
    });
  });

  describe('gulp plugin behavior', function() {
    afterEach(function() {
      delete process.env.STARK;
      delete process.env.BARATHEON;
      delete process.env.LANNISTER;
    });

    it('should work as a gulp plugin', function(done) {
      gulp.src('test/mock-env-json.txt')
        .pipe(env('test/mock-env-json.json'))
        .on('end', done)
        .on('data', function() {})
        .on('error', done);
    });
  });
});
