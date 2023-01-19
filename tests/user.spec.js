const request = require("supertest");
const { expect } = require("chai");
const express = require("express");
const app = express();

describe("GET /api/harshsh-28", () => {
  it("should return a list of users", (done) => {
    request(app)
      .get("/api/harshsh-28")
      .expect(200)
      .end((err, res) => {
        if (err) return done(err);
        expect(res.body).to.be.an("object");
        done();
      });
  });
});

describe("GET /api/34nji", () => {
  it("should return a 404 error if the user is not found", (done) => {
    request(app)
      .get("/api/34nji")
      .expect(404)
      .end((err, res) => {
        if (err) return done(err);
        done();
      });
  });
});
