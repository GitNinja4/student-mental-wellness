import { useEffect, useMemo, useState } from "react";

import {
  LayoutDashboard,
  Smile,
  History,
  BarChart3,
  Bot,
  BookOpen,
  Bookmark,
  User,
  Settings,
  LogOut,
  Search,
  Bell,
  ArrowRight,
  CalendarCheck,
  MessageCircle,
  FileBarChart,
  Heart,
  Moon,
  Zap,
  ShieldCheck,
  TrendingUp,
  X,
  Save,
  ChevronDown,
} from "lucide-react";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

import "./Dashboard.css";


const defaultCheckins = [
  {
    id: 1,
    date: "2026-08-11",
    mood: 7,
    stress: 6,
    sleep: 7.5,
    energy: 8,
    anxiety: 3,
  },
  {
    id: 2,
    date: "2026-08-10",
    mood: 6,
    stress: 6,
    sleep: 7,
    energy: 7,
    anxiety: 4,
  },
  {
    id: 3,
    date: "2026-08-09",
    mood: 8,
    stress: 4,
    sleep: 8,
    energy: 8,
    anxiety: 3,
  },
  {
    id: 4,
    date: "2026-08-08",
    mood: 5,
    stress: 7,
    sleep: 6,
    energy: 6,
    anxiety: 6,
  },
  {
    id: 5,
    date: "2026-08-07",
    mood: 7,
    stress: 5,
    sleep: 7.5,
    energy: 7,
    anxiety: 4,
  },
  {
    id: 6,
    date: "2026-08-06",
    mood: 6,
    stress: 6,
    sleep: 7,
    energy: 7,
    anxiety: 5,
  },
  {
    id: 7,
    date: "2026-08-05",
    mood: 8,
    stress: 4,
    sleep: 8,
    energy: 9,
    anxiety: 2,
  },
];



function getStoredData(key, fallback) {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return fallback;
    }

    return JSON.parse(saved);
  } catch {
    return fallback;
  }
}


function formatDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
  });
}


function getMoodLabel(value) {
  if (value >= 8) return "Great";
  if (value >= 6) return "Good";
  if (value >= 4) return "Okay";
  return "Low";
}


function getStressLabel(value) {
  if (value >= 8) return "High";
  if (value >= 6) return "Moderate";
  if (value >= 4) return "Mild";
  return "Low";
}


function getEnergyLabel(value) {
  if (value >= 8) return "High";
  if (value >= 6) return "Good";
  if (value >= 4) return "Moderate";
  return "Low";
}


function getAnxietyLabel(value) {
  if (value >= 8) return "High";
  if (value >= 6) return "Moderate";
  if (value >= 4) return "Mild";
  return "Low";
}


function getZone(score) {
  if (score >= 70) {
    return {
      label: "Green Zone",
      className: "green",
      description:
        "You are in a good space. Keep taking care of yourself and maintain your healthy habits.",
    };
  }

  if (score >= 45) {
    return {
      label: "Yellow Zone",
      className: "yellow",
      description:
        "Things may need a little attention. Take some time to rest and check in with yourself.",
    };
  }

  return {
    label: "Red Zone",
    className: "red",
    description:
      "It looks like you may need some extra support. Consider talking to someone you trust.",
  };
}



