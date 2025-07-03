import { useState, useEffect } from "react";
import Card from "./components/Card";
import CardSwiper from "./components/CardSwiper";
import LoginModal from "./components/LoginModal";
import DashboardModal from "./components/DashboardModal";
import AdminDashboardModal from "./components/AdminDashboardModal";
import AddFactModal from "./components/AddFactModal";

const BASE_URL = "http://127.0.0.1:8000";

export default function App() {
  const [facts, setFacts] = useState([]);
  const [user, setUser] = useState(null);
  const [showSwiper, setShowSwiper] = useState(true);

  const [showLogin, setShowLogin] = useState(false);
  const [showUserDash, setShowUserDash] = useState(false);
  const [showAdminDash, setShowAdminDash] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("cat_user");
    if (saved) setUser(JSON.parse(saved));
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`${BASE_URL}/catfacts/`);
        const data = await res.json();
        setFacts(data.map(mapFromApi));
      } catch (err) {
        console.error("❌ Failed to fetch facts:", err);
      }
    })();
  }, []);

  const mapFromApi = (row) => ({
    id: row.id,
    title: "Cat Fact",
    fact: row.fact,
    date: row.created_at,
    author: row.author || "admin",
    status: "approved",
    custom: !!row.custom,
  });

  const postFact = async (text) => {
    const fd = new FormData();
    fd.append("fact", text.trim());

    const res = await fetch(`${BASE_URL}/catfacts/`, {
      method: "POST",
      body: fd,
    });
    if (!res.ok) throw new Error(await res.text());

    const { id } = await res.json();
    const today = new Date().toISOString().slice(0, 10);

    return {
      id,
      title: "Cat Fact",
      fact: text.trim(),
      date: today,
      author: user.role === "admin" ? "admin" : user.username,
      status: "approved",
      custom: true,
    };
  };

  const handleAddFact = async (text) => {
    const trimmed = text.trim();
  
    if (user?.role === "admin") {
      try {
        const saved = await postFact(trimmed);
        setFacts((p) => [...p, saved]);
      } catch (e) {
        alert(e.message);
      }
      return;
    }
  
    // For regular users
    const temp = {
      id: Date.now(),
      title: "Cat Fact",
      fact: trimmed,
      date: new Date().toISOString().slice(0, 10),
      author: user.username,
      status: "pending",
      custom: true,
    };
  
    setFacts((p) => [...p, temp]);
  
    // 👇 Show message after submission
    setTimeout(() => {
      alert("✅ Your fact was submitted!\n\n🔒 Please login as admin and click on dashboard for approval.");
    }, 100);
  };
  

  const handleApprove = async (obj) => {
    try {
      const saved = await postFact(obj.fact);
      setFacts((p) => [saved, ...p.filter((f) => f.id !== obj.id)]);
    } catch (e) {
      alert(e.message);
    }
  };

  const handleReject = (obj) => setFacts((p) => p.filter((f) => f.id !== obj.id));

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("cat_user");
    setShowSwiper(true);
  };

  const approvedFacts = facts.filter((f) => f.status === "approved");
  const splashFacts = approvedFacts.slice(0, 5);
  const userFacts = user ? facts.filter((f) => f.author === user.username) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2e0249] via-[#a08359] to-[#a91079] px-6 py-10 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[5%] text-[70px] text-black animate-float">🐾</div>
        <div className="absolute top-[30%] right-[10%] text-[90px] text-black animate-float-rev">🐾</div>
        <div className="absolute bottom-[20%] left-[15%] text-[60px] text-black animate-float">🐾</div>
        <div className="absolute bottom-[10%] right-[5%] text-[80px] text-black animate-float-rev">🐾</div>
        <div className="absolute top-[15%] right-[30%] text-[80px] text-white/30 animate-float">🐱</div>
        <div className="absolute top-[40%] left-[10%] text-[60px] text-white/30 animate-float">😺</div>
        <div className="absolute bottom-[10%] right-[20%] text-[85px] text-white/30 animate-float-rev">🐈‍⬛</div>
      </div>

      <header className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-4xl font-bold text-black flex items-center gap-2 drop-shadow-lg">
            🐱 Cat Facts
          </h1>
          <p className="text-sm text-purple-200">Discover amazing Facts</p>
        </div>

        <div className="flex items-center gap-4">
          {user && (
            <span className="flex items-center gap-1 text-lg">
              {user.username}
              <span className="px-2 py-1 text-xs bg-gray-800/80 rounded-full">
                {user.role}
              </span>
            </span>
          )}

          {user && (
            <button
              onClick={() =>
                user.role === "admin"
                  ? setShowAdminDash(true)
                  : setShowUserDash(true)
              }
              className="bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-gray-200 shadow"
            >
              Dashboard
            </button>
          )}

          {user ? (
            <button
              onClick={handleLogout}
              className="bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-gray-200 shadow"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => setShowLogin(true)}
              className="bg-white text-black font-medium px-4 py-2 rounded-lg hover:bg-gray-200 shadow"
            >
              Login
            </button>
          )}

          <button
            onClick={() => (user ? setShowAdd(true) : setShowLogin(true))}
            className="bg-purple-600 px-4 py-2 rounded-lg hover:bg-purple-700 flex items-center gap-1 shadow"
          >
            ➕ Add a Fact
          </button>
        </div>
      </header>

      {showSwiper ? (
        <CardSwiper facts={splashFacts} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {approvedFacts.map((f) => (
            <Card key={f.id} {...f} />
          ))}
        </div>
      )}

      <LoginModal
        isOpen={showLogin}
        setIsOpen={setShowLogin}
        onLogin={(role, username) => {
          const u = { role, username };
          setUser(u);
          localStorage.setItem("cat_user", JSON.stringify(u));
          setShowLogin(false);
          setShowSwiper(false);
        }}
      />

      <DashboardModal
        isOpen={showUserDash}
        setIsOpen={setShowUserDash}
        userFacts={userFacts}
      />

      <AdminDashboardModal
        isOpen={showAdminDash}
        setIsOpen={setShowAdminDash}
        facts={facts}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      <AddFactModal
        isOpen={showAdd}
        setIsOpen={setShowAdd}
        user={user}
        onSubmit={handleAddFact}
      />
    </div>
  );
}
