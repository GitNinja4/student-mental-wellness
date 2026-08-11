import { useState } from "react";
import "../styles/checkin.css";

function Checkin() {
  const [selectedMood, setSelectedMood] = useState("");

  return (
    <>
      {/* ================= HEADER ================= */}
      <header className="checkin-header">

        <div className="logo">
          🧠 <span>MindTrack</span>
        </div>

        <div className="header-right">
          <span>Good morning, Dolfi 👋</span>
          <div className="profile-circle">D</div>
        </div>

      </header>


      {/* ================= MAIN CONTENT ================= */}
      <main className="checkin-container">

        {/* ================= TITLE ================= */}
        <div className="checkin-title">

          <p className="small-title">
            DAILY WELLNESS
          </p>

          <h1>
            How are you feeling today?
          </h1>

          <p>
            Take a moment to check in with yourself.
            There are no right or wrong answers.
          </p>

        </div>


        {/* ================= MOOD CARD ================= */}
        <section className="checkin-card">

          <h2>
            What's your mood right now?
          </h2>

          <p className="card-description">
            Choose the option that best describes how you're feeling.
          </p>


          <div className="mood-options">

  <button
    type="button"
    className={`mood-card ${selectedMood === "Very Low" ? "selected" : ""}`}
    onClick={() => setSelectedMood("Very Low")}
  >
    <span className="emoji">😞</span>
    <span>Very Low</span>
  </button>

  <button
    type="button"
    className={`mood-card ${selectedMood === "Low" ? "selected" : ""}`}
    onClick={() => setSelectedMood("Low")}
  >
    <span className="emoji">😕</span>
    <span>Low</span>
  </button>

  <button
    type="button"
    className={`mood-card ${selectedMood === "Okay" ? "selected" : ""}`}
    onClick={() => setSelectedMood("Okay")}
  >
    <span className="emoji">😐</span>
    <span>Okay</span>
  </button>

  <button
    type="button"
    className={`mood-card ${selectedMood === "Good" ? "selected" : ""}`}
    onClick={() => setSelectedMood("Good")}
  >
    <span className="emoji">🙂</span>
    <span>Good</span>
  </button>

  <button
    type="button"
    className={`mood-card ${selectedMood === "Excellent" ? "selected" : ""}`}
    onClick={() => setSelectedMood("Excellent")}
  >
    <span className="emoji">😄</span>
    <span>Excellent</span>
  </button>

</div>

        </section>


        {/* ================= WELLNESS FACTORS ================= */}
        <section className="checkin-card">

          <h2>
            How are you doing today?
          </h2>

          <p className="card-description">
            Move the sliders to tell us more about your day.
          </p>


          {/* Stress */}
          <div className="slider-row">

            <div className="slider-info">
              <span>😮‍💨 Stress Level</span>
              <strong>6/10</strong>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              defaultValue="6"
            />

          </div>


          {/* Anxiety */}
          <div className="slider-row">

            <div className="slider-info">
              <span>💭 Anxiety Level</span>
              <strong>3/10</strong>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              defaultValue="3"
            />

          </div>


          {/* Sleep */}
          <div className="slider-row">

            <div className="slider-info">
              <span>😴 Sleep Quality</span>
              <strong>7/10</strong>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              defaultValue="7"
            />

          </div>


          {/* Energy */}
          <div className="slider-row">

            <div className="slider-info">
              <span>⚡ Energy Level</span>
              <strong>8/10</strong>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              defaultValue="8"
            />

          </div>

        </section>


        {/* ================= JOURNAL ================= */}
        <section className="checkin-card">

          <h2>
            Want to share anything?
          </h2>

          <p className="card-description">
            Write a few thoughts about your day.
            This is completely optional.
          </p>

          <textarea
            placeholder="How was your day? What's on your mind?"
            rows="5"
          />

        </section>


        {/* ================= SAVE ================= */}
        <div className="save-section">

          <button
            type="button"
            className="save-button"
          >
            Save Today's Check-in
          </button>

          <p>
            Your information is private and secure 🔒
          </p>

        </div>

      </main>
    </>
  );
}

export default Checkin;