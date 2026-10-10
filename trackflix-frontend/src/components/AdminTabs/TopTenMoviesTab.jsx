// TopTenMoviesTab.jsx
import React, { useState, useEffect } from "react";
import TopTenMovieForm from "../Extraadmin/TopTenMovieForm";
import TopTenMovieList from "../Extraadmin/TopTenMovieList";
import {
  fetchTopTenMovies,
  addTopTenMovie,
  updateTopTenMovie,
  deleteTopTenMovie,
} from "../../api/top10api";

const TopTenMoviesTab = () => {
  const [topTenMovies, setTopTenMovies] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const loadTopTenMovies = async () => {
    try {
      const data = await fetchTopTenMovies();
      setTopTenMovies(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadTopTenMovies();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !form.id ||
      !form.title ||
      !form.img ||
      !form.rank ||
      !form.rating ||
      !form.year ||
      !form.trailer
    ) {
      alert("Please fill all fields");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        id: Number(form.id),
        title: form.title,
        img: form.img,
        rank: Number(form.rank),
        rating: Number(form.rating),
        year: Number(form.year),
        trailer: form.trailer,
      };
      if (editingId === null) await addTopTenMovie(payload);
      else await updateTopTenMovie(editingId, payload);

      setForm({});
      setEditingId(null);
      loadTopTenMovies();
    } catch (err) {
      alert("Error submitting data");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (movie) => {
    setForm({
      ...movie,
      id: movie.id.toString(),
      rank: movie.rank.toString(),
      rating: movie.rating.toString(),
      year: movie.year.toString(),
    });
    setEditingId(movie.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this movie?")) return;
    try {
      await deleteTopTenMovie(id);
      loadTopTenMovies();
    } catch {
      alert("Failed to delete movie");
    }
  };

  const handleCancel = () => {
    setForm({});
    setEditingId(null);
  };

  return (
    <div>
      <TopTenMovieForm
        form={form}
        onChange={(e) => setForm({ ...form, [e.target.name]: e.target.value })}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        isEditing={editingId !== null}
        isSubmitting={submitting}
      />

      <TopTenMovieList
        topTenMovies={topTenMovies}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default TopTenMoviesTab;
