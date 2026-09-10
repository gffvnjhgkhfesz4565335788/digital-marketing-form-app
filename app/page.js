"use client";

import { useState } from "react";
import "./globals.css";

const initialState = { name: "", email: "", company: "", website: "" };

export default function Home() {
  const [form, setForm] = useState(initialState);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "", message: "" });

    // Coerce all values to text on the client before sending
    const payload = {
      name: String(form.name ?? "").trim(),
      email: String(form.email ?? "").trim(),
      company: String(form.company ?? "").trim(),
      website: String(form.website ?? "").trim()
    };

    try {
      const res = await fetch("/api/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data?.error || "Submission failed. Please try again.");
      }
      setStatus({ type: "success", message: "Thanks! Your submission was received." });
      setForm(initialState);
    } catch (err) {
      setStatus({ type: "error", message: err.message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="container">
      <div className="card">
        <h1>Digital Marketing Form</h1>
        <p className="subtitle">
          Tell us about yourself and your company. We&apos;ll be in touch shortly.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Jane Smith"
            value={form.name}
            onChange={handleChange}
            required
            autoComplete="name"
          />

          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="jane@company.com"
            value={form.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <label htmlFor="company">Company</label>
          <input
            id="company"
            name="company"
            type="text"
            placeholder="Acme Inc."
            value={form.company}
            onChange={handleChange}
            required
            autoComplete="organization"
          />

          <label htmlFor="website">Website</label>
          <input
            id="website"
            name="website"
            type="text"
            inputMode="url"
            placeholder="https://example.com"
            value={form.website}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Submitting…" : "Submit"}
          </button>
        </form>
        {status.message ? (
          <div className={`status ${status.type}`} role="status">
            {status.message}
          </div>
        ) : null}
      </div>
    </main>
  );
}
