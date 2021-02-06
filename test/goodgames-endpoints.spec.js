const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeGoodgamesArray } = require("./api/goodgames.fixtures");

describe.only("Goodgames Endpoints", function () {
  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DB_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () => db("goodgames_list").truncate());

  afterEach("cleanup", () => db("goodgames_list").truncate());

  describe(`GET /api/list`, () => {
    context(`Given no goodgames`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/list").expect(200, []);
      });
      context("Given there are goodgames in the database", () => {
        const testGoodgames = makeGoodgamesArray();

        beforeEach("insert goodgames", () => {
          return db.into("goodgames").insert(testGoodgames);
        });

        it("responds with 200 and all of the goodgames", () => {
          return supertest(app).get("/api/list").expect(200, testGoodgames);
        });
      });
    });

    context(`Given an XSS attack game`, () => {
      const maliciousGame = {
        id: 911,
        game_name:
          'Naughty naughty very naughty <script>alert("xss");</script>',
        game_url: "http://www.badurl.com",
      };
      beforeEach("insert malicious game", () => {
        return db.into("goodgames_list").insert([maliciousGame]);
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/goodgames/${maliciousGame.id}`)
          .expect(200)
          .expect((res) => {
            expect(res.body.title).to.eql(
              'Naughty naughty very naughty &lt;script&gt;alert("xss");&lt;/script&gt;'
            );
            expect(res.body.url).to.eql("http://www.badurl.com");
          });
      });
    });

    describe.only(`POST /api/list`, () => {
      it(`creates a game, responding with 201 and the new bookmark`, function () {
        this.retries(3);
        const newGame = {
          game_name: "Game",
          game_url: "http://www.game.com",
        };
        return supertest(app)
          .post("/api/list")
          .send(newGame)
          .expect(201)
          .expect((res) => {
            expect(res.body.title).to.eql(newGame.game_name);
            expect(res.body.url).to.eql(newGame.game_url);
            expect(res.body).to.have.property("id");
            expect(res.headers.location).to.eql(`/api/list.${res.body.id}`);
            const expected = new Date().toLocaleString("en", {
              timeZone: "UTC",
            });
            const actual = new Date(res.body.date_published).toLocaleString();
            expect(actual).to.eql(expected);
          });
      }).then((postRes) =>
        supertest(app)
          .get(`/goodgames/add/${postRes.body.id}`)
          .expect(postRes.body)
      );
    });
    const requiredFields = ["game_name", "game_url"];

    requiredFields.forEach((field) => {
      const newGame = {
        game_name: "Game",
        game_url: "http://www.game.com",
      };
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newGame[field];

        return supertest(app)
          .post("/api/list")
          .send(newGame)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });
  });

  describe.only(`DELETE /api/goodgames/playlist`, () => {
    describe.only(`PATCH /api/goodgames/playlist`, () => {
      context(`Given no goodgames`, () => {
        it(`responds with 404`, () => {
          const gameId = 123456;
          return supertest(app)
            .patch(`/api/goodgames/list`)
            .expect(404, { error: { message: `playlist item doesn't exist` } });
        });
      });
    });
    context("Given there are goodgames in the database", () => {
      const testGoodgames = makeGoodgamesArray();

      beforeEach("insert goodgames", () => {
        return db.into("goodgames").insert(testGoodgames);
      });

      it("responds with 204 and updates the playlist", () => {
        const idToUpdate = 2;
        const updateGame = {
          playlist: false,
          played: true,
          favorite: true,
        };
        const expectedGame = {
          ...testGoodgames[idToUpdate - 1],
          ...updateGame,
        };
        return supertest(app)
          .patch(`/api/list`)
          .send(updateGame)
          .expect(204)
          .then((res) => supertest(app).get(`/api/list`).expect(expectedGame));
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/list/${idToUpdate}`)
          .send({ irrelevantField: " 1 " })
          .expect(400, {
            error: {
              message: `Request body must contain either true or false`,
            },
          });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateGame = {
          favorite: "true",
        };
        const expectedGame = {
          ...testGoodgames[idToUpdate - 1],
          ...updateGame,
        };

        return supertest(app)
          .patch(`/api/list/${idToUpdate}`)
          .send({
            ...updateGame,
            fieldToIgnore: "should not be in GET response",
          })
          .expect(204)
          .then((res) =>
            supertest(app).get(`/api/list/${idToUpdate}`).expect(expectedGame)
          );
      });
    });

    context(`Given no goodgames`, () => {
      it(`responds with 404`, () => {
        const gameId = 123456;
        return supertest(app)
          .delete(`/api/list/${game_id}`)
          .expect(404, { error: { message: `Game doesn't exist` } });
      });
    });

    context("Given there are goodgames in the database", () => {
      const testGoodgames = makeGoodgamesArray();

      beforeEach("insert goodgames", () => {
        return db.into("goodgames_list").insert(testGoodgames);
      });

      it("responds with 204 and removes the game", () => {
        const idToRemove = 2;
        const expectedGoodgames = testGoodgames.filter(
          (game) => game.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/goodgames/playlist/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/goodgames/playlist`)
              .expect(expectedGoodgames)
          );
      });
    });
  });

  describe.only(`DELETE /api/goodgames/played`, () => {
    describe.only(`PATCH /api/goodgames/played`, () => {
      context(`Given no goodgames`, () => {
        it(`responds with 404`, () => {
          const gameId = 123456;
          return supertest(app)
            .patch(`/api/goodgames/played/${gameId}`)
            .expect(404, { error: { message: `played item doesn't exist` } });
        });
      });
    });
    context("Given there are goodgames in the database", () => {
      const testGoodgames = makeGoodgamesArray();

      beforeEach("insert goodgames", () => {
        return db.into("goodgames").insert(testGoodgames);
      });

      it("responds with 204 and updates the played", () => {
        const idToUpdate = 2;
        const updateGame = {
          playlist: false,
          played: true,
          favorite: true,
        };
        const expectedGame = {
          ...testGoodgames[idToUpdate - 1],
          ...updateGame,
        };
        return supertest(app)
          .patch(`/api/goodgames/played/${idToUpdate}`)
          .send(updateGame)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/goodgames/played/${idToUpdate}`)
              .expect(expectedGame)
          );
      });

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2;
        return supertest(app)
          .patch(`/api/goodgames/played/${idToUpdate}`)
          .send({ irrelevantField: " 1 " })
          .expect(400, {
            error: {
              message: `Request body must contain either true or false`,
            },
          });
      });

      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2;
        const updateGame = {
          favorite: "true",
        };
        const expectedGame = {
          ...testGoodgames[idToUpdate - 1],
          ...updateGame,
        };

        return supertest(app)
          .patch(`/api/goodgames/played/${idToUpdate}`)
          .send({
            ...updateGame,
            fieldToIgnore: "should not be in GET response",
          })
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/goodgames/played/${idToUpdate}`)
              .expect(expectedGame)
          );
      });
    });

    context(`Given no goodgames`, () => {
      it(`responds with 404`, () => {
        const gameId = 123456;
        return supertest(app)
          .delete(`/api/goodgames/played/${gameId}`)
          .expect(404, { error: { message: `Game doesn't exist` } });
      });
    });

    context("Given there are goodgames in the database", () => {
      const testGoodgames = makeGoodgamesArray();

      beforeEach("insert goodgames", () => {
        return db.into("goodgames").insert(testGoodgames);
      });

      it("responds with 204 and removes the game", () => {
        const idToRemove = 2;
        const expectedGoodgames = testGoodgames.filter(
          (game) => game.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/goodgames/played/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app)
              .get(`/api/goodgames/played`)
              .expect(expectedGoodgames)
          );
      });
    });
  });
});
