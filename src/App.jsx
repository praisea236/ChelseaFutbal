import { useState, useEffect, useCallback } from "react";

const SUPABASE_URL = "https://weaqcwlvbvbvmukciaqn.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndlYXFjd2x2YnZidm11a2NpYXFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NzM5NjgsImV4cCI6MjA5NzU0OTk2OH0.dgmd4hGA1dSVpxdIliov_Tyg2nbX3GeMDpklK2V1XDM";

const sb = async (path, options = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/${path}`, {
    headers: {
      "apikey": SUPABASE_KEY,
      "Authorization": `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      "Prefer": options.prefer || "",
    },
    ...options,
  });
  if (!res.ok) return null;
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

const getLeaderboard = () => sb("leaderboard?order=points.desc&limit=50");

const incrementScore = async (name, pointsToAdd) => {
  const existing = await sb(`leaderboard?name=eq.${encodeURIComponent(name)}`);
  if (existing && existing.length > 0) {
    const current = existing[0];
    await sb(`leaderboard?name=eq.${encodeURIComponent(name)}`, {
      method: "PATCH",
      body: JSON.stringify({
        points: current.points + pointsToAdd,
        games_played: current.games_played + 1,
        updated_at: new Date().toISOString(),
      }),
    });
  } else {
    await sb("leaderboard", {
      method: "POST",
      prefer: "resolution=merge-duplicates",
      body: JSON.stringify({ name, points: pointsToAdd, games_played: 1, updated_at: new Date().toISOString() }),
    });
  }
};

