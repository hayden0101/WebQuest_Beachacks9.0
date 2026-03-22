// User Collection
{
  _id: ObjectId,
  username: String,
  password: String, // (hashed!)
  createdAt: Date
}

// Highscore Collection
{
  _id: ObjectId,
  userId: ObjectId, // reference User
  highscore_total: Number,
  highscore_conversation: Number,
  highscore_holdlongest: Number,
  highscore_usethisword: Number,
  highscore_dontusethisword: Number,
  timestamp: Date
}

// Leaderboard Collection
{
  _id: ObjectId,
  username: String,
  highscore_total: Number,
  highscore_conversation: Number,
  highscore_holdlongest: Number,
  highscore_usethisword: Number,
  highscore_dontusethisword: Number,
  rank_totalhighscore: Number,
  rank_conversation: Number,
  rank_holdlongest: Number,
  rank_usethisword: Number,
  rank_dontusethisword: Number,
}