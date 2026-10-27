// Shared test helpers: a fake Firebase Admin and an in-memory Watchlist model.

const TOKENS = {
  "token-alice": { uid: "alice", email: "alice@example.com" },
  "token-bob": { uid: "bob", email: "bob@example.com" },
  "token-admin": { uid: "admin1", email: "admin@example.com" },
};

function makeFirebaseMock() {
  return {
    auth: () => ({
      verifyIdToken: async (t) => {
        if (!TOKENS[t]) throw new Error("bad token");
        return TOKENS[t];
      },
      listUsers: async () => ({
        users: [{ uid: "alice", email: "alice@example.com", displayName: "Alice" }],
      }),
    }),
  };
}

/** Minimal stand-in for the Mongoose Watchlist model. */
function makeWatchlistModel() {
  const store = new Map();

  class FakeWatchlist {
    constructor(doc) {
      Object.assign(this, doc);
      this.movies = (doc.movies || []).map((m) => ({ ...m }));
    }
    static async findOne({ userId }) {
      return store.get(userId) || null;
    }
    async save() {
      store.set(this.userId, this);
      return this;
    }
    markModified() {}
    toObject() {
      return JSON.parse(JSON.stringify({ userId: this.userId, userEmail: this.userEmail, movies: this.movies }));
    }
    static _reset() {
      store.clear();
    }
  }
  FakeWatchlist.WATCH_STATUSES = ["plan_to_watch", "watching", "watched"];
  return FakeWatchlist;
}

module.exports = { makeFirebaseMock, makeWatchlistModel };