const PLAYER_DATA = [
  { name: "PALMER",        nationality: "English",      manager: "Pochettino / Maresca" },
  { name: "JACKSON",       nationality: "Senegalese",   manager: "Pochettino / Maresca" },
  { name: "CAICEDO",       nationality: "Ecuadorian",   manager: "Pochettino / Maresca" },
  { name: "FERNANDEZ",     nationality: "Argentinian",  manager: "Pochettino / Maresca" },
  { name: "COLWILL",       nationality: "English",      manager: "Pochettino / Maresca" },
  { name: "JAMES",         nationality: "English",      manager: "Lampard / Tuchel / Potter / Maresca" },
  { name: "GUSTO",         nationality: "French",       manager: "Pochettino / Maresca" },
  { name: "NKUNKU",        nationality: "French",       manager: "Pochettino / Maresca" },
  { name: "MADUEKE",       nationality: "English",      manager: "Pochettino / Maresca" },
  { name: "NETO",          nationality: "Portuguese",   manager: "Maresca" },
  { name: "CUCURELLA",     nationality: "Spanish",      manager: "Potter / Pochettino / Maresca" },
  { name: "BADIASHILE",    nationality: "French",       manager: "Potter / Pochettino / Maresca" },
  { name: "FOFANA",        nationality: "French",       manager: "Potter / Pochettino / Maresca" },
  { name: "LAVIA",         nationality: "Belgian",      manager: "Maresca" },
  { name: "MUDRYK",        nationality: "Ukrainian",    manager: "Potter / Pochettino / Maresca" },
  { name: "SANCHEZ",       nationality: "Chilean",      manager: "Tuchel / Potter / Pochettino / Maresca" },
  { name: "JORGENSEN",     nationality: "Danish",       manager: "Maresca" },
  { name: "TOSIN",         nationality: "English",      manager: "Maresca" },
  { name: "DELAP",         nationality: "English",      manager: "Maresca" },
  { name: "GEORGE",        nationality: "English",      manager: "Maresca" },
  { name: "GUIU",          nationality: "Spanish",      manager: "Maresca" },
  { name: "ANSELMINO",     nationality: "Argentinian",  manager: "Maresca" },
  { name: "SANTOS",        nationality: "Brazilian",    manager: "Maresca" },
  { name: "ESSUGO",        nationality: "Portuguese",   manager: "Maresca" },
  { name: "SARR",          nationality: "French",       manager: "Maresca" },
  { name: "ACHEAMPONG",    nationality: "Danish",       manager: "Maresca" },
  { name: "PENDERS",       nationality: "Belgian",      manager: "Maresca" },
  { name: "GALLAGHER",     nationality: "English",      manager: "Tuchel / Potter / Pochettino" },
  { name: "STERLING",      nationality: "English",      manager: "Tuchel / Potter / Pochettino" },
  { name: "DISASI",        nationality: "French",       manager: "Pochettino / Maresca" },
  { name: "BROJA",         nationality: "Albanian",     manager: "Tuchel / Potter / Pochettino" },
  { name: "CHILWELL",      nationality: "English",      manager: "Lampard / Tuchel / Potter / Pochettino" },
  { name: "MAATSEN",       nationality: "Dutch",        manager: "Pochettino" },
  { name: "UGOCHUKWU",     nationality: "French",       manager: "Pochettino" },
  { name: "PETROVIC",      nationality: "Serbian",      manager: "Pochettino / Maresca" },
  { name: "FELIX",         nationality: "Portuguese",   manager: "Pochettino" },
  { name: "MOUNT",         nationality: "English",      manager: "Lampard / Tuchel" },
  { name: "HAVERTZ",       nationality: "German",       manager: "Tuchel / Potter" },
  { name: "WERNER",        nationality: "German",       manager: "Lampard / Tuchel" },
  { name: "PULISIC",       nationality: "American",     manager: "Lampard / Tuchel / Potter" },
  { name: "LUKAKU",        nationality: "Belgian",      manager: "Di Matteo / Benitez / Tuchel" },
  { name: "KOVACIC",       nationality: "Croatian",     manager: "Sarri / Lampard / Tuchel / Potter" },
  { name: "JORGINHO",      nationality: "Italian",      manager: "Sarri / Lampard / Tuchel / Potter" },
  { name: "RUDIGER",       nationality: "German",       manager: "Conte / Sarri / Lampard / Tuchel" },
  { name: "CHRISTENSEN",   nationality: "Danish",       manager: "Conte / Sarri / Lampard / Tuchel" },
  { name: "ALONSO",        nationality: "Spanish",      manager: "Conte / Sarri / Lampard / Tuchel" },
  { name: "SILVA",         nationality: "Brazilian",    manager: "Lampard / Tuchel / Potter" },
  { name: "CHALOBAH",      nationality: "English",      manager: "Tuchel / Potter / Pochettino / Maresca" },
  { name: "ZIYECH",        nationality: "Moroccan",     manager: "Lampard / Tuchel / Potter" },
  { name: "ABRAHAM",       nationality: "English",      manager: "Lampard" },
  { name: "GIROUD",        nationality: "French",       manager: "Conte / Sarri / Lampard / Tuchel" },
  { name: "BARKLEY",       nationality: "English",      manager: "Conte / Sarri / Lampard" },
  { name: "ZOUMA",         nationality: "French",       manager: "Mourinho / Conte / Sarri / Lampard" },
  { name: "HAZARD",        nationality: "Belgian",      manager: "Di Matteo / Benitez / Mourinho / Sarri" },
  { name: "KANTE",         nationality: "French",       manager: "Conte / Sarri / Lampard / Tuchel" },
  { name: "WILLIAN",       nationality: "Brazilian",    manager: "Mourinho / Conte / Sarri / Lampard" },
  { name: "PEDRO",         nationality: "Spanish",      manager: "Conte / Sarri / Lampard" },
  { name: "MORATA",        nationality: "Spanish",      manager: "Conte" },
  { name: "CAHILL",        nationality: "English",      manager: "Villas-Boas / Di Matteo / Benitez / Mourinho / Conte" },
  { name: "IVANOVIC",      nationality: "Serbian",      manager: "Grant / Scolari / Hiddink / Ancelotti / Mourinho / Conte" },
  { name: "AZPILICUETA",   nationality: "Spanish",      manager: "Di Matteo / Benitez / Mourinho / Conte / Sarri / Lampard / Tuchel" },
  { name: "FABREGAS",      nationality: "Spanish",      manager: "Mourinho / Hiddink / Conte" },
  { name: "MATIC",         nationality: "Serbian",      manager: "Mourinho / Hiddink / Benitez / Conte" },
  { name: "BAKAYOKO",      nationality: "French",       manager: "Conte" },
  { name: "EMERSON",       nationality: "Italian",      manager: "Conte / Sarri / Lampard" },
  { name: "MOSES",         nationality: "Nigerian",     manager: "Mourinho / Conte" },
  { name: "DRINKWATER",    nationality: "English",      manager: "Conte" },
  { name: "DROGBA",        nationality: "Ivorian",      manager: "Mourinho / Ancelotti / Di Matteo" },
  { name: "LAMPARD",       nationality: "English",      manager: "Ranieri / Mourinho / Ancelotti" },
  { name: "TERRY",         nationality: "English",      manager: "Ranieri / Mourinho / Ancelotti / Hiddink" },
  { name: "COLE",          nationality: "English",      manager: "Mourinho / Ancelotti / Di Matteo" },
  { name: "CECH",          nationality: "Czech",        manager: "Mourinho / Ancelotti / Di Matteo / Benitez" },
  { name: "ROBBEN",        nationality: "Dutch",        manager: "Mourinho" },
  { name: "CARVALHO",      nationality: "Portuguese",   manager: "Mourinho" },
  { name: "MAKELELE",      nationality: "French",       manager: "Ranieri / Mourinho" },
  { name: "GALLAS",        nationality: "French",       manager: "Ranieri / Mourinho" },
  { name: "FERREIRA",      nationality: "Portuguese",   manager: "Mourinho / Grant / Scolari / Hiddink / Ancelotti" },
  { name: "BRIDGE",        nationality: "English",      manager: "Ranieri / Mourinho" },
  { name: "GEREMI",        nationality: "Cameroonian",  manager: "Ranieri / Mourinho" },
  { name: "KEZMAN",        nationality: "Serbian",      manager: "Mourinho" },
  { name: "DUFF",          nationality: "Irish",        manager: "Ranieri / Mourinho" },
  { name: "TIAGO",         nationality: "Portuguese",   manager: "Mourinho" },
  { name: "HUTH",          nationality: "German",       manager: "Mourinho" },
  { name: "ANELKA",        nationality: "French",       manager: "Scolari / Hiddink / Ancelotti" },
  { name: "MALOUDA",       nationality: "French",       manager: "Mourinho / Grant / Ancelotti / Di Matteo" },
  { name: "ESSIEN",        nationality: "Ghanaian",     manager: "Mourinho / Grant / Scolari / Hiddink / Ancelotti" },
  { name: "BALLACK",       nationality: "German",       manager: "Mourinho / Grant / Scolari / Hiddink" },
  { name: "KALOU",         nationality: "Ivorian",      manager: "Mourinho / Grant / Scolari / Hiddink / Ancelotti / Villas-Boas / Di Matteo" },
  { name: "BOSINGWA",      nationality: "Portuguese",   manager: "Hiddink / Ancelotti / Villas-Boas / Di Matteo" },
  { name: "BENAYOUN",      nationality: "Israeli",      manager: "Ancelotti" },
  { name: "RAMIRES",       nationality: "Brazilian",    manager: "Ancelotti / Villas-Boas / Di Matteo / Benitez / Mourinho" },
  { name: "TORRES",        nationality: "Spanish",      manager: "Ancelotti / Villas-Boas / Di Matteo / Benitez / Mourinho" },
  { name: "OSCAR",         nationality: "Brazilian",    manager: "Di Matteo / Benitez / Mourinho / Conte" },
  { name: "MIKEL",         nationality: "Nigerian",     manager: "Mourinho / Grant / Scolari / Hiddink / Ancelotti / Di Matteo / Conte" },
  { name: "MATA",          nationality: "Spanish",      manager: "Villas-Boas / Di Matteo / Benitez / Mourinho" },
  { name: "STURRIDGE",     nationality: "English",      manager: "Ancelotti / Villas-Boas / Di Matteo" },
  { name: "SALAH",         nationality: "Egyptian",     manager: "Mourinho / Di Matteo" },
  { name: "LUIZ",          nationality: "Brazilian",    manager: "Villas-Boas / Di Matteo / Benitez / Mourinho / Conte" },
  { name: "BERTRAND",      nationality: "English",      manager: "Villas-Boas / Di Matteo" },
  { name: "DECO",          nationality: "Portuguese",   manager: "Scolari / Hiddink" },
  { name: "BELLETTI",      nationality: "Brazilian",    manager: "Mourinho / Grant / Scolari / Hiddink" },
  { name: "ALEX",          nationality: "Brazilian",    manager: "Scolari / Hiddink / Ancelotti / Villas-Boas" },
  { name: "HASSELBAINK",   nationality: "Dutch",        manager: "Vialli / Ranieri" },
  { name: "GRONKJAER",     nationality: "Danish",       manager: "Ranieri" },
  { name: "MUTU",          nationality: "Romanian",     manager: "Ranieri" },
  { name: "VERON",         nationality: "Argentinian",  manager: "Ranieri" },
  { name: "GUDJOHNSEN",    nationality: "Icelandic",    manager: "Vialli / Ranieri / Mourinho" },
  { name: "CUDICINI",      nationality: "Italian",      manager: "Vialli / Ranieri / Mourinho" },
  { name: "DESAILLY",      nationality: "French",       manager: "Vialli / Ranieri" },
  { name: "LEBOEUF",       nationality: "French",       manager: "Gullit / Vialli / Ranieri" },
  { name: "ZOLA",          nationality: "Italian",      manager: "Gullit / Vialli / Ranieri" },
  { name: "POYET",         nationality: "Uruguayan",    manager: "Gullit / Vialli" },
  { name: "BABAYARO",      nationality: "Nigerian",     manager: "Vialli / Ranieri" },
  { name: "WISE",          nationality: "English",      manager: "Porterfield / Hoddle / Gullit / Vialli" },
  { name: "HUGHES",        nationality: "Welsh",        manager: "Porterfield / Hoddle" },
  { name: "SINCLAIR",      nationality: "English",      manager: "Gullit / Vialli" },
  { name: "KHARINE",       nationality: "Russian",      manager: "Porterfield / Hoddle / Gullit / Vialli" },
  { name: "PETRESCU",      nationality: "Romanian",     manager: "Hoddle / Gullit / Vialli" },
  { name: "DUBERRY",       nationality: "English",      manager: "Hoddle / Gullit / Vialli / Ranieri" },
  { name: "STANIC",        nationality: "Croatian",     manager: "Vialli / Ranieri" },
  { name: "MELCHIOT",      nationality: "Dutch",        manager: "Vialli / Ranieri" },
  { name: "AMBROSETTI",    nationality: "Italian",      manager: "Vialli" },
];

const seen = new Set();
const PLAYER_LIST_DATA = PLAYER_DATA.filter(p => {
  if (seen.has(p.name)) return false;
  seen.add(p.name); return true;
});
const PLAYER_NAMES = PLAYER_LIST_DATA.map(p => p.name);

const MAX_GUESSES = 6;
const GAME_KEY = "chelsea_wordle_v3_game";

function getDailyPlayer() {
  const start = new Date("2024-01-01");
  const diff = Math.floor((new Date() - start) / (1000 * 60 * 60 * 24));
  return PLAYER_LIST_DATA[diff % PLAYER_LIST_DATA.length];
}

function getTodayStr() {
  return new Date().toISOString().split("T")[0];
}

function getLetterStates(guess, answer) {
  const result = Array(guess.length).fill("absent");
  const answerArr = answer.split("");
  const used = Array(answer.length).fill(false);
  guess.split("").forEach((l, i) => {
    if (l === answerArr[i]) { result[i] = "correct"; used[i] = true; }
  });
  guess.split("").forEach((l, i) => {
    if (result[i] === "correct") return;
    const j = answerArr.findIndex((a, idx) => a === l && !used[idx]);
    if (j !== -1) { result[i] = "present"; used[j] = true; }
  });
  return result;
}

function buildKeyboardState(guesses, answer) {
  const state = {};
  guesses.forEach(({ word, states }) => {
    word.split("").forEach((l, i) => {
      const prev = state[l]; const curr = states[i];
      if (prev === "correct") return;
      if (curr === "correct" || prev !== "correct") state[l] = curr;
    });
  });
  return state;
}

const TILE_COLORS = {
  correct: { bg: "#034694", border: "#034694", text: "#fff" },
  present: { bg: "#FFC61E", border: "#FFC61E", text: "#1a1a2e" },
  absent:  { bg: "#3a3a4a", border: "#3a3a4a", text: "#fff" },
  empty:   { bg: "transparent", border: "#2a2a4a", text: "#fff" },
  active:  { bg: "transparent", border: "#6666aa", text: "#fff" },
};

function Tile({ letter, state, shake, tileSize }) {
  const colors = TILE_COLORS[state] || TILE_COLORS.empty;
  return (
    <div style={{
      width: tileSize, height: tileSize,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: Math.round(tileSize * 0.48),
      fontWeight: 800,
      fontFamily: "'Bebas Neue', 'Arial Black', sans-serif",
      border: `2.5px solid ${colors.border}`,
      background: colors.bg, color: colors.text,
      borderRadius: 7, transition: "background 0.3s, border 0.3s",
      animation: shake ? "shake 0.4s ease" : "none",
      boxShadow: state === "correct" ? "0 0 12px #034694bb" : "none",
      flexShrink: 0,
    }}>{letter}</div>
  );
}

function Row({ word, answer, submitted, isActive, shake }) {
  // Tile size based on word length so longer names still fit
  const len = answer.length;
  const tileSize = len <= 5 ? 64 : len <= 7 ? 56 : len <= 9 ? 50 : len <= 11 ? 44 : 38;
  const gap = len <= 7 ? 6 : 5;
  const padded = word.padEnd(answer.length, " ");
  return (
    <div style={{ display: "flex", gap, marginBottom: gap, justifyContent: "center" }}>
      {padded.split("").map((l, i) => (
        <Tile key={i} letter={l.trim()}
          state={submitted ? getLetterStates(word, answer)[i] : (i < word.length ? "active" : "empty")}
          shake={isActive && shake} tileSize={tileSize} />
      ))}
    </div>
  );
}

function Keyboard({ onKey, keyState }) {
  const rows = [
    ["Q","W","E","R","T","Y","U","I","O","P"],
    ["A","S","D","F","G","H","J","K","L"],
    ["ENTER","Z","X","C","V","B","N","M","⌫"],
  ];
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
      {rows.map((row, ri) => (
        <div key={ri} style={{ display: "flex", gap: 5 }}>
          {row.map(k => {
            const st = keyState[k];
            const colors = st ? TILE_COLORS[st] : { bg: "#2a2a3e", border: "#2a2a3e", text: "#fff" };
            const isWide = k === "ENTER" || k === "⌫";
            return (
              <button key={k} onClick={() => onKey(k)} style={{
                width: isWide ? 62 : 36, height: 46,
                background: colors.bg, color: colors.text,
                border: `1.5px solid ${colors.border}`, borderRadius: 6,
                fontSize: isWide ? 11 : 15, fontWeight: 700, cursor: "pointer",
                fontFamily: "'Bebas Neue', sans-serif", transition: "background 0.2s", flexShrink: 0,
              }}>{k}</button>
            );
          })}
        </div>
      ))}
    </div>
  );
}

function ClueBox({ label, icon, content, used, onUse, disabled }) {
  return (
    <div style={{
      background: used ? "#0d1f0d" : "#12122a",
      border: `1.5px solid ${used ? "#2a6a2a" : "#2a2a4a"}`,
      borderRadius: 10, padding: "12px 14px", flex: 1, transition: "all 0.3s",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ color: "#666688", fontSize: 11, letterSpacing: 1, fontFamily: "sans-serif" }}>{icon} {label}</span>
        {!used && (
          <button onClick={onUse} disabled={disabled} style={{
            background: disabled ? "#1a1a2a" : "#1e1e40",
            border: "1px solid #034694", color: disabled ? "#444" : "#FFC61E",
            borderRadius: 6, padding: "4px 10px", fontSize: 11,
            fontWeight: 700, cursor: disabled ? "not-allowed" : "pointer",
            fontFamily: "'Bebas Neue', sans-serif",
          }}>-1pt</button>
        )}
      </div>
      {used
        ? <div style={{ color: "#7fff7f", fontWeight: 700, fontSize: 14, marginTop: 8, fontFamily: "sans-serif" }}>{content}</div>
        : <div style={{ color: "#222244", fontSize: 12, marginTop: 6, fontStyle: "italic", fontFamily: "sans-serif" }}>Hidden — tap to reveal</div>
      }
    </div>
  );
}

function Leaderboard({ scores, loading, onClose }) {
  const medals = ["🥇","🥈","🥉"];
  return (
    <div style={{
      position: "fixed", inset: 0, background: "rgba(0,0,0,0.92)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100, padding: 20,
    }}>
      <div style={{
        background: "#12122a", borderRadius: 16, padding: 28,
        width: "100%", maxWidth: 440, border: "1.5px solid #034694",
        boxShadow: "0 0 40px #034694aa", maxHeight: "80vh", overflowY: "auto",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <h2 style={{ color: "#FFC61E", fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, margin: 0, letterSpacing: 1 }}>
            🏆 LEADERBOARD
          </h2>
          <button onClick={onClose} style={{ background: "none", border: "none", color: "#888", fontSize: 24, cursor: "pointer" }}>✕</button>
        </div>
        {loading ? (
          <p style={{ color: "#666", textAlign: "center", fontFamily: "sans-serif" }}>Loading...</p>
        ) : scores.length === 0 ? (
          <p style={{ color: "#666", textAlign: "center", fontFamily: "sans-serif" }}>No scores yet. Be the first!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {scores.map((s, i) => (
              <div key={s.name} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                background: i < 3 ? "#1a1a3a" : "#0e0e22", borderRadius: 10, padding: "12px 16px",
                border: i === 0 ? "1px solid #FFC61E55" : "1px solid #ffffff0a",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{ fontSize: 22 }}>{medals[i] || `#${i+1}`}</span>
                  <div>
                    <div style={{ color: "#fff", fontWeight: 700, fontFamily: "sans-serif", fontSize: 15 }}>{s.name}</div>
                    <div style={{ color: "#444466", fontSize: 11, fontFamily: "sans-serif" }}>{s.games_played} games played</div>
                  </div>
                </div>
                <div style={{ color: "#FFC61E", fontWeight: 800, fontSize: 22, fontFamily: "'Bebas Neue', sans-serif" }}>
                  {s.points} <span style={{ fontSize: 13, color: "#666688" }}>PTS</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function RegisterModal({ onRegister }) {
  const [name, setName] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    const trimmed = name.trim().toUpperCase();
    if (trimmed.length < 2) { setErr("At least 2 characters"); return; }
    if (trimmed.length > 20) { setErr("Max 20 characters"); return; }
    onRegister(trimmed);
  };
  return (
    <div style={{
      position: "fixed", inset: 0, background: "#0a0a1a",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 200, padding: 24,
    }}>
      <div style={{
        background: "#12122a", borderRadius: 20, padding: "40px 32px",
        width: "100%", maxWidth: 380, border: "1.5px solid #034694",
        boxShadow: "0 0 60px #034694aa", textAlign: "center",
      }}>
        <div style={{ fontSize: 60, marginBottom: 12 }}>⚽</div>
        <h1 style={{ color: "#FFC61E", fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, margin: "0 0 4px", letterSpacing: 3 }}>
          CHELSEA WORDLE
        </h1>
        <p style={{ color: "#034694", fontSize: 13, marginBottom: 6, letterSpacing: 2, fontFamily: "sans-serif" }}>BLUE IS THE COLOUR</p>
        <p style={{ color: "#444466", fontSize: 14, marginBottom: 30, fontFamily: "sans-serif" }}>
          Guess the Chelsea player. New puzzle every day.
        </p>
        <input
          type="text" placeholder="Your name or username"
          value={name} onChange={e => { setName(e.target.value); setErr(""); }}
          onKeyDown={e => e.key === "Enter" && submit()} maxLength={20}
          style={{
            width: "100%", padding: "14px 16px", borderRadius: 10,
            background: "#0a0a1a", border: "1.5px solid #1e1e4a",
            color: "#fff", fontSize: 16, outline: "none",
            boxSizing: "border-box", marginBottom: 10, fontFamily: "sans-serif", textAlign: "center",
          }}
          autoFocus
        />
        {err && <p style={{ color: "#ff6b6b", fontSize: 13, margin: "0 0 8px", fontFamily: "sans-serif" }}>{err}</p>}
        <button onClick={submit} style={{
          width: "100%", padding: 15, borderRadius: 10,
          background: "#034694", color: "#fff", border: "none",
          fontSize: 20, fontWeight: 800, cursor: "pointer",
          fontFamily: "'Bebas Neue', sans-serif", letterSpacing: 2, marginTop: 4,
          boxShadow: "0 4px 20px #034694aa",
        }}>LET'S PLAY →</button>
        <p style={{ color: "#1a1a3a", fontSize: 12, marginTop: 18, fontFamily: "sans-serif" }}>
          {PLAYER_LIST_DATA.length} Chelsea players · Daily puzzle
        </p>
      </div>
    </div>
  );
}

function Toast({ msg }) {
  if (!msg) return null;
  return (
    <div style={{
      position: "fixed", top: 80, left: "50%", transform: "translateX(-50%)",
      background: "#fff", color: "#12122a", padding: "12px 24px",
      borderRadius: 10, fontWeight: 700, fontSize: 15, zIndex: 300,
      boxShadow: "0 4px 20px rgba(0,0,0,0.5)", fontFamily: "sans-serif",
      whiteSpace: "nowrap", maxWidth: "90vw", textAlign: "center",
    }}>{msg}</div>
  );
}

// ─── Main App ──────────────────────────────────────────────────────────────
export default function ChelseaWordle() {
  const dailyData = getDailyPlayer();
  const ANSWER = dailyData.name;
  const today = getTodayStr();

  const [player, setPlayer] = useState(() => {
    try { return localStorage.getItem("cw_player") || null; } catch { return null; }
  });
  const [current, setCurrent] = useState("");
  const [guesses, setGuesses] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [shake, setShake] = useState(false);
  const [toast, setToast] = useState("");
  const [showBoard, setShowBoard] = useState(false);
  const [scores, setScores] = useState([]);
  const [scoresLoading, setScoresLoading] = useState(false);
  const [pointsEarned, setPointsEarned] = useState(null);
  const [savedToday, setSavedToday] = useState(false);
  const [clue1Used, setClue1Used] = useState(false);
  const [clue2Used, setClue2Used] = useState(false);
  const [cluePenalty, setCluePenalty] = useState(0);
  const [myPoints, setMyPoints] = useState(0);
  const [myRank, setMyRank] = useState(null);

  useEffect(() => {
    if (!player) return;
    try {
      const raw = localStorage.getItem(GAME_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        if (saved.date === today && saved.player === player) {
          setGuesses(saved.guesses || []);
          setGameOver(saved.gameOver || false);
          setWon(saved.won || false);
          setSavedToday(saved.scored || false);
          setPointsEarned(saved.points ?? null);
          setClue1Used(saved.clue1Used || false);
          setClue2Used(saved.clue2Used || false);
          setCluePenalty(saved.cluePenalty || 0);
        }
      }
    } catch {}
    fetchMyScore();
  }, [player]);

  const fetchMyScore = async () => {
    if (!player) return;
    try {
      const data = await sb(`leaderboard?name=eq.${encodeURIComponent(player)}`);
      if (data && data.length > 0) setMyPoints(data[0].points);
    } catch {}
  };

  const fetchLeaderboard = async () => {
    setScoresLoading(true);
    try {
      const data = await getLeaderboard();
      if (data) {
        setScores(data);
        const idx = data.findIndex(s => s.name === player);
        setMyRank(idx >= 0 ? idx + 1 : null);
      }
    } catch {}
    setScoresLoading(false);
  };

  const saveGame = useCallback((g, go, w, scored, pts, c1, c2, cp) => {
    try {
      localStorage.setItem(GAME_KEY, JSON.stringify({
        date: today, player, guesses: g, gameOver: go, won: w,
        scored, points: pts, clue1Used: c1, clue2Used: c2, cluePenalty: cp,
      }));
    } catch {}
  }, [player, today]);

  const showToast = (msg, duration = 2200) => {
    setToast(msg); setTimeout(() => setToast(""), duration);
  };

  const submitScore = useCallback(async (tries, didWin, currentGuesses, penalty) => {
    if (savedToday) return;
    const base = didWin ? Math.max(7 - tries, 1) : 0;
    const pts = Math.max(base - penalty, 0);
    setPointsEarned(pts);
    setSavedToday(true);
    saveGame(currentGuesses, true, didWin, true, pts, clue1Used, clue2Used, penalty);
    try {
      await incrementScore(player, pts);
      setMyPoints(prev => prev + pts);
    } catch {}
  }, [savedToday, saveGame, clue1Used, clue2Used, player]);

  const useClue1 = () => {
    if (clue1Used || gameOver) return;
    const np = cluePenalty + 1;
    setClue1Used(true); setCluePenalty(np);
    saveGame(guesses, gameOver, won, savedToday, pointsEarned, true, clue2Used, np);
    showToast("🌍 Nationality revealed! -1pt deducted");
  };

  const useClue2 = () => {
    if (clue2Used || gameOver) return;
    const np = cluePenalty + 1;
    setClue2Used(true); setCluePenalty(np);
    saveGame(guesses, gameOver, won, savedToday, pointsEarned, clue1Used, true, np);
    showToast("👔 Manager revealed! -1pt deducted");
  };

  const handleKey = useCallback((key) => {
    if (gameOver) return;
    if (key === "⌫" || key === "Backspace") { setCurrent(c => c.slice(0, -1)); return; }
    if (key === "ENTER" || key === "Enter") {
      if (current.length !== ANSWER.length) {
        setShake(true); setTimeout(() => setShake(false), 400);
        showToast(`Must be ${ANSWER.length} letters`); return;
      }
      if (!PLAYER_NAMES.includes(current.toUpperCase())) {
        setShake(true); setTimeout(() => setShake(false), 400);
        showToast("Not in Chelsea player list"); return;
      }
      const states = getLetterStates(current, ANSWER);
      const newGuess = { word: current, states };
      const newGuesses = [...guesses, newGuess];
      setGuesses(newGuesses);
      setCurrent("");
      const didWin = current === ANSWER;
      const isLast = newGuesses.length === MAX_GUESSES;
      if (didWin) {
        setWon(true); setGameOver(true);
        setTimeout(() => showToast("⚽ BLUE IS THE COLOUR! 🔵", 3000), 300);
        submitScore(newGuesses.length, true, newGuesses, cluePenalty);
      } else if (isLast) {
        setGameOver(true);
        setTimeout(() => showToast(`The answer was ${ANSWER}`, 4000), 300);
        submitScore(newGuesses.length, false, newGuesses, cluePenalty);
      } else {
        saveGame(newGuesses, false, false, savedToday, pointsEarned, clue1Used, clue2Used, cluePenalty);
      }
      return;
    }
    if (/^[A-Za-z]$/.test(key) && current.length < ANSWER.length) {
      setCurrent(c => c + key.toUpperCase());
    }
  }, [current, guesses, gameOver, ANSWER, submitScore, saveGame, savedToday, pointsEarned, clue1Used, clue2Used, cluePenalty]);

  useEffect(() => {
    const handler = (e) => handleKey(e.key);
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleKey]);

  const handleRegister = (name) => {
    setPlayer(name);
    try { localStorage.setItem("cw_player", name); } catch {}
  };

  const handleShowBoard = () => { setShowBoard(true); fetchLeaderboard(); };

  const keyState = buildKeyboardState(guesses, ANSWER);
  const puzzleNum = Math.floor((new Date() - new Date("2024-01-01")) / 86400000) % PLAYER_LIST_DATA.length + 1;
  const triesLeft = MAX_GUESSES - guesses.length;

  if (!player) return <RegisterModal onRegister={handleRegister} />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0a0a1a; }
        @keyframes shake {
          0%,100%{transform:translateX(0)} 20%{transform:translateX(-8px)}
          40%{transform:translateX(8px)} 60%{transform:translateX(-5px)} 80%{transform:translateX(5px)}
        }
        @keyframes fadeIn { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes glow { 0%,100%{box-shadow:0 0 10px #FFC61E44} 50%{box-shadow:0 0 24px #FFC61Eaa} }
        button:hover{opacity:0.85} input:focus{border-color:#FFC61E!important}
        ::-webkit-scrollbar{width:4px} ::-webkit-scrollbar-thumb{background:#034694;border-radius:2px}
      `}</style>

      <Toast msg={toast} />
      {showBoard && <Leaderboard scores={scores} loading={scoresLoading} onClose={() => setShowBoard(false)} />}

      <div style={{
        minHeight: "100vh", background: "#0a0a1a",
        display: "flex", flexDirection: "column", alignItems: "center",
        paddingBottom: 40, animation: "fadeIn 0.4s ease",
      }}>

        {/* Header */}
        <div style={{
          width: "100%", maxWidth: 520, borderBottom: "1px solid #1a1a3a",
          padding: "14px 18px", display: "flex", justifyContent: "space-between",
          alignItems: "center", marginBottom: 14,
        }}>
          <div>
            <h1 style={{ color: "#FFC61E", fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 2, lineHeight: 1 }}>
              ⚽ CHELSEA WORDLE
            </h1>
            <p style={{ color: "#1e1e3a", fontSize: 11, marginTop: 2, fontFamily: "sans-serif" }}>
              Puzzle #{puzzleNum} · {today}
            </p>
          </div>
          <button onClick={handleShowBoard} style={{
            background: "#12122a", border: "1px solid #034694",
            color: "#FFC61E", padding: "9px 16px", borderRadius: 9,
            cursor: "pointer", fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: 1,
          }}>🏆 RANKS</button>
        </div>

        {/* Stats bar */}
        <div style={{
          display: "flex", marginBottom: 16,
          background: "#12122a", borderRadius: 12, border: "1px solid #1a1a3a", overflow: "hidden",
        }}>
          {[
            { label: "PLAYER", value: player, color: "#fff", font: "sans-serif" },
            { label: "POINTS", value: myPoints, color: "#FFC61E", font: "'Bebas Neue', sans-serif" },
            { label: "RANK", value: myRank ? `#${myRank}` : "–", color: "#4488ff", font: "'Bebas Neue', sans-serif" },
            { label: "TRIES LEFT", value: gameOver ? "–" : triesLeft, color: triesLeft <= 2 && !gameOver ? "#ff6b6b" : "#aaa", font: "'Bebas Neue', sans-serif" },
          ].map((item, i) => (
            <div key={i} style={{
              textAlign: "center", padding: "10px 14px",
              borderRight: i < 3 ? "1px solid #1a1a3a" : "none",
            }}>
              <div style={{ color: "#222244", fontSize: 10, letterSpacing: 1, fontFamily: "sans-serif" }}>{item.label}</div>
              <div style={{ color: item.color, fontWeight: 700, fontSize: 14, fontFamily: item.font }}>{item.value}</div>
            </div>
          ))}
        </div>

        <p style={{ color: "#1e1e3a", fontSize: 12, marginBottom: 14, fontFamily: "sans-serif" }}>
          {ANSWER.length} letters · Guess the Chelsea player
        </p>

        {/* Grid */}
        <div style={{ marginBottom: 16, width: "100%", maxWidth: 480, padding: "0 10px" }}>
          {Array.from({ length: MAX_GUESSES }).map((_, i) => {
            const submitted = i < guesses.length;
            const isActive = i === guesses.length && !gameOver;
            return (
              <Row key={i}
                word={submitted ? guesses[i].word : isActive ? current : ""}
                answer={ANSWER} submitted={submitted} isActive={isActive} shake={isActive && shake}
              />
            );
          })}
        </div>

        {/* Clues */}
        {!gameOver && (
          <div style={{ width: "100%", maxWidth: 420, marginBottom: 16, padding: "0 10px" }}>
            <div style={{ color: "#1e1e3a", fontSize: 11, letterSpacing: 1.5, textAlign: "center", marginBottom: 8, fontFamily: "sans-serif" }}>
              💡 USE A CLUE · costs 1pt each
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <ClueBox label="NATIONALITY" icon="🌍" content={dailyData.nationality}
                used={clue1Used} onUse={useClue1} disabled={gameOver} />
              <ClueBox label="MANAGER" icon="👔" content={dailyData.manager}
                used={clue2Used} onUse={useClue2} disabled={gameOver} />
            </div>
            {cluePenalty > 0 && (
              <p style={{ color: "#aa6600", fontSize: 12, textAlign: "center", marginTop: 8, fontFamily: "sans-serif" }}>
                ⚠️ -{cluePenalty}pt clue penalty active
              </p>
            )}
          </div>
        )}

        {/* Clues after game over */}
        {gameOver && (clue1Used || clue2Used) && (
          <div style={{ width: "100%", maxWidth: 420, marginBottom: 14, padding: "0 10px" }}>
            <div style={{ display: "flex", gap: 10 }}>
              {clue1Used && (
                <div style={{ flex: 1, background: "#0d1f0d", border: "1px solid #2a5a2a", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ color: "#666688", fontSize: 11, fontFamily: "sans-serif" }}>🌍 NATIONALITY</div>
                  <div style={{ color: "#7fff7f", fontWeight: 700, fontSize: 15, marginTop: 6, fontFamily: "sans-serif" }}>{dailyData.nationality}</div>
                </div>
              )}
              {clue2Used && (
                <div style={{ flex: 1, background: "#0d1f0d", border: "1px solid #2a5a2a", borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ color: "#666688", fontSize: 11, fontFamily: "sans-serif" }}>👔 MANAGER</div>
                  <div style={{ color: "#7fff7f", fontWeight: 700, fontSize: 13, marginTop: 6, fontFamily: "sans-serif" }}>{dailyData.manager}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Result */}
        {gameOver && (
          <div style={{
            background: won ? "#050f20" : "#150505",
            border: `1.5px solid ${won ? "#034694" : "#661111"}`,
            borderRadius: 16, padding: "20px 28px", textAlign: "center",
            marginBottom: 20, width: "100%", maxWidth: 420,
            animation: "fadeIn 0.5s ease",
          }}>
            {won ? (
              <>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
                <div style={{ color: "#FFC61E", fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, letterSpacing: 1 }}>
                  BLUE IS THE COLOUR!
                </div>
                <div style={{ color: "#888", fontSize: 14, marginTop: 8, fontFamily: "sans-serif" }}>
                  Solved in <strong style={{ color: "#fff" }}>{guesses.length}</strong> {guesses.length === 1 ? "try" : "tries"}
                  {cluePenalty > 0 && <span style={{ color: "#aa6600" }}> · -{cluePenalty}pt penalty</span>}
                </div>
                <div style={{
                  color: "#FFC61E", fontSize: 32, fontWeight: 800, marginTop: 10,
                  fontFamily: "'Bebas Neue', sans-serif", animation: "glow 2s ease infinite",
                }}>+{pointsEarned} PTS</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: 32, marginBottom: 8 }}>😔</div>
                <div style={{ color: "#ff6b6b", fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: 1 }}>
                  BETTER LUCK TOMORROW
                </div>
                <div style={{ color: "#666", fontSize: 14, marginTop: 8, fontFamily: "sans-serif" }}>
                  The answer was <strong style={{ color: "#fff" }}>{ANSWER}</strong>
                </div>
              </>
            )}
            <button onClick={handleShowBoard} style={{
              marginTop: 16, background: "#034694", border: "none", color: "#fff",
              borderRadius: 9, padding: "10px 24px", cursor: "pointer",
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: 1,
            }}>VIEW LEADERBOARD</button>
            <div style={{ color: "#1a1a3a", fontSize: 12, marginTop: 12, fontFamily: "sans-serif" }}>
              New puzzle at midnight your local time
            </div>
          </div>
        )}

        {!gameOver && <Keyboard onKey={handleKey} keyState={keyState} />}
      </div>
    </>
  );
}
