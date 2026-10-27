export const OMDB_API_KEY = import.meta.env.VITE_OMDB_API_KEY || "";

export const sampleGenres = [
  "Action",
  "Comedy",
  "fantasy",
  "Drama",
  "Thriller",
  "Romance",
  "Sci-Fi",
  "Horror",
  "Adventure",
  "Animation",
  "Crime",
];

export const quizQuestions = [
  {
    id: "mood",
    title: "1. How are you today?",
    options: ["😊 Happy", "😐 Neutral", "😢 Sad"],
    multiple: false,
  },
  {
    id: "occasion",
    title: "2. What comes closest to your occasion?",
    options: [
      "Watching alone",
      "Movie Date",
      "Friends Night",
      "Family Time",
      "Date Night",
    ],
    multiple: false,
  },
  {
    id: "genreLight",
    title: "3. Choose light genres (best for casual or date night)",
    options: [
      "Action",
      "Comedy",
      "Romantic Comedy",
      "All genres (not recommended for dates)",
    ],
    multiple: true,
  },
  {
    id: "genres",
    title: "4. Choose any genres you’re interested in.",
    options: sampleGenres,
    multiple: true,
  },
  {
    id: "year",
    title: "5. How old should the movie be?",
    options: [
      "Doesn't matter",
      "Last 5 years",
      "Last 10 years",
      "Last 25 years",
    ],
    multiple: false,
  },
  {
    id: "ageRating",
    title: "6. Is the movie rating important to you?",
    options: ["Yes", "No"],
    multiple: false,
  },
];