function Dashboard({ user, onLogout }) {



  const [profile, setProfile] = useState({
    name: user?.name || "Student",
    email: user?.email || "",
  });


  useEffect(() => {
    setProfile({
      name: user?.name || "Student",
      email: user?.email || "",
    });
  }, [user]);




  const [checkins, setCheckins] = useState(() =>
    getStoredData("mindtrack_checkins", defaultCheckins)
  );



  const [showCheckin, setShowCheckin] = useState(false);

  const [showProfile, setShowProfile] = useState(false);

  const [showNotifications, setShowNotifications] =
    useState(false);

  const [showSearch, setShowSearch] = useState(false);

  const [activeNav, setActiveNav] =
    useState("Dashboard");

  const [message, setMessage] = useState("");



  const latestCheckin =
    checkins[0] || defaultCheckins[0];


  const [form, setForm] = useState({
    mood: latestCheckin.mood,
    stress: latestCheckin.stress,
    sleep: latestCheckin.sleep,
    energy: latestCheckin.energy,
    anxiety: latestCheckin.anxiety,
  });



  const openCheckin = () => {
    setForm({
      mood: latestCheckin.mood,
      stress: latestCheckin.stress,
      sleep: latestCheckin.sleep,
      energy: latestCheckin.energy,
      anxiety: latestCheckin.anxiety,
    });

    setShowCheckin(true);
  };




  useEffect(() => {
    localStorage.setItem(
      "mindtrack_checkins",
      JSON.stringify(checkins)
    );
  }, [checkins]);



  const wellnessScore = useMemo(() => {

    if (!latestCheckin) {
      return 0;
    }

    const score =
      latestCheckin.mood * 10 +
      latestCheckin.energy * 10 +
      latestCheckin.sleep * 5 -
      latestCheckin.stress * 3 -
      latestCheckin.anxiety * 3;

    return Math.max(
      0,
      Math.min(100, Math.round(score / 2.1))
    );

  }, [latestCheckin]);


  const zone = getZone(wellnessScore);



  const moodData = useMemo(() => {

    return [...checkins]
      .slice(0, 7)
      .reverse()
      .map((item) => {

        const date = new Date(
          `${item.date}T00:00:00`
        );

        return {
          day: date.toLocaleDateString("en-US", {
            weekday: "short",
          }),
          mood: item.mood,
        };

      });

  }, [checkins]);



  const showMessage = (text, duration = 3000) => {

    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, duration);

  };



  const handleCheckinSubmit = (e) => {

    e.preventDefault();

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const newCheckin = {
      id: Date.now(),
      date: today,
      mood: Number(form.mood),
      stress: Number(form.stress),
      sleep: Number(form.sleep),
      energy: Number(form.energy),
      anxiety: Number(form.anxiety),
    };


    const withoutToday = checkins.filter(
      (item) => item.date !== today
    );


    setCheckins([
      newCheckin,
      ...withoutToday,
    ]);


    setShowCheckin(false);

    showMessage(
      "Your check-in has been saved."
    );

  };



  const handleProfileSave = (e) => {

    e.preventDefault();

    const formData =
      new FormData(e.currentTarget);

    const name =
      formData
        .get("profileName")
        ?.toString()
        .trim() || "Student";


    setProfile((previous) => ({
      ...previous,
      name,
    }));


    setShowProfile(false);

    showMessage(
      "Profile updated successfully."
    );

  };


  const handleNavigation = (item) => {

    setActiveNav(item);

    if (item === "Check-in") {
      openCheckin();
      return;
    }


    if (item === "Profile") {
      setShowProfile(true);
      return;
    }


    if (item === "Dashboard") {
      return;
    }


    showMessage(
      `${item} section is ready to be connected.`,
      2500
    );

  };




  const handleLogout = () => {

    localStorage.removeItem("token");

 

    if (onLogout) {
      onLogout();
    } else {


      window.location.reload();
    }

  };


  const avatarLetter =
    profile.name?.charAt(0)?.toUpperCase() || "U";


  return (
    <div className="dashboard">


      {/* ===================================================
          SIDEBAR
      =================================================== */}

      <aside className="sidebar">

        <div className="sidebar-logo">

          <div className="logo-icon">
            🧠
          </div>

          <div className="logo-text">

            <strong>
              MindTrack
            </strong>

            <span>
              Student Wellness
            </span>

          </div>

        </div>


        <nav className="sidebar-nav">

          {[
            {
              name: "Dashboard",
              icon: (
                <LayoutDashboard size={20} />
              ),
            },
            {
              name: "Check-in",
              icon: (
                <Smile size={20} />
              ),
            },
            {
              name: "History",
              icon: (
                <History size={20} />
              ),
            },
            {
              name: "Reports",
              icon: (
                <BarChart3 size={20} />
              ),
            },
            {
              name: "AI Assistant",
              icon: (
                <Bot size={20} />
              ),
            },
            {
              name: "Resources",
              icon: (
                <BookOpen size={20} />
              ),
            },
            {
              name: "Bookmarks",
              icon: (
                <Bookmark size={20} />
              ),
            },
          ].map((item) => (

            <button
              key={item.name}
              className={`nav-item ${
                activeNav === item.name
                  ? "active"
                  : ""
              }`}
              onClick={() =>
                handleNavigation(item.name)
              }
            >

              {item.icon}

              <span>
                {item.name}
              </span>

            </button>

          ))}

        </nav>


        <div className="sidebar-bottom">

          <button
            className="nav-item"
            onClick={() =>
              handleNavigation("Profile")
            }
          >
            <User size={20} />

            <span>
              Profile
            </span>
          </button>


          <button
            className="nav-item"
            onClick={() =>
              handleNavigation("Settings")
            }
          >
            <Settings size={20} />

            <span>
              Settings
            </span>
          </button>


          <button
            className="nav-item logout"
            onClick={handleLogout}
          >
            <LogOut size={20} />

            <span>
              Logout
            </span>
          </button>

        </div>

      </aside>


      {/* ===================================================
          MAIN
      =================================================== */}

      <main className="dashboard-main">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="dashboard-header">

          <div className="welcome-section">

            <p className="welcome-label">
              YOUR WELLNESS SPACE
            </p>

            <h1>
              Hi, {profile.name} 👋
            </h1>

            <p className="welcome-subtitle">
              How are you feeling today?
              Take a moment to check in with yourself.
            </p>

          </div>


          <div className="header-actions">


            {/* SEARCH */}

            <button
              className="header-icon"
              onClick={() =>
                setShowSearch(!showSearch)
              }
              aria-label="Search"
            >
              <Search size={20} />
            </button>


            {/* NOTIFICATIONS */}

            <div className="notification-wrapper">

              <button
                className="header-icon notification"
                onClick={() =>
                  setShowNotifications(
                    !showNotifications
                  )
                }
                aria-label="Notifications"
              >

                <Bell size={20} />

                <span className="notification-dot"></span>

              </button>


              {showNotifications && (

                <div className="dropdown notification-dropdown">

                  <strong>
                    Notifications
                  </strong>

                  <p>
                    Your daily wellness check-in
                    is waiting.
                  </p>

                  <button
                    onClick={() => {
                      setShowNotifications(false);
                      openCheckin();
                    }}
                  >
                    Complete check-in
                    <ArrowRight size={15} />
                  </button>

                </div>

              )}

            </div>


            {/* PROFILE */}

            <button
              className="profile-mini"
              onClick={() =>
                setShowProfile(true)
              }
            >

              <div className="profile-avatar">
                {avatarLetter}
              </div>

              <div className="profile-details">

                <span>
                  {profile.name}
                </span>

                <small>
                  Student
                </small>

              </div>

              <ChevronDown
                size={16}
                className="profile-arrow"
              />

            </button>

          </div>

        </header>


        {/* =================================================
            SEARCH
        ================================================= */}

        {showSearch && (

          <div className="search-panel">

            <Search size={18} />

            <input
              autoFocus
              placeholder="Search your wellness dashboard..."
            />

            <button
              onClick={() =>
                setShowSearch(false)
              }
              aria-label="Close search"
            >
              <X size={18} />
            </button>

          </div>

        )}


        {/* =================================================
            SUCCESS MESSAGE
        ================================================= */}

        {message && (

          <div className="success-message">

            <span>
              ✓
            </span>

            {message}

          </div>

        )}


        {/* =================================================
            STAT CARDS
        ================================================= */}

        <section className="stats-grid">


          {/* MOOD */}

          <div className="stat-card">

            <div className="stat-top">

              <span>
                Today's Mood
              </span>

              <div className="stat-icon purple">
                <Smile size={21} />
              </div>

            </div>

            <div className="stat-value">
              {getMoodLabel(
                latestCheckin.mood
              )}
            </div>

            <div className="stat-bottom">

              <span>
                How you're feeling
              </span>

              <strong>
                {latestCheckin.mood}/10
              </strong>

            </div>

          </div>


          {/* STRESS */}

          <div className="stat-card">

            <div className="stat-top">

              <span>
                Stress Level
              </span>

              <div className="stat-icon orange">
                <Heart size={21} />
              </div>

            </div>

            <div className="stat-value">
              {getStressLabel(
                latestCheckin.stress
              )}
            </div>

            <div className="stat-bottom">

              <span>
                Current level
              </span>

              <strong>
                {latestCheckin.stress}/10
              </strong>

            </div>

          </div>


          {/* SLEEP */}

          <div className="stat-card">

            <div className="stat-top">

              <span>
                Sleep Hours
              </span>

              <div className="stat-icon blue">
                <Moon size={21} />
              </div>

            </div>

            <div className="stat-value">
              {latestCheckin.sleep} hrs
            </div>

            <div className="stat-bottom">

              <span>
                Last check-in
              </span>

              <strong>
                {latestCheckin.sleep >= 7
                  ? "Good"
                  : "Low"}
              </strong>

            </div>

          </div>


          {/* ENERGY */}

          <div className="stat-card">

            <div className="stat-top">

              <span>
                Energy Level
              </span>

              <div className="stat-icon yellow">
                <Zap size={21} />
              </div>

            </div>

            <div className="stat-value">
              {getEnergyLabel(
                latestCheckin.energy
              )}
            </div>

            <div className="stat-bottom">

              <span>
                Current level
              </span>

              <strong>
                {latestCheckin.energy}/10
              </strong>

            </div>

          </div>


          {/* ANXIETY */}

          <div className="stat-card">

            <div className="stat-top">

              <span>
                Anxiety Level
              </span>

              <div className="stat-icon green">
                <ShieldCheck size={21} />
              </div>

            </div>

            <div className="stat-value">
              {getAnxietyLabel(
                latestCheckin.anxiety
              )}
            </div>

            <div className="stat-bottom">

              <span>
                Current level
              </span>

              <strong>
                {latestCheckin.anxiety}/10
              </strong>

            </div>

          </div>

        </section>


        {/* =================================================
            MIDDLE CARDS
        ================================================= */}

        <section className="main-grid">


          {/* WELLNESS SCORE */}

          <div className="dashboard-card wellness-score">

            <div className="card-heading">

              <div>

                <h2>
                  Wellness Score
                </h2>

                <p>
                  Based on your latest check-in
                </p>

              </div>

              <TrendingUp size={22} />

            </div>


            <div className="score-content">

              <div
                className="score-circle"
                style={{
                  "--score": `${wellnessScore * 3.6}deg`,
                }}
              >

                <div className="score-number">
                  {wellnessScore}
                </div>

                <span>
                  /100
                </span>

              </div>


              <div className="score-text">

                <h3>
                  {wellnessScore >= 70
                    ? "You're doing good!"
                    : wellnessScore >= 45
                    ? "Keep taking care of yourself."
                    : "You may need some extra support."}
                </h3>

                <p>
                  Your score changes as you
                  complete your wellness check-ins.
                </p>

                <div className="score-progress">

                  <div
                    style={{
                      width: `${wellnessScore}%`,
                    }}
                  />

                </div>

                <small>
                  {wellnessScore}% wellness score
                </small>

              </div>

            </div>

          </div>


          {/* WELLNESS ZONE */}

          <div className="dashboard-card wellness-zone">

            <div className="card-heading">

              <div>

                <h2>
                  Wellness Zone
                </h2>

                <p>
                  Based on your recent check-ins
                </p>

              </div>

            </div>


            <div className="zone-content">

              <div
                className={`zone-badge ${zone.className}`}
              >

                <span></span>

                {zone.label}

              </div>


              <p>
                {zone.description}
              </p>


              <div className="plant-illustration">
                🌱
              </div>

            </div>

          </div>


          {/* QUICK ACTIONS */}

          <div className="dashboard-card quick-actions">

            <div className="card-heading">

              <div>

                <h2>
                  Quick Actions
                </h2>

                <p>
                  Take care of yourself
                </p>

              </div>

            </div>


            <button
              onClick={openCheckin}
            >

              <div className="action-icon purple-bg">
                <CalendarCheck size={18} />
              </div>

              <span>
                Daily Check-in
              </span>

              <ArrowRight size={18} />

            </button>


            <button
              onClick={() =>
                handleNavigation("AI Assistant")
              }
            >

              <div className="action-icon blue-bg">
                <MessageCircle size={18} />
              </div>

              <span>
                Chat with AI
              </span>

              <ArrowRight size={18} />

            </button>


            <button
              onClick={() =>
                handleNavigation("Reports")
              }
            >

              <div className="action-icon green-bg">
                <FileBarChart size={18} />
              </div>

              <span>
                View Reports
              </span>

              <ArrowRight size={18} />

            </button>


            <button
              onClick={() =>
                handleNavigation("Resources")
              }
            >

              <div className="action-icon orange-bg">
                <Heart size={18} />
              </div>

              <span>
                Self-care Suggestions
              </span>

              <ArrowRight size={18} />

            </button>

          </div>

        </section>


        {/* =================================================
            MOOD TREND
        ================================================= */}

        <section className="dashboard-card mood-trend">

          <div className="card-heading trend-heading">

            <div>

              <h2>
                Mood Trend
              </h2>

              <p>
                Your mood over your recent check-ins
              </p>

            </div>


            <button
              className="view-button"
              onClick={() =>
                handleNavigation("History")
              }
            >
              View History
              <ArrowRight size={15} />
            </button>

          </div>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <LineChart
                data={moodData}
                margin={{
                  top: 15,
                  right: 20,
                  left: 0,
                  bottom: 5,
                }}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#eeeef5"
                />

                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#85829a",
                    fontSize: 13,
                  }}
                />

                <YAxis
                  domain={[0, 10]}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#85829a",
                    fontSize: 12,
                  }}
                />

                <Tooltip
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid #eceaf4",
                    boxShadow:
                      "0 8px 25px rgba(55, 45, 100, 0.12)",
                  }}
                  formatter={(value) => [
                    `${value}/10`,
                    "Mood",
                  ]}
                />

                <Line
                  type="monotone"
                  dataKey="mood"
                  stroke="#7656d6"
                  strokeWidth={4}
                  dot={{
                    r: 5,
                    fill: "#7656d6",
                    stroke: "#ffffff",
                    strokeWidth: 3,
                  }}
                  activeDot={{
                    r: 7,
                  }}
                />

              </LineChart>

            </ResponsiveContainer>

          </div>

        </section>


        {/* =================================================
            RECENT CHECK-INS
        ================================================= */}

        <section className="dashboard-card recent-checkins">

          <div className="card-heading">

            <div>

              <h2>
                Recent Check-ins
              </h2>

              <p>
                Your latest wellness entries
              </p>

            </div>


            <button
              className="view-button"
              onClick={() =>
                handleNavigation("History")
              }
            >
              View History
              <ArrowRight size={15} />
            </button>

          </div>


          <div className="checkins-grid">

            {checkins
              .slice(0, 5)
              .map((item) => (

                <div
                  className="checkin"
                  key={item.id}
                >

                  <span>
                    {formatDate(item.date)}
                  </span>

                  <strong>
                    {item.mood >= 7
                      ? "😊 Good"
                      : item.mood >= 5
                      ? "🙂 Okay"
                      : "😟 Low"}
                  </strong>

                  <b>
                    {Math.round(
                      item.mood * 10
                    )}
                  </b>

                </div>

              ))}

          </div>

        </section>

      </main>


      {/* =====================================================
          CHECK-IN MODAL
      ===================================================== */}

      {showCheckin && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowCheckin(false)
          }
        >

          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span className="modal-kicker">
                  DAILY WELLNESS
                </span>

                <h2>
                  How are you feeling?
                </h2>

                <p>
                  Your answers help personalize
                  your wellness dashboard.
                </p>

              </div>


              <button
                className="close-button"
                onClick={() =>
                  setShowCheckin(false)
                }
                aria-label="Close check-in"
              >
                <X size={20} />
              </button>

            </div>


            <form
              className="checkin-form"
              onSubmit={handleCheckinSubmit}
            >


              {/* MOOD */}

              <label>

                <div className="range-label">

                  <span>
                    😊 Mood
                  </span>

                  <strong>
                    {form.mood}/10
                  </strong>

                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.mood}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      mood: e.target.value,
                    })
                  }
                />

              </label>


              {/* STRESS */}

              <label>

                <div className="range-label">

                  <span>
                    ❤️ Stress
                  </span>

                  <strong>
                    {form.stress}/10
                  </strong>

                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.stress}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stress: e.target.value,
                    })
                  }
                />

              </label>


              {/* SLEEP */}

              <label>

                <div className="range-label">

                  <span>
                    🌙 Sleep
                  </span>

                  <strong>
                    {form.sleep} hrs
                  </strong>

                </div>

                <input
                  type="range"
                  min="0"
                  max="12"
                  step="0.5"
                  value={form.sleep}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      sleep: e.target.value,
                    })
                  }
                />

              </label>


              {/* ENERGY */}

              <label>

                <div className="range-label">

                  <span>
                    ⚡ Energy
                  </span>

                  <strong>
                    {form.energy}/10
                  </strong>

                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.energy}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      energy: e.target.value,
                    })
                  }
                />

              </label>


              {/* ANXIETY */}

              <label>

                <div className="range-label">

                  <span>
                    🌿 Anxiety
                  </span>

                  <strong>
                    {form.anxiety}/10
                  </strong>

                </div>

                <input
                  type="range"
                  min="1"
                  max="10"
                  value={form.anxiety}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      anxiety: e.target.value,
                    })
                  }
                />

              </label>


              <button
                type="submit"
                className="save-button"
              >

                <Save size={18} />

                Save Check-in

              </button>

            </form>

          </div>

        </div>

      )}


      {/* =====================================================
          PROFILE MODAL
      ===================================================== */}

      {showProfile && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowProfile(false)
          }
        >

          <div
            className="modal profile-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <div className="modal-header">

              <div>

                <span className="modal-kicker">
                  YOUR PROFILE
                </span>

                <h2>
                  Profile Settings
                </h2>

                <p>
                  Update your personal information.
                </p>

              </div>


              <button
                className="close-button"
                onClick={() =>
                  setShowProfile(false)
                }
                aria-label="Close profile"
              >
                <X size={20} />
              </button>

            </div>


            <form
              className="profile-form"
              onSubmit={handleProfileSave}
            >

              <div className="large-avatar">
                {avatarLetter}
              </div>


              <label>

                Full Name

                <input
                  name="profileName"
                  defaultValue={profile.name}
                  placeholder="Enter your name"
                  required
                />

              </label>


              <label>

                Email

                <input
                  value={profile.email}
                  disabled
                  placeholder="Email"
                  readOnly
                />

              </label>


              <button
                type="submit"
                className="save-button"
              >

                <Save size={18} />

                Save Profile

              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}


export default Dashboard;