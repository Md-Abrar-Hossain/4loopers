process.env.NODE_ENV = "test";
process.env.ADMIN_EMAILS = "admin@example.com";

jest.mock("../config/firebaseAdmin", () => require("./helpers").makeFirebaseMock());
jest.mock("../models/Watchlist", () => require("./helpers").makeWatchlistModel());
jest.mock("../models/All_FullMovies", () => ({
  find: async () => [{ id: 1, title: "Inception" }],
  prototype: {},
}));
jest.mock("../config/mongo", () => ({ connect: async () => ({}) }));

const request = require("supertest");
const app = require("../app");
const Watchlist = require("../models/Watchlist");

const auth = (t) => ({ Authorization: `Bearer ${t}` });
const movie = (over = {}) => ({
  id: 27205,
  title: "Inception",
  type: "movie",
  image: "https://example.com/inception.jpg",
  rating: 8.8,
  genres: ["Sci-Fi", "Thriller"],
  ...over,
});

beforeEach(() => Watchlist._reset());

describe("health & 404", () => {
  test("GET /health", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
  });
  test("unknown route returns JSON 404", async () => {
    const res = await request(app).get("/api/nope");
    expect(res.status).toBe(404);
    expect(res.body.message).toMatch(/not found/i);
  });
});

describe("auth", () => {
  test("watchlist requires a token", async () => {
    const res = await request(app).get("/api/watchlist/alice");
    expect(res.status).toBe(401);
  });
  test("rejects an invalid token", async () => {
    const res = await request(app).get("/api/watchlist/alice").set(auth("nope"));
    expect(res.status).toBe(401);
  });
  test("users cannot read someone else's watchlist", async () => {
    const res = await request(app).get("/api/watchlist/alice").set(auth("token-bob"));
    expect(res.status).toBe(403);
  });
  test("GET /api/users is admin only", async () => {
    expect((await request(app).get("/api/users")).status).toBe(401);
    expect((await request(app).get("/api/users").set(auth("token-alice"))).status).toBe(403);
    const ok = await request(app).get("/api/users").set(auth("token-admin"));
    expect(ok.status).toBe(200);
    expect(ok.body[0].email).toBe("alice@example.com");
  });
});

describe("public content collections", () => {
  test("reads are public", async () => {
    const res = await request(app).get("/api/fullmovies");
    expect(res.status).toBe(200);
    expect(res.body[0].title).toBe("Inception");
  });
  test("writes need admin", async () => {
    expect((await request(app).post("/api/fullmovies").send({ title: "x" })).status).toBe(401);
    expect(
      (await request(app).post("/api/fullmovies").set(auth("token-alice")).send({ title: "x" })).status
    ).toBe(403);
    expect((await request(app).delete("/api/fullmovies/1").set(auth("token-alice"))).status).toBe(403);
  });
});

describe("watchlist", () => {
  test("add -> 201, defaults status to plan_to_watch", async () => {
    const res = await request(app)
      .post("/api/watchlist/add")
      .set(auth("token-alice"))
      .send({ userId: "alice", userEmail: "alice@example.com", movie: movie() });
    expect(res.status).toBe(201);
    expect(res.body.watchlist.movies[0].status).toBe("plan_to_watch");
  });

  test("accepts legacy field names (img, trailer)", async () => {
    const res = await request(app)
      .post("/api/watchlist/add")
      .set(auth("token-alice"))
      .send({ movie: { id: "9", title: "Old", img: "https://x.com/a.png", trailer: "https://y.com/t" } });
    expect(res.status).toBe(201);
    expect(res.body.watchlist.movies[0].image).toBe("https://x.com/a.png");
  });

  test("duplicate add -> 409", async () => {
    const send = () =>
      request(app).post("/api/watchlist/add").set(auth("token-alice")).send({ movie: movie() });
    expect((await send()).status).toBe(201);
    expect((await send()).status).toBe(409);
  });

  test("cannot add on behalf of another user", async () => {
    const res = await request(app)
      .post("/api/watchlist/add")
      .set(auth("token-alice"))
      .send({ userId: "bob", movie: movie() });
    expect(res.status).toBe(403);
  });

  test("missing image -> 400", async () => {
    const res = await request(app)
      .post("/api/watchlist/add")
      .set(auth("token-alice"))
      .send({ movie: movie({ image: "" }) });
    expect(res.status).toBe(400);
  });

  test("update status sets watchedAt; filter by status works", async () => {
    const add = (id, title) =>
      request(app).post("/api/watchlist/add").set(auth("token-alice")).send({ movie: movie({ id, title }) });
    await add(1, "A");
    await add(2, "B");

    const patch = await request(app)
      .patch("/api/watchlist/alice/1")
      .set(auth("token-alice"))
      .send({ status: "watched", userRating: 9 });
    expect(patch.status).toBe(200);
    expect(patch.body.movie.status).toBe("watched");
    expect(patch.body.movie.watchedAt).toBeDefined();

    const filtered = await request(app).get("/api/watchlist/alice?status=watched").set(auth("token-alice"));
    expect(filtered.body.movies).toHaveLength(1);
    expect(filtered.body.movies[0].title).toBe("A");
  });

  test("invalid status / rating -> 400", async () => {
    await request(app).post("/api/watchlist/add").set(auth("token-alice")).send({ movie: movie() });
    const bad = await request(app)
      .patch("/api/watchlist/alice/27205")
      .set(auth("token-alice"))
      .send({ status: "banana" });
    expect(bad.status).toBe(400);
    const badRating = await request(app)
      .post("/api/ratings/alice")
      .set(auth("token-alice"))
      .send({ movieId: "27205", userRating: 11 });
    expect(badRating.status).toBe(400);
  });

  test("legacy rating endpoint still works", async () => {
    await request(app).post("/api/watchlist/add").set(auth("token-alice")).send({ movie: movie() });
    const res = await request(app)
      .post("/api/ratings/alice")
      .set(auth("token-alice"))
      .send({ movieId: "27205", userRating: 7.5 });
    expect(res.status).toBe(200);
    expect(res.body.movie.userRating).toBe(7.5);
  });

  test("delete removes the movie, then 404", async () => {
    await request(app).post("/api/watchlist/add").set(auth("token-alice")).send({ movie: movie() });
    expect((await request(app).delete("/api/watchlist/alice/27205").set(auth("token-alice"))).status).toBe(200);
    expect((await request(app).delete("/api/watchlist/alice/27205").set(auth("token-alice"))).status).toBe(404);
  });

  test("stats", async () => {
    const add = (id, genres) =>
      request(app).post("/api/watchlist/add").set(auth("token-alice")).send({ movie: movie({ id, genres }) });
    await add(1, ["Drama", "Crime"]);
    await add(2, ["Drama"]);
    await request(app).patch("/api/watchlist/alice/1").set(auth("token-alice")).send({ status: "watched", userRating: 8 });
    await request(app).patch("/api/watchlist/alice/2").set(auth("token-alice")).send({ userRating: 6 });

    const res = await request(app).get("/api/watchlist/alice/stats").set(auth("token-alice"));
    expect(res.status).toBe(200);
    expect(res.body.total).toBe(2);
    expect(res.body.byStatus).toEqual({ plan_to_watch: 1, watching: 0, watched: 1 });
    expect(res.body.averageUserRating).toBe(7);
    expect(res.body.topGenres[0]).toEqual({ genre: "Drama", count: 2 });
  });
});
