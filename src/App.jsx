import { useState, useEffect, useRef, useCallback } from "react";

const C = {
  bg: "#0a0e1a", bgCard: "#0f1629", bgGlass: "rgba(15,22,41,0.7)",
  border: "rgba(99,179,237,0.12)", borderHover: "rgba(99,179,237,0.3)",
  teal: "#00d4aa", tealDark: "#00a88a", blue: "#3b82f6", blueDark: "#1d4ed8",
  red: "#ef4444", orange: "#f97316", purple: "#8b5cf6", yellow: "#fbbf24",
  text: "#e2e8f0", textSub: "#94a3b8", textMuted: "#64748b",
};

const glassStyle = {
  background: C.bgGlass, backdropFilter: "blur(20px)",
  border: `1px solid ${C.border}`, borderRadius: 16,
};

function useInterval(cb, delay) {
  const ref = useRef(cb);
  useEffect(() => { ref.current = cb; }, [cb]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => ref.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

function Badge({ children, color = C.teal }) {
  return (
    <span style={{
      background: color + "22", color, border: `1px solid ${color}44`,
      borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 600,
      letterSpacing: "0.05em", textTransform: "uppercase"
    }}>{children}</span>
  );
}

function PulsingDot({ color = C.teal, size = 8 }) {
  const [on, setOn] = useState(true);
  useInterval(() => setOn(v => !v), 900);
  return (
    <span style={{
      display: "inline-block", width: size, height: size,
      borderRadius: "50%", background: on ? color : color + "44",
      transition: "background 0.4s", flexShrink: 0
    }} />
  );
}

function Card({ children, style = {}, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <div onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        ...glassStyle, border: `1px solid ${hov ? C.borderHover : C.border}`,
        transition: "all 0.25s", transform: hov && onClick ? "translateY(-2px)" : "none",
        cursor: onClick ? "pointer" : "default", ...style,
      }}>{children}</div>
  );
}

function Btn({ children, onClick, color = C.teal, outline = false, small = false, style = {} }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{
        background: outline ? "transparent" : hov ? color + "dd" : color,
        color: outline ? color : "#000", border: `1.5px solid ${color}`, borderRadius: 10,
        padding: small ? "6px 14px" : "10px 22px", fontSize: small ? 13 : 14, fontWeight: 700,
        cursor: "pointer", fontFamily: "inherit", transition: "all 0.2s",
        transform: hov ? "scale(1.02)" : "scale(1)", letterSpacing: "0.02em", ...style,
      }}>{children}</button>
  );
}

function Input({ label, type = "text", value, onChange, placeholder, icon }) {
  return (
    <div style={{ marginBottom: 16 }}>
      {label && <label style={{ display: "block", color: C.textSub, fontSize: 13, marginBottom: 6, fontWeight: 600 }}>{label}</label>}
      <div style={{ position: "relative" }}>
        {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>{icon}</span>}
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          style={{
            width: "100%", background: "#0a0e1a", border: `1px solid ${C.border}`, borderRadius: 10,
            padding: `10px ${icon ? "40px" : "14px"} 10px ${icon ? "38px" : "14px"}`,
            color: C.text, fontSize: 14, fontFamily: "inherit", outline: "none",
            boxSizing: "border-box", transition: "border 0.2s",
          }}
          onFocus={e => e.target.style.border = `1px solid ${C.teal}`}
          onBlur={e => e.target.style.border = `1px solid ${C.border}`}
        />
      </div>
    </div>
  );
}

function StarField() {
  const canvasRef = useRef();
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const stars = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.2, a: Math.random(), da: (Math.random() - 0.5) * 0.01,
    }));
    let raf;
    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach(s => {
        s.a = Math.max(0.1, Math.min(1, s.a + s.da));
        if (s.a <= 0.1 || s.a >= 1) s.da *= -1;
        ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(0,212,170,${s.a * 0.5})`; ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    }
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);
  return <canvas ref={canvasRef} style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }} />;
}

// ─── CITY DATA ────────────────────────────────────────────────────────────────
const CITIES = {
  chennai: {
    name: "Chennai, Tamil Nadu",
    places: [
      { label: "🏥 Apollo Hospital", color: "#ef4444", x: 30, y: 25 },
      { label: "👮 Police HQ", color: "#3b82f6", x: 70, y: 40 },
      { label: "🏨 Taj Hotel", color: C.teal, x: 50, y: 65 },
      { label: "🚒 Fire Stn.", color: C.orange, x: 20, y: 70 },
      { label: "🏛️ Marina Beach", color: "#8b5cf6", x: 80, y: 75 },
      { label: "🕌 Kapaleeshwarar", color: "#fbbf24", x: 45, y: 30 },
    ],
    routes: ["Marina Beach", "T. Nagar Market", "Kapaleeshwarar Temple", "Express Avenue Mall"],
    guides: [
      { name: "Arjun Rajan", lang: "Tamil, English, Hindi", spec: "Temples & Culture", rating: 4.9, exp: "8 yrs", price: "₹800/hr", avatar: "AR", verified: true },
      { name: "Priya Nair", lang: "English, French", spec: "Beach & Food Tours", rating: 4.8, exp: "5 yrs", price: "₹650/hr", avatar: "PN", verified: true },
      { name: "Mohammed Ali", lang: "Hindi, Urdu, English", spec: "Heritage Walks", rating: 4.7, exp: "6 yrs", price: "₹700/hr", avatar: "MA", verified: false },
    ],
  },
  mumbai: {
    name: "Mumbai, Maharashtra",
    places: [
      { label: "🏥 Lilavati Hospital", color: "#ef4444", x: 25, y: 30 },
      { label: "👮 Marine Drive PS", color: "#3b82f6", x: 65, y: 35 },
      { label: "🏨 Taj Mahal Palace", color: C.teal, x: 55, y: 70 },
      { label: "🚒 Byculla Fire Stn.", color: C.orange, x: 30, y: 65 },
      { label: "🌊 Gateway of India", color: "#8b5cf6", x: 75, y: 80 },
      { label: "🎭 CST Station", color: "#fbbf24", x: 40, y: 20 },
    ],
    routes: ["Gateway of India", "Juhu Beach", "Colaba Causeway", "Dharavi"],
    guides: [
      { name: "Rohit Sharma", lang: "Hindi, Marathi, English", spec: "Bollywood & Film City", rating: 4.9, exp: "10 yrs", price: "₹900/hr", avatar: "RS", verified: true },
      { name: "Sunita Kapoor", lang: "English, Gujarati", spec: "Heritage & Food", rating: 4.8, exp: "7 yrs", price: "₹750/hr", avatar: "SK", verified: true },
      { name: "David Fernandes", lang: "English, Portuguese", spec: "Colonial Architecture", rating: 4.6, exp: "4 yrs", price: "₹600/hr", avatar: "DF", verified: false },
    ],
  },
  delhi: {
    name: "New Delhi",
    places: [
      { label: "🏥 AIIMS Hospital", color: "#ef4444", x: 20, y: 35 },
      { label: "👮 Delhi Police HQ", color: "#3b82f6", x: 60, y: 30 },
      { label: "🏨 The Imperial", color: C.teal, x: 45, y: 60 },
      { label: "🚒 Connaught Fire Stn.", color: C.orange, x: 35, y: 70 },
      { label: "🏯 Red Fort", color: "#8b5cf6", x: 75, y: 45 },
      { label: "🕌 Qutub Minar", color: "#fbbf24", x: 55, y: 80 },
    ],
    routes: ["Red Fort", "India Gate", "Connaught Place", "Chandni Chowk"],
    guides: [
      { name: "Amit Verma", lang: "Hindi, English, German", spec: "Mughal History", rating: 5.0, exp: "12 yrs", price: "₹1000/hr", avatar: "AV", verified: true },
      { name: "Kavya Singh", lang: "Hindi, English, Japanese", spec: "Street Food & Markets", rating: 4.8, exp: "6 yrs", price: "₹700/hr", avatar: "KS", verified: true },
      { name: "Rajesh Kumar", lang: "Hindi, English", spec: "Modern Delhi Tour", rating: 4.5, exp: "3 yrs", price: "₹500/hr", avatar: "RK", verified: false },
    ],
  },
  jaipur: {
    name: "Jaipur, Rajasthan",
    places: [
      { label: "🏥 SMS Hospital", color: "#ef4444", x: 28, y: 32 },
      { label: "👮 City Police", color: "#3b82f6", x: 68, y: 28 },
      { label: "🏨 Rambagh Palace", color: C.teal, x: 50, y: 55 },
      { label: "🚒 Sindhi Camp Fire", color: C.orange, x: 22, y: 72 },
      { label: "🏯 Amber Fort", color: "#8b5cf6", x: 78, y: 40 },
      { label: "🌸 Hawa Mahal", color: "#fbbf24", x: 42, y: 78 },
    ],
    routes: ["Amber Fort", "Hawa Mahal", "City Palace", "Jantar Mantar"],
    guides: [
      { name: "Ramesh Meena", lang: "Hindi, English, Spanish", spec: "Royal Rajasthan", rating: 4.9, exp: "9 yrs", price: "₹850/hr", avatar: "RM", verified: true },
      { name: "Seema Rajput", lang: "Hindi, English", spec: "Handicraft & Bazaars", rating: 4.7, exp: "5 yrs", price: "₹650/hr", avatar: "SR", verified: true },
      { name: "Vijay Sharma", lang: "Hindi, English, Russian", spec: "Desert & Wildlife", rating: 4.8, exp: "7 yrs", price: "₹800/hr", avatar: "VS", verified: false },
    ],
  },
  goa: {
    name: "Goa",
    places: [
      { label: "🏥 Goa Medical", color: "#ef4444", x: 32, y: 28 },
      { label: "👮 Panaji Police", color: "#3b82f6", x: 62, y: 38 },
      { label: "🏨 Grand Hyatt", color: C.teal, x: 48, y: 62 },
      { label: "🚒 Margao Fire Stn.", color: C.orange, x: 25, y: 68 },
      { label: "🏖️ Calangute Beach", color: "#8b5cf6", x: 80, y: 50 },
      { label: "⛪ Basilica Bom Jesus", color: "#fbbf24", x: 55, y: 25 },
    ],
    routes: ["Calangute Beach", "Anjuna Market", "Old Goa Churches", "Dudhsagar Falls"],
    guides: [
      { name: "Antonio Pereira", lang: "English, Portuguese, Konkani", spec: "Beaches & Water Sports", rating: 4.9, exp: "11 yrs", price: "₹900/hr", avatar: "AP", verified: true },
      { name: "Sandra Fernandes", lang: "English, Konkani, Hindi", spec: "Churches & Heritage", rating: 4.7, exp: "6 yrs", price: "₹700/hr", avatar: "SF", verified: true },
      { name: "Carlos D'Souza", lang: "English, Portuguese", spec: "Nightlife & Food", rating: 4.6, exp: "4 yrs", price: "₹600/hr", avatar: "CD", verified: false },
    ],
  },
  agra: {
    name: "Agra, Uttar Pradesh",
    places: [
      { label: "🏥 SN Medical", color: "#ef4444", x: 30, y: 30 },
      { label: "👮 Agra Police", color: "#3b82f6", x: 65, y: 25 },
      { label: "🏨 ITC Mughal", color: C.teal, x: 52, y: 58 },
      { label: "🚒 Agra Fire Stn.", color: C.orange, x: 20, y: 65 },
      { label: "🕌 Taj Mahal", color: "#8b5cf6", x: 82, y: 72 },
      { label: "🏯 Agra Fort", color: "#fbbf24", x: 40, y: 80 },
    ],
    routes: ["Taj Mahal", "Agra Fort", "Fatehpur Sikri", "Mehtab Bagh"],
    guides: [
      { name: "Imran Khan", lang: "Hindi, English, Arabic", spec: "Taj Mahal Expert", rating: 5.0, exp: "15 yrs", price: "₹1200/hr", avatar: "IK", verified: true },
      { name: "Geeta Sharma", lang: "Hindi, English, French", spec: "Mughal Architecture", rating: 4.8, exp: "8 yrs", price: "₹850/hr", avatar: "GS", verified: true },
      { name: "Suresh Yadav", lang: "Hindi, English", spec: "Local Markets", rating: 4.5, exp: "3 yrs", price: "₹500/hr", avatar: "SY", verified: false },
    ],
  },
};

// ─── ANIMATED LIVE MAP ────────────────────────────────────────────────────────
function LiveMap({ city = "chennai" }) {
  const cityData = CITIES[city] || CITIES.chennai;
  const [userPos, setUserPos] = useState({ x: 50, y: 85 });
  const [trail, setTrail] = useState([{ x: 50, y: 85 }]);
  const [tick, setTick] = useState(0);
  const pathRef = useRef([{ x: 50, y: 85 }]);

  useInterval(() => {
    setTick(t => t + 1);
    const prev = pathRef.current[pathRef.current.length - 1];
    const dx = (Math.random() - 0.5) * 3.5;
    const dy = (Math.random() - 0.5) * 3.5;
    const newPos = {
      x: Math.max(5, Math.min(95, prev.x + dx)),
      y: Math.max(5, Math.min(95, prev.y + dy)),
    };
    pathRef.current = [...pathRef.current.slice(-12), newPos];
    setUserPos(newPos);
    setTrail([...pathRef.current]);
  }, 1200);

  return (
    <div style={{ position: "relative", width: "100%", height: 240, background: "#0c1628", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` }}>
      <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}>
        {/* Grid */}
        <g opacity="0.12">
          {[0,25,50,75,100].map(v => (
            <g key={v}>
              <line x1={`${v}%`} y1="0%" x2={`${v}%`} y2="100%" stroke={C.teal} strokeWidth="0.5" />
              <line x1="0%" y1={`${v}%`} x2="100%" y2={`${v}%`} stroke={C.teal} strokeWidth="0.5" />
            </g>
          ))}
        </g>
        {/* Trail path */}
        {trail.length > 1 && (
          <polyline
            points={trail.map(p => `${p.x}%,${p.y}%`).join(" ")}
            stroke={C.teal} strokeWidth="2.5" fill="none" strokeDasharray="4 3"
            opacity="0.7" strokeLinecap="round" strokeLinejoin="round"
          />
        )}
        {/* Trail dots */}
        {trail.slice(0, -1).map((p, i) => (
          <circle key={i} cx={`${p.x}%`} cy={`${p.y}%`} r="2"
            fill={C.teal} opacity={0.15 + (i / trail.length) * 0.4} />
        ))}
        {/* Live ping animation */}
        <circle cx={`${userPos.x}%`} cy={`${userPos.y}%`} r="14" fill="none" stroke={C.teal} strokeWidth="1" opacity="0.3">
          <animate attributeName="r" values="8;20;8" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx={`${userPos.x}%`} cy={`${userPos.y}%`} r="6" fill={C.teal} stroke="#fff" strokeWidth="2" />
        <circle cx={`${userPos.x}%`} cy={`${userPos.y}%`} r="3" fill="#fff" />
      </svg>

      {/* Place markers */}
      {cityData.places.map((p, i) => (
        <div key={i} style={{
          position: "absolute", left: `${p.x}%`, top: `${p.y}%`, transform: "translate(-50%,-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: 2, zIndex: 2,
        }}>
          <div style={{ width: 9, height: 9, borderRadius: "50%", background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
          <span style={{ fontSize: 8.5, color: C.textSub, whiteSpace: "nowrap", background: "rgba(0,0,0,0.7)", padding: "1px 4px", borderRadius: 3 }}>{p.label}</span>
        </div>
      ))}

      <div style={{ position: "absolute", bottom: 8, left: 10, color: C.teal, fontSize: 10, display: "flex", alignItems: "center", gap: 4 }}>
        <PulsingDot size={5} /> Live tracking
      </div>
      <div style={{ position: "absolute", bottom: 8, right: 10, color: C.textMuted, fontSize: 10 }}>
        📍 {cityData.name}
      </div>
      <div style={{ position: "absolute", top: 8, right: 10, background: "#0c162890", borderRadius: 6, padding: "2px 8px", fontSize: 10, color: C.textSub }}>
        GPS {userPos.x.toFixed(2)}° N, {userPos.y.toFixed(2)}° E
      </div>
    </div>
  );
}

// ─── TRIP PLAN MAKER ─────────────────────────────────────────────────────────
function TripPlanMaker({ city = "chennai" }) {
  const cityData = CITIES[city] || CITIES.chennai;
  const [step, setStep] = useState(1);
  const [tripData, setTripData] = useState({
    duration: "2", budget: "medium", interests: [], groupType: "solo", startDate: "", name: ""
  });
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const interestOptions = ["🏛️ Heritage & History", "🍜 Food & Cuisine", "🏖️ Beaches & Nature", "🛍️ Shopping", "🎭 Culture & Arts", "🧘 Wellness & Yoga", "📸 Photography", "🌙 Nightlife"];
  const toggleInterest = (i) => setTripData(d => ({
    ...d, interests: d.interests.includes(i) ? d.interests.filter(x => x !== i) : [...d.interests, i]
  }));

  const generatePlan = async () => {
    setLoading(true);
    try {
      const prompt = `Create a ${tripData.duration}-day travel itinerary for ${cityData.name} for a ${tripData.groupType} traveler with ${tripData.budget} budget interested in ${tripData.interests.join(", ")}. Include: day-by-day schedule, must-see spots, safety tips, estimated costs in INR, best local food. Format as JSON with keys: title, days (array of {day, theme, morning, afternoon, evening, tips, safetyNote}), totalBudget, packingTips.`;

      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: "You are a travel planning expert for India. Always respond with valid JSON only, no markdown or backticks.",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.content?.map(b => b.text || "").join("") || "";
        const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
        setPlan(parsed);
        setStep(4);
      }
    } catch {
      setPlan({
        title: `${tripData.duration}-Day ${cityData.name} Adventure`,
        days: Array.from({ length: parseInt(tripData.duration) }, (_, i) => ({
          day: i + 1,
          theme: ["Arrival & Explore", "Culture Deep Dive", "Local Experiences", "Hidden Gems"][i] || `Day ${i + 1}`,
          morning: `Visit ${cityData.routes[i % cityData.routes.length]} – best time 8–11 AM`,
          afternoon: `Explore local cuisine and markets around the area`,
          evening: `Sunset at a scenic viewpoint, local dinner`,
          tips: "Carry water, wear comfortable shoes, keep emergency contacts saved",
          safetyNote: "Stay in well-lit areas after dark. Share your itinerary with trusted contacts.",
        })),
        totalBudget: tripData.budget === "low" ? "₹1,500–2,500/day" : tripData.budget === "medium" ? "₹3,000–5,000/day" : "₹8,000+/day",
        packingTips: ["Sunscreen SPF 50+", "Portable charger", "Local SIM card", "Cash for local markets", "Light cotton clothes"],
      });
      setStep(4);
    }
    setLoading(false);
  };

  return (
    <Card style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
        <span style={{ fontSize: 24 }}>🗓️</span>
        <div>
          <h3 style={{ color: C.text, margin: 0, fontSize: 16 }}>AI Trip Plan Maker</h3>
          <div style={{ color: C.textMuted, fontSize: 12 }}>Personalized itinerary for {cityData.name}</div>
        </div>
        {step < 4 && (
          <div style={{ marginLeft: "auto", display: "flex", gap: 4 }}>
            {[1,2,3].map(s => (
              <div key={s} style={{ width: 8, height: 8, borderRadius: "50%", background: step >= s ? C.teal : C.border }} />
            ))}
          </div>
        )}
      </div>

      {step === 1 && (
        <div>
          <div style={{ color: C.textSub, fontSize: 13, marginBottom: 14, fontWeight: 600 }}>Step 1 — Trip Basics</div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.textSub, fontSize: 13, display: "block", marginBottom: 8, fontWeight: 600 }}>Duration</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["1", "2", "3", "5", "7"].map(d => (
                <button key={d} onClick={() => setTripData(t => ({ ...t, duration: d }))} style={{
                  flex: 1, padding: "8px 4px", borderRadius: 8, border: `1.5px solid ${tripData.duration === d ? C.teal : C.border}`,
                  background: tripData.duration === d ? C.teal + "22" : "transparent", color: tripData.duration === d ? C.teal : C.textMuted,
                  cursor: "pointer", fontSize: 13, fontFamily: "inherit", fontWeight: 600,
                }}>{d}D</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.textSub, fontSize: 13, display: "block", marginBottom: 8, fontWeight: 600 }}>Group Type</label>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[["solo", "🧳 Solo"], ["couple", "👫 Couple"], ["family", "👨‍👩‍👧 Family"], ["group", "👥 Group"]].map(([val, lbl]) => (
                <button key={val} onClick={() => setTripData(t => ({ ...t, groupType: val }))} style={{
                  padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${tripData.groupType === val ? C.teal : C.border}`,
                  background: tripData.groupType === val ? C.teal + "22" : "transparent", color: tripData.groupType === val ? C.teal : C.textMuted,
                  cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                }}>{lbl}</button>
              ))}
            </div>
          </div>
          <Btn onClick={() => setStep(2)} style={{ width: "100%" }}>Next →</Btn>
        </div>
      )}

      {step === 2 && (
        <div>
          <div style={{ color: C.textSub, fontSize: 13, marginBottom: 14, fontWeight: 600 }}>Step 2 — Budget & Interests</div>
          <div style={{ marginBottom: 14 }}>
            <label style={{ color: C.textSub, fontSize: 13, display: "block", marginBottom: 8, fontWeight: 600 }}>Budget</label>
            <div style={{ display: "flex", gap: 8 }}>
              {[["low", "💰 Budget", "Under ₹2K/day"], ["medium", "💳 Mid-Range", "₹3–5K/day"], ["high", "💎 Luxury", "₹8K+/day"]].map(([val, lbl, sub]) => (
                <button key={val} onClick={() => setTripData(t => ({ ...t, budget: val }))} style={{
                  flex: 1, padding: "10px 8px", borderRadius: 8, border: `1.5px solid ${tripData.budget === val ? C.teal : C.border}`,
                  background: tripData.budget === val ? C.teal + "22" : "transparent", color: tripData.budget === val ? C.teal : C.textMuted,
                  cursor: "pointer", fontSize: 12, fontFamily: "inherit", textAlign: "center",
                }}>
                  <div style={{ fontWeight: 700 }}>{lbl}</div>
                  <div style={{ fontSize: 10, marginTop: 2, color: tripData.budget === val ? C.teal + "aa" : C.textMuted }}>{sub}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ color: C.textSub, fontSize: 13, display: "block", marginBottom: 8, fontWeight: 600 }}>Interests (pick any)</label>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {interestOptions.map(i => (
                <button key={i} onClick={() => toggleInterest(i)} style={{
                  padding: "6px 12px", borderRadius: 20, border: `1.5px solid ${tripData.interests.includes(i) ? C.teal : C.border}`,
                  background: tripData.interests.includes(i) ? C.teal + "22" : "transparent",
                  color: tripData.interests.includes(i) ? C.teal : C.textMuted,
                  cursor: "pointer", fontSize: 12, fontFamily: "inherit",
                }}>{i}</button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn outline onClick={() => setStep(1)} style={{ flex: 1 }} color={C.textMuted}>← Back</Btn>
            <Btn onClick={() => setStep(3)} style={{ flex: 2 }}>Next →</Btn>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <div style={{ color: C.textSub, fontSize: 13, marginBottom: 14, fontWeight: 600 }}>Step 3 — Finalize</div>
          <div style={{ background: "#1a2540", borderRadius: 12, padding: 16, marginBottom: 16 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                ["📍 City", cityData.name],
                ["📅 Duration", `${tripData.duration} Day${tripData.duration > 1 ? "s" : ""}`],
                ["👥 Group", tripData.groupType],
                ["💰 Budget", tripData.budget],
              ].map(([lbl, val]) => (
                <div key={lbl}>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{lbl}</div>
                  <div style={{ fontSize: 14, color: C.text, fontWeight: 600, textTransform: "capitalize" }}>{val}</div>
                </div>
              ))}
            </div>
            {tripData.interests.length > 0 && (
              <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${C.border}` }}>
                <div style={{ fontSize: 11, color: C.textMuted, marginBottom: 6 }}>Interests</div>
                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                  {tripData.interests.map(i => <Badge key={i} color={C.teal}>{i}</Badge>)}
                </div>
              </div>
            )}
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <Btn outline onClick={() => setStep(2)} style={{ flex: 1 }} color={C.textMuted}>← Back</Btn>
            <Btn onClick={generatePlan} style={{ flex: 2 }} color={C.teal}>
              {loading ? "🤖 Generating..." : "✨ Generate AI Plan"}
            </Btn>
          </div>
          {loading && (
            <div style={{ marginTop: 12, textAlign: "center", color: C.textMuted, fontSize: 12 }}>
              AI is crafting your personalized itinerary...
            </div>
          )}
        </div>
      )}

      {step === 4 && plan && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <div>
              <div style={{ color: C.teal, fontWeight: 700, fontSize: 15 }}>{plan.title}</div>
              <div style={{ color: C.textMuted, fontSize: 12 }}>Budget: {plan.totalBudget}</div>
            </div>
            <Btn small outline onClick={() => { setStep(1); setPlan(null); }} color={C.textMuted}>New Plan</Btn>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 10, maxHeight: 340, overflowY: "auto" }}>
            {plan.days?.map((d, i) => (
              <div key={i} style={{ background: "#1a2540", borderRadius: 10, padding: 14, borderLeft: `3px solid ${C.teal}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.teal + "22", color: C.teal, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 12 }}>{d.day}</div>
                  <span style={{ color: C.text, fontWeight: 700, fontSize: 13 }}>{d.theme}</span>
                </div>
                {[["🌅", "Morning", d.morning], ["☀️", "Afternoon", d.afternoon], ["🌙", "Evening", d.evening]].map(([icon, time, act]) => (
                  <div key={time} style={{ display: "flex", gap: 8, marginBottom: 6 }}>
                    <span style={{ fontSize: 12 }}>{icon}</span>
                    <div>
                      <span style={{ fontSize: 11, color: C.textMuted }}>{time}: </span>
                      <span style={{ fontSize: 12, color: C.textSub }}>{act}</span>
                    </div>
                  </div>
                ))}
                <div style={{ marginTop: 8, padding: "6px 10px", background: C.red + "11", borderRadius: 6, border: `1px solid ${C.red}22` }}>
                  <span style={{ fontSize: 11, color: C.orange }}>🛡️ {d.safetyNote}</span>
                </div>
              </div>
            ))}
            {plan.packingTips && (
              <div style={{ background: "#1a2540", borderRadius: 10, padding: 14 }}>
                <div style={{ color: C.teal, fontWeight: 700, fontSize: 13, marginBottom: 8 }}>🎒 Packing Tips</div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                  {plan.packingTips.map((t, i) => <Badge key={i} color={C.blue}>{t}</Badge>)}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </Card>
  );
}

// ─── GUIDE RECOMMENDATION ─────────────────────────────────────────────────────
function GuideRecommendation({ city = "chennai" }) {
  const cityData = CITIES[city] || CITIES.chennai;
  const [selectedGuide, setSelectedGuide] = useState(null);
  const [bookingStep, setBookingStep] = useState(null);
  const [filterLang, setFilterLang] = useState("All");
  const [aiChat, setAiChat] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResponse, setAiResponse] = useState("");

  const allLangs = ["All", ...new Set(cityData.guides.flatMap(g => g.lang.split(", ")))];

  const filteredGuides = cityData.guides.filter(g =>
    filterLang === "All" || g.lang.includes(filterLang)
  );

  const askAI = async () => {
    if (!aiChat.trim()) return;
    setAiLoading(true);
    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are a travel guide advisor for ${cityData.name}. Help tourists choose the right guide based on their needs. Be concise, helpful, and recommend from these guides: ${cityData.guides.map(g => `${g.name} (${g.spec}, speaks ${g.lang})`).join(", ")}. Keep response under 100 words.`,
          messages: [{ role: "user", content: aiChat }],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.content?.map(b => b.text || "").join("") || "");
      }
    } catch {
      setAiResponse(`For ${aiChat.includes("temple") ? "temples" : aiChat.includes("food") ? "food tours" : "your trip"}, I recommend ${cityData.guides[0].name} with ${cityData.guides[0].exp} of experience. They speak ${cityData.guides[0].lang} and specialize in ${cityData.guides[0].spec}.`);
    }
    setAiLoading(false);
    setAiChat("");
  };

  return (
    <Card style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <span style={{ fontSize: 22 }}>🧭</span>
        <div>
          <h3 style={{ color: C.text, margin: 0, fontSize: 15 }}>Find a Local Guide</h3>
          <div style={{ color: C.textMuted, fontSize: 12 }}>Verified guides in {cityData.name}</div>
        </div>
      </div>

      {/* AI Ask */}
      <div style={{ background: "#1a2540", borderRadius: 10, padding: 12, marginBottom: 16 }}>
        <div style={{ fontSize: 12, color: C.teal, marginBottom: 8, fontWeight: 600 }}>🤖 Ask AI to match you with the perfect guide</div>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={aiChat} onChange={e => setAiChat(e.target.value)}
            onKeyDown={e => e.key === "Enter" && askAI()}
            placeholder='e.g. "I want a guide who speaks French for temple visits"'
            style={{ flex: 1, background: "#0a0e1a", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 12, fontFamily: "inherit", outline: "none" }}
          />
          <button onClick={askAI} style={{ background: C.teal, border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: 700, color: "#000" }}>→</button>
        </div>
        {aiLoading && <div style={{ color: C.textMuted, fontSize: 12, marginTop: 8 }}>🤖 Finding your perfect guide...</div>}
        {aiResponse && !aiLoading && (
          <div style={{ marginTop: 10, padding: "8px 12px", background: C.teal + "11", borderRadius: 8, border: `1px solid ${C.teal}33`, fontSize: 12, color: C.textSub, lineHeight: 1.5 }}>
            {aiResponse}
          </div>
        )}
      </div>

      {/* Language filter */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 14 }}>
        {allLangs.map(l => (
          <button key={l} onClick={() => setFilterLang(l)} style={{
            padding: "4px 12px", borderRadius: 20, border: `1px solid ${filterLang === l ? C.teal : C.border}`,
            background: filterLang === l ? C.teal + "22" : "transparent", color: filterLang === l ? C.teal : C.textMuted,
            cursor: "pointer", fontSize: 11, fontFamily: "inherit",
          }}>{l}</button>
        ))}
      </div>

      {/* Guide cards */}
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {filteredGuides.map((g, i) => (
          <div key={i} onClick={() => setSelectedGuide(selectedGuide === i ? null : i)}
            style={{
              background: selectedGuide === i ? "#1e2d4a" : "#1a2540", borderRadius: 12, padding: 14,
              border: `1.5px solid ${selectedGuide === i ? C.teal : C.border}`, cursor: "pointer",
              transition: "all 0.2s",
            }}>
            <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: `linear-gradient(135deg, ${C.teal}33, ${C.blue}33)`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, color: C.teal, fontSize: 14, flexShrink: 0 }}>
                {g.avatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{g.name}</span>
                  {g.verified && <span style={{ fontSize: 10, background: C.teal + "22", color: C.teal, border: `1px solid ${C.teal}44`, borderRadius: 10, padding: "1px 6px" }}>✓ Verified</span>}
                </div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>🎯 {g.spec}</div>
                <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>🗣️ {g.lang}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.yellow }}>⭐ {g.rating}</div>
                <div style={{ fontSize: 12, color: C.teal, fontWeight: 600 }}>{g.price}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>{g.exp}</div>
              </div>
            </div>

            {selectedGuide === i && (
              <div style={{ marginTop: 14, paddingTop: 12, borderTop: `1px solid ${C.border}` }}>
                {bookingStep === i ? (
                  <div>
                    <div style={{ fontSize: 13, color: C.teal, fontWeight: 600, marginBottom: 10 }}>📅 Book {g.name}</div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
                      {[["Date", "📅"], ["Start Time", "⏰"], ["Duration (hrs)", "⌛"], ["Meeting Point", "📍"]].map(([lbl, icon]) => (
                        <div key={lbl}>
                          <label style={{ fontSize: 11, color: C.textMuted, display: "block", marginBottom: 4 }}>{icon} {lbl}</label>
                          <input style={{ width: "100%", background: "#0a0e1a", border: `1px solid ${C.border}`, borderRadius: 6, padding: "6px 8px", color: C.text, fontSize: 12, fontFamily: "inherit", outline: "none", boxSizing: "border-box" }} placeholder={lbl} />
                        </div>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: 8 }}>
                      <Btn small outline onClick={() => setBookingStep(null)} color={C.textMuted}>Cancel</Btn>
                      <Btn small color={C.teal} onClick={() => { alert(`✅ Booking request sent to ${g.name}! They will contact you within 30 minutes.`); setBookingStep(null); }}>Confirm Booking</Btn>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn small color={C.teal} onClick={() => setBookingStep(i)}>📅 Book Now</Btn>
                    <Btn small outline color={C.blue}>💬 Message</Btn>
                    <Btn small outline color={C.textMuted}>📞 Call</Btn>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ─── AI CHATBOT ───────────────────────────────────────────────────────────────
function AIChatbot({ onClose, city = "chennai" }) {
  const cityData = CITIES[city] || CITIES.chennai;
  const [msgs, setMsgs] = useState([
    { role: "bot", text: `Hello! I'm SafeTrail AI. I'm here to help you explore ${cityData.name} safely! 🛡️` },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef();

  const sendMsg = useCallback(async () => {
    if (!input.trim()) return;
    const userMsg = { role: "user", text: input };
    setMsgs(m => [...m, userMsg]);
    const userInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: `You are SafeTrail AI, a smart tourism safety assistant for ${cityData.name}, India. Help tourists with emergency info, safe routes, crowd alerts, nearby services, scam warnings, travel tips, and local recommendations. Be concise, use emojis, prioritize safety. Respond as if you have real-time local data.`,
          messages: [{ role: "user", content: userInput }],
        }),
      });
      if (res.ok) {
        const data = await res.json();
        const text = data.content?.map(b => b.text || "").join("") || "I'm here to help! Ask me about safety, routes, or local tips.";
        setMsgs(m => [...m, { role: "bot", text }]);
      } else {
        setMsgs(m => [...m, { role: "bot", text: "I can help with: nearby hospitals, safe routes, emergency contacts, weather alerts, crowd density, scam reports. What would you like to know?" }]);
      }
    } catch {
      setMsgs(m => [...m, { role: "bot", text: "Connection issue. For emergencies: Police 100 | Ambulance 108 | Fire 101" }]);
    }
    setLoading(false);
  }, [input, cityData]);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs, loading]);

  const quickReplies = ["Nearest hospital", "Safe route", "Emergency contacts", "Local scams to avoid", "Best local food"];

  return (
    <div style={{ position: "fixed", bottom: 90, right: 20, width: 340, height: 480, zIndex: 1000, display: "flex", flexDirection: "column", ...glassStyle }}>
      <div style={{ padding: "14px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: `linear-gradient(135deg, ${C.teal}, ${C.blue})`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🛡️</div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 14, color: C.text }}>SafeTrail AI</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: C.teal }}>
            <PulsingDot size={6} /> Online • {cityData.name}
          </div>
        </div>
        <button onClick={onClose} style={{ marginLeft: "auto", background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 18 }}>×</button>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: 12, display: "flex", flexDirection: "column", gap: 10 }}>
        {msgs.map((m, i) => (
          <div key={i} style={{ display: "flex", justifyContent: m.role === "user" ? "flex-end" : "flex-start" }}>
            <div style={{
              maxWidth: "80%", padding: "8px 12px", borderRadius: m.role === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
              background: m.role === "user" ? C.teal : "#1a2540", color: m.role === "user" ? "#000" : C.text,
              fontSize: 13, lineHeight: 1.5, whiteSpace: "pre-wrap",
            }}>{m.text}</div>
          </div>
        ))}
        {loading && (
          <div style={{ display: "flex", gap: 4, padding: "8px 12px" }}>
            {[0,1,2].map(i => <div key={i} style={{ width: 6, height: 6, borderRadius: "50%", background: C.teal, animation: `bounce 1s ${i*0.2}s infinite` }} />)}
          </div>
        )}
        <div ref={bottomRef} />
      </div>
      <div style={{ padding: 8, borderTop: `1px solid ${C.border}` }}>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 8 }}>
          {quickReplies.map(q => (
            <button key={q} onClick={() => setInput(q)} style={{
              background: "transparent", border: `1px solid ${C.border}`, borderRadius: 20, padding: "3px 8px",
              fontSize: 11, color: C.textSub, cursor: "pointer", fontFamily: "inherit",
            }}>{q}</button>
          ))}
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMsg()}
            placeholder="Ask anything…"
            style={{ flex: 1, background: "#0a0e1a", border: `1px solid ${C.border}`, borderRadius: 8, padding: "8px 12px", color: C.text, fontSize: 13, fontFamily: "inherit", outline: "none" }}
          />
          <button onClick={sendMsg} style={{ background: C.teal, border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: 700, color: "#000", fontSize: 14 }}>→</button>
        </div>
      </div>
    </div>
  );
}

// ─── SOS BUTTON ───────────────────────────────────────────────────────────────
function SOSButton() {
  const [active, setActive] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sent, setSent] = useState(false);
  const trigger = () => {
    if (sent) { setActive(false); setSent(false); setCountdown(0); return; }
    if (!active) { setActive(true); setCountdown(5); }
  };
  useInterval(() => {
    if (active && countdown > 0) setCountdown(c => c - 1);
    if (active && countdown === 1) setSent(true);
  }, active && !sent ? 1000 : null);
  return (
    <div style={{ textAlign: "center" }}>
      <div onClick={trigger} style={{
        width: 100, height: 100, borderRadius: "50%",
        background: sent ? "#00d4aa22" : "#ef444422", border: `3px solid ${sent ? C.teal : C.red}`,
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        cursor: "pointer", transition: "all 0.3s", boxShadow: active ? `0 0 30px ${sent ? C.teal : C.red}66` : "none", margin: "0 auto",
      }}>
        <span style={{ fontSize: 28 }}>{sent ? "✅" : "🆘"}</span>
        <span style={{ fontSize: 11, fontWeight: 700, color: sent ? C.teal : C.red, marginTop: 2 }}>
          {sent ? "SENT" : active ? `ALERT IN ${countdown}s` : "SOS"}
        </span>
      </div>
      {active && !sent && (
        <button onClick={() => { setActive(false); setCountdown(0); }} style={{
          marginTop: 8, background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8,
          padding: "4px 14px", color: C.textSub, cursor: "pointer", fontSize: 12, fontFamily: "inherit",
        }}>Cancel</button>
      )}
      {sent && <p style={{ color: C.teal, fontSize: 12, marginTop: 6 }}>Alert sent to 3 contacts + authorities</p>}
    </div>
  );
}

function SafetyGauge({ score = 87 }) {
  const angle = ((score / 100) * 180) - 90;
  const r = 60, cx = 80, cy = 80;
  const arc = (a) => {
    const rad = (a * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  };
  const startP = arc(-180), endP = arc(0), thumbP = arc(angle - 90);
  const color = score > 75 ? C.teal : score > 50 ? C.yellow : C.red;
  return (
    <div style={{ textAlign: "center" }}>
      <svg width={160} height={90} viewBox="0 0 160 90">
        <path d={`M ${startP.x} ${startP.y} A ${r} ${r} 0 0 1 ${endP.x} ${endP.y}`} fill="none" stroke="#1a2540" strokeWidth={10} strokeLinecap="round" />
        <path d={`M ${startP.x} ${startP.y} A ${r} ${r} 0 0 1 ${thumbP.x} ${thumbP.y}`} fill="none" stroke={color} strokeWidth={10} strokeLinecap="round" />
        <circle cx={thumbP.x} cy={thumbP.y} r={6} fill={color} />
        <text x={cx} y={cy + 10} textAnchor="middle" fill={color} fontSize={24} fontWeight={700}>{score}</text>
        <text x={cx} y={cy + 22} textAnchor="middle" fill={C.textMuted} fontSize={9}>SAFETY SCORE</text>
      </svg>
    </div>
  );
}

function WeatherWidget() {
  const data = { temp: 34, cond: "Partly Cloudy", humidity: 78, wind: 18, uv: 8, alert: "Heat Advisory" };
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
      <div style={{ background: "#1a2540", borderRadius: 10, padding: "10px 14px", gridColumn: "1/-1" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 32, fontWeight: 800, color: C.text }}>{data.temp}°C</div>
            <div style={{ color: C.textSub, fontSize: 13 }}>{data.cond}</div>
          </div>
          <span style={{ fontSize: 42 }}>⛅</span>
        </div>
        {data.alert && <div style={{ marginTop: 8, background: C.orange + "22", border: `1px solid ${C.orange}44`, borderRadius: 6, padding: "4px 10px", fontSize: 11, color: C.orange }}>⚠️ {data.alert}</div>}
      </div>
      {[["💧", "Humidity", data.humidity + "%"], ["💨", "Wind", data.wind + " km/h"], ["☀️", "UV Index", data.uv + "/11"]].map(([icon, lbl, val]) => (
        <div key={lbl} style={{ background: "#1a2540", borderRadius: 10, padding: "10px 14px" }}>
          <div style={{ fontSize: 18 }}>{icon}</div>
          <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{lbl}</div>
          <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{val}</div>
        </div>
      ))}
    </div>
  );
}

function CrowdDensity({ areas }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {areas.map(({ name, pct, level }) => {
        const color = level === "high" ? C.red : level === "medium" ? C.yellow : C.teal;
        return (
          <div key={name}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <span style={{ fontSize: 12, color: C.textSub }}>{name}</span>
              <Badge color={color}>{level}</Badge>
            </div>
            <div style={{ height: 6, background: "#1a2540", borderRadius: 3, overflow: "hidden" }}>
              <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 3 }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

function StatCard({ icon, label, value, sub, color = C.teal }) {
  return (
    <Card style={{ padding: "14px 16px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ width: 42, height: 42, borderRadius: 12, background: color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, flexShrink: 0 }}>{icon}</div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 22, color }}>{value}</div>
          <div style={{ fontSize: 12, color: C.textMuted }}>{label}</div>
          {sub && <div style={{ fontSize: 11, color: color + "aa", marginTop: 2 }}>{sub}</div>}
        </div>
      </div>
    </Card>
  );
}

function NotifPanel({ onClose }) {
  const notifs = [
    { icon: "🚨", text: "SOS alert from Tourist #T-2291 near Marina Beach", time: "2 min ago", color: C.red, urgent: true },
    { icon: "👥", text: "High crowd density at T. Nagar Market – rerouting suggested", time: "8 min ago", color: C.orange },
    { icon: "🌡️", text: "Heat advisory issued: 34°C – remind tourists to hydrate", time: "1 hr ago", color: C.yellow },
    { icon: "✅", text: "Volunteer Priya M. resolved Case #4421 – tourist assisted", time: "2 hr ago", color: C.teal },
    { icon: "📋", text: "New scam report filed – auto-rickshaw overcharging at airport", time: "3 hr ago", color: C.blue },
  ];
  return (
    <div style={{ position: "fixed", top: 60, right: 16, width: 320, zIndex: 999, ...glassStyle }}>
      <div style={{ padding: "12px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontWeight: 700, color: C.text }}>Notifications</span>
        <button onClick={onClose} style={{ background: "none", border: "none", color: C.textMuted, cursor: "pointer", fontSize: 18 }}>×</button>
      </div>
      {notifs.map((n, i) => (
        <div key={i} style={{ padding: "10px 16px", borderBottom: `1px solid ${C.border}`, display: "flex", gap: 10, background: n.urgent ? C.red + "0a" : "transparent" }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>{n.icon}</span>
          <div>
            <div style={{ fontSize: 12, color: C.text, lineHeight: 1.4 }}>{n.text}</div>
            <div style={{ fontSize: 11, color: C.textMuted, marginTop: 3 }}>{n.time}</div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── AUTH PAGE ────────────────────────────────────────────────────────────────
function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("tourist");
  const [err, setErr] = useState("");

  const submit = () => {
    if (!email || !password) { setErr("Please fill in all fields"); return; }
    if (mode === "signup" && !name) { setErr("Please enter your name"); return; }
    const validRoles = { "admin@safetrail.com": "admin", "volunteer@safetrail.com": "volunteer" };
    const detectedRole = validRoles[email] || role;
    onLogin({ email, name: name || email.split("@")[0], role: detectedRole });
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden" }}>
      <StarField />
      <div style={{ position: "absolute", top: "20%", left: "10%", width: 300, height: 300, borderRadius: "50%", background: `${C.teal}0a`, filter: "blur(60px)" }} />
      <div style={{ position: "absolute", bottom: "20%", right: "10%", width: 250, height: 250, borderRadius: "50%", background: `${C.blue}0a`, filter: "blur(60px)" }} />
      <Card style={{ width: "100%", maxWidth: 440, padding: 36, position: "relative" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 10 }}>🛡️</div>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: C.text, margin: 0 }}>SafeTrail AI</h1>
          <p style={{ color: C.textMuted, fontSize: 13, margin: "6px 0 0" }}>Smart Tourism Safety Platform • India</p>
        </div>
        <div style={{ display: "flex", background: "#0a0e1a", borderRadius: 10, padding: 4, marginBottom: 24 }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setErr(""); }} style={{
              flex: 1, padding: "8px", borderRadius: 8, border: "none", cursor: "pointer",
              background: mode === m ? C.teal : "transparent", color: mode === m ? "#000" : C.textMuted,
              fontWeight: 700, fontSize: 13, fontFamily: "inherit", transition: "all 0.2s", textTransform: "capitalize",
            }}>{m === "login" ? "Sign In" : "Sign Up"}</button>
          ))}
        </div>
        {mode === "signup" && <Input label="Full Name" value={name} onChange={setName} placeholder="John Doe" icon="👤" />}
        <Input label="Email" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon="✉️" />
        <Input label="Password" type="password" value={password} onChange={setPassword} placeholder="••••••••" icon="🔒" />
        {mode === "signup" && (
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: "block", color: C.textSub, fontSize: 13, marginBottom: 6, fontWeight: 600 }}>Role</label>
            <div style={{ display: "flex", gap: 8 }}>
              {["tourist", "volunteer", "admin"].map(r => (
                <button key={r} onClick={() => setRole(r)} style={{
                  flex: 1, padding: "8px", borderRadius: 8, border: `1.5px solid ${role === r ? C.teal : C.border}`,
                  background: role === r ? C.teal + "22" : "transparent", color: role === r ? C.teal : C.textMuted,
                  cursor: "pointer", fontSize: 12, fontWeight: 600, fontFamily: "inherit", textTransform: "capitalize",
                }}>{r === "tourist" ? "🧳" : r === "volunteer" ? "🤝" : "⚙️"} {r}</button>
              ))}
            </div>
          </div>
        )}
        {err && <div style={{ background: C.red + "22", border: `1px solid ${C.red}44`, borderRadius: 8, padding: "8px 12px", color: C.red, fontSize: 13, marginBottom: 14 }}>{err}</div>}
        <Btn onClick={submit} style={{ width: "100%" }}>{mode === "login" ? "Sign In →" : "Create Account →"}</Btn>
        <div style={{ marginTop: 20, paddingTop: 16, borderTop: `1px solid ${C.border}` }}>
          <p style={{ fontSize: 11, color: C.textMuted, textAlign: "center", marginBottom: 10 }}>Quick demo access:</p>
          <div style={{ display: "flex", gap: 8 }}>
            {[["Tourist", "tourist@demo.com", "tourist"], ["Admin", "admin@safetrail.com", "admin"], ["Volunteer", "volunteer@safetrail.com", "volunteer"]].map(([lbl, em, r]) => (
              <button key={lbl} onClick={() => onLogin({ email: em, name: lbl, role: r })} style={{
                flex: 1, padding: "6px", borderRadius: 8, border: `1px solid ${C.border}`,
                background: "transparent", color: C.textSub, cursor: "pointer", fontSize: 11, fontFamily: "inherit",
              }}>{lbl}</button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

// ─── TOURIST DASHBOARD ────────────────────────────────────────────────────────
function TouristDashboard({ user, city }) {
  const cityData = CITIES[city] || CITIES.chennai;
  const [activeTab, setActiveTab] = useState("overview");
  const [reports, setReports] = useState([]);
  const [reportForm, setReportForm] = useState({ type: "lost", desc: "" });
  const [submitted, setSubmitted] = useState(false);
  const [womenMode, setWomenMode] = useState(false);
  const [timer, setTimer] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [contacts] = useState([
    { name: "Mom", phone: "+91 98765 43210" },
    { name: "Hotel Staff", phone: "+91 44 1234 5678" },
  ]);

  useInterval(() => {
    if (timerActive && timer > 0) setTimer(t => t - 1);
    if (timerActive && timer === 1) alert("Safety timer expired! SOS being sent...");
  }, timerActive ? 1000 : null);

  const submitReport = () => {
    if (!reportForm.desc) return;
    setReports(r => [...r, { ...reportForm, id: Date.now(), status: "Submitted", time: new Date().toLocaleTimeString() }]);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setReportForm({ type: "lost", desc: "" });
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "🏠" },
    { id: "map", label: "Live Map", icon: "🗺️" },
    { id: "tripplan", label: "Trip Planner", icon: "🗓️" },
    { id: "guides", label: "Find Guide", icon: "🧭" },
    { id: "report", label: "Report", icon: "📋" },
    { id: "women", label: "Women Safety", icon: "🌸" },
    { id: "history", label: "Trip History", icon: "📊" },
  ];

  const crowdAreas = cityData.routes.map((r, i) => ({
    name: r,
    pct: [88, 55, 22, 60][i % 4],
    level: ["high", "medium", "low", "medium"][i % 4],
  }));

  return (
    <div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${activeTab === t.id ? C.teal : C.border}`,
            background: activeTab === t.id ? C.teal + "22" : "transparent", color: activeTab === t.id ? C.teal : C.textMuted,
            cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
            display: "flex", alignItems: "center", gap: 6,
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
            <StatCard icon="🛡️" label="Safety Score" value="87" sub="↑ from 82 yesterday" color={C.teal} />
            <StatCard icon="👥" label="Crowd Level" value="High" sub="Main tourist area" color={C.red} />
            <StatCard icon="🌡️" label="Temperature" value="34°C" sub="Heat advisory" color={C.orange} />
            <StatCard icon="📍" label="Location" value="Active" sub={cityData.name} color={C.blue} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card style={{ padding: 16 }}>
              <h3 style={{ color: C.text, margin: "0 0 12px", fontSize: 14, fontWeight: 700 }}>🗺️ Live Location</h3>
              <LiveMap city={city} />
            </Card>
            <Card style={{ padding: 16 }}>
              <h3 style={{ color: C.text, margin: "0 0 12px", fontSize: 14, fontWeight: 700 }}>🆘 Emergency SOS</h3>
              <SOSButton />
              <div style={{ marginTop: 14, display: "flex", flexDirection: "column", gap: 6 }}>
                {[["🏥", "Nearest Hospital", "1.2 km"], ["👮", "Police Station", "0.8 km"], ["🚒", "Fire Station", "2.1 km"]].map(([ic, lbl, dist]) => (
                  <div key={lbl} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#1a2540", borderRadius: 8 }}>
                    <span>{ic}</span>
                    <span style={{ fontSize: 12, color: C.text, flex: 1 }}>{lbl}</span>
                    <span style={{ fontSize: 11, color: C.teal }}>{dist}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card style={{ padding: 16 }}>
              <h3 style={{ color: C.text, margin: "0 0 12px", fontSize: 14, fontWeight: 700 }}>⛅ Weather</h3>
              <WeatherWidget />
            </Card>
            <Card style={{ padding: 16 }}>
              <h3 style={{ color: C.text, margin: "0 0 12px", fontSize: 14, fontWeight: 700 }}>👥 Crowd Density</h3>
              <CrowdDensity areas={crowdAreas} />
            </Card>
          </div>
        </div>
      )}

      {activeTab === "map" && (
        <Card style={{ padding: 16 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <h3 style={{ color: C.text, margin: 0, fontSize: 16 }}>🗺️ Live Interactive Map</h3>
            <div style={{ display: "flex", gap: 8 }}>
              <Badge>GPS Active</Badge>
              <Badge color={C.orange}>Route Tracking</Badge>
            </div>
          </div>
          <LiveMap city={city} />
          <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <Btn color={C.teal} small>🏥 Find Hospitals</Btn>
            <Btn color={C.blue} small>👮 Police Stations</Btn>
            <Btn color={C.orange} small>🔒 Safe Zones</Btn>
            <Btn color={C.purple} small>🧭 Safe Route</Btn>
          </div>
          <div style={{ marginTop: 14 }}>
            <h4 style={{ color: C.textSub, fontSize: 13, margin: "0 0 8px" }}>Route Safety Analysis</h4>
            {[["Route A – Local Streets", 45, "low"], ["Route B – Main Road", 92, "high"], ["Route C – Bypass", 78, "medium"]].map(([name, score, level]) => (
              <div key={name} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <span style={{ fontSize: 12, color: C.text, flex: 1 }}>{name}</span>
                <div style={{ flex: 2, height: 6, background: "#1a2540", borderRadius: 3, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${score}%`, background: level === "high" ? C.teal : level === "medium" ? C.yellow : C.red, borderRadius: 3 }} />
                </div>
                <span style={{ fontSize: 12, fontWeight: 700, color: level === "high" ? C.teal : level === "medium" ? C.yellow : C.red, minWidth: 30 }}>{score}%</span>
              </div>
            ))}
          </div>
        </Card>
      )}

      {activeTab === "tripplan" && <TripPlanMaker city={city} />}
      {activeTab === "guides" && <GuideRecommendation city={city} />}

      {activeTab === "report" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ padding: 20 }}>
            <h3 style={{ color: C.text, margin: "0 0 16px", fontSize: 16 }}>📋 File a Report</h3>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", color: C.textSub, fontSize: 13, marginBottom: 8, fontWeight: 600 }}>Report Type</label>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {[["lost", "🔍 Lost Item"], ["scam", "⚠️ Scam/Fraud"], ["incident", "🚨 Incident"]].map(([val, lbl]) => (
                  <button key={val} onClick={() => setReportForm(r => ({ ...r, type: val }))} style={{
                    padding: "8px 14px", borderRadius: 8, border: `1.5px solid ${reportForm.type === val ? C.teal : C.border}`,
                    background: reportForm.type === val ? C.teal + "22" : "transparent", color: reportForm.type === val ? C.teal : C.textMuted,
                    cursor: "pointer", fontSize: 13, fontFamily: "inherit",
                  }}>{lbl}</button>
                ))}
              </div>
            </div>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: "block", color: C.textSub, fontSize: 13, marginBottom: 6, fontWeight: 600 }}>Description</label>
              <textarea value={reportForm.desc} onChange={e => setReportForm(r => ({ ...r, desc: e.target.value }))}
                placeholder="Describe the incident in detail…" rows={4}
                style={{ width: "100%", background: "#0a0e1a", border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, color: C.text, fontSize: 14, fontFamily: "inherit", resize: "vertical", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            {submitted && <div style={{ background: C.teal + "22", border: `1px solid ${C.teal}44`, borderRadius: 8, padding: "8px 12px", color: C.teal, fontSize: 13, marginBottom: 12 }}>✅ Report submitted successfully!</div>}
            <Btn onClick={submitReport}>Submit Report →</Btn>
          </Card>
          {reports.length > 0 && (
            <Card style={{ padding: 20 }}>
              <h3 style={{ color: C.text, margin: "0 0 12px", fontSize: 15 }}>📁 Your Reports</h3>
              {reports.map(r => (
                <div key={r.id} style={{ padding: "10px 14px", background: "#1a2540", borderRadius: 10, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 13, color: C.text, fontWeight: 600, textTransform: "capitalize" }}>{r.type} Report</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{r.desc.slice(0, 50)}…</div>
                    <div style={{ fontSize: 11, color: C.textMuted, marginTop: 2 }}>{r.time}</div>
                  </div>
                  <Badge color={C.teal}>{r.status}</Badge>
                </div>
              ))}
            </Card>
          )}
        </div>
      )}

      {activeTab === "women" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ padding: 20, background: womenMode ? "#1a0a2e" : C.bgCard, border: `1px solid ${womenMode ? C.purple : C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h3 style={{ color: C.text, margin: 0, fontSize: 16 }}>🌸 Women Safety Mode</h3>
              <button onClick={() => setWomenMode(w => !w)} style={{
                background: womenMode ? C.purple : "transparent", border: `2px solid ${C.purple}`,
                borderRadius: 20, padding: "6px 16px", cursor: "pointer", color: womenMode ? "#fff" : C.purple,
                fontWeight: 700, fontSize: 13, fontFamily: "inherit",
              }}>{womenMode ? "ACTIVE" : "Activate"}</button>
            </div>
            {womenMode && (
              <div style={{ background: C.purple + "22", border: `1px solid ${C.purple}44`, borderRadius: 10, padding: 14, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: C.purple, fontWeight: 700, fontSize: 14 }}>
                  <PulsingDot color={C.purple} /> Women Safety Mode Active – Location being monitored
                </div>
              </div>
            )}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 16 }}>
              <div>
                <h4 style={{ color: C.textSub, fontSize: 13, margin: "0 0 10px" }}>Safety Timer</h4>
                <div style={{ background: "#1a2540", borderRadius: 10, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 800, color: timer > 0 && timerActive ? C.orange : C.text, fontFamily: "monospace" }}>
                    {Math.floor(timer / 60).toString().padStart(2, "0")}:{(timer % 60).toString().padStart(2, "0")}
                  </div>
                  <div style={{ display: "flex", gap: 8, marginTop: 10, justifyContent: "center" }}>
                    <Btn small color={C.teal} onClick={() => { setTimer(1800); setTimerActive(true); }}>Set 30min</Btn>
                    <Btn small color={timerActive ? C.red : C.textMuted} outline onClick={() => setTimerActive(a => !a)}>{timerActive ? "Pause" : "Start"}</Btn>
                  </div>
                </div>
              </div>
              <div>
                <h4 style={{ color: C.textSub, fontSize: 13, margin: "0 0 10px" }}>Emergency SOS</h4>
                <SOSButton />
              </div>
            </div>
            <h4 style={{ color: C.textSub, fontSize: 13, margin: "0 0 10px" }}>Trusted Contacts</h4>
            {contacts.map((c, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", background: "#1a2540", borderRadius: 8, marginBottom: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: C.purple + "33", display: "flex", alignItems: "center", justifyContent: "center", color: C.purple, fontSize: 16 }}>👤</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{c.name}</div>
                  <div style={{ fontSize: 11, color: C.textMuted }}>{c.phone}</div>
                </div>
                <Btn small outline color={C.teal}>Call</Btn>
              </div>
            ))}
          </Card>
        </div>
      )}

      {activeTab === "history" && (
        <Card style={{ padding: 20 }}>
          <h3 style={{ color: C.text, margin: "0 0 16px" }}>📊 Trip History</h3>
          {[
            { dest: cityData.routes[0], date: "Today", score: 87, duration: "3h 20m", status: "active" },
            { dest: cityData.routes[1] || "Local Market", date: "Yesterday", score: 95, duration: "2h 10m", status: "completed" },
            { dest: cityData.routes[2] || "City Center", date: "2 days ago", score: 72, duration: "4h 45m", status: "completed" },
            { dest: cityData.routes[3] || "Shopping Mall", date: "3 days ago", score: 91, duration: "1h 30m", status: "completed" },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "12px", background: "#1a2540", borderRadius: 10, marginBottom: 8 }}>
              <div style={{ width: 42, height: 42, borderRadius: 10, background: C.teal + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>📍</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 14, color: C.text, fontWeight: 600 }}>{t.dest}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{t.date} • {t.duration}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: t.score > 80 ? C.teal : C.yellow }}>{t.score}</div>
                <div style={{ fontSize: 11, color: C.textMuted }}>safety</div>
              </div>
              <Badge color={t.status === "active" ? C.teal : C.textMuted}>{t.status}</Badge>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ─── ADMIN DASHBOARD ──────────────────────────────────────────────────────────
function AdminDashboard({ city }) {
  const cityData = CITIES[city] || CITIES.chennai;
  const [activeTab, setActiveTab] = useState("overview");
  const [cases, setCases] = useState([
    { id: "E-4421", type: "SOS Alert", loc: cityData.routes[0], tourist: "Raj Kumar", status: "active", priority: "high", time: "5 min ago" },
    { id: "E-4420", type: "Lost Item", loc: cityData.routes[1] || "Market", tourist: "Sarah Kim", status: "pending", priority: "medium", time: "18 min ago" },
    { id: "E-4419", type: "Scam Report", loc: "Airport", tourist: "Liu Wei", status: "resolved", priority: "low", time: "2 hr ago" },
    { id: "E-4418", type: "Medical Help", loc: cityData.routes[2] || "Hotel Zone", tourist: "Emma Wilson", status: "resolved", priority: "high", time: "4 hr ago" },
  ]);
  const [volunteers] = useState([
    { name: "Priya M.", status: "available", area: cityData.routes[0], cases: 12 },
    { name: "Karthik R.", status: "on-duty", area: cityData.routes[1] || "Market Area", cases: 8 },
    { name: "Anita S.", status: "available", area: "City Center", cases: 15 },
    { name: "David L.", status: "offline", area: "Airport Zone", cases: 6 },
  ]);

  const tabs = [
    { id: "overview", label: "Overview", icon: "📊" },
    { id: "cases", label: "Cases", icon: "🚨" },
    { id: "volunteers", label: "Volunteers", icon: "🤝" },
    { id: "analytics", label: "Analytics", icon: "📈" },
    { id: "heatmap", label: "Heatmap", icon: "🔥" },
  ];

  const crowdAreas = cityData.routes.map((r, i) => ({
    name: r, pct: [88, 55, 30, 68][i % 4], level: ["high", "medium", "low", "medium"][i % 4],
  }));

  const resolveCase = (id) => setCases(cs => cs.map(c => c.id === id ? { ...c, status: "resolved" } : c));

  const analyticsData = [
    { label: "SOS Alerts", value: 12, trend: "+3", color: C.red },
    { label: "Active Tourists", value: 248, trend: "+18", color: C.teal },
    { label: "Incidents Resolved", value: 94, trend: "+5%", color: C.blue },
    { label: "Avg Response Time", value: "4.2m", trend: "-0.8m", color: C.teal },
    { label: "Volunteers Active", value: 18, trend: "+2", color: C.purple },
    { label: "Safety Score Avg", value: "83/100", trend: "+2", color: C.teal },
  ];

  return (
    <div>
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 20, paddingBottom: 4 }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} style={{
            padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${activeTab === t.id ? C.teal : C.border}`,
            background: activeTab === t.id ? C.teal + "22" : "transparent", color: activeTab === t.id ? C.teal : C.textMuted,
            cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600, whiteSpace: "nowrap",
            display: "flex", alignItems: "center", gap: 6,
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {activeTab === "overview" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 12 }}>
            {analyticsData.map(a => (
              <StatCard key={a.label} icon={a.label.includes("SOS") ? "🚨" : a.label.includes("Tourist") ? "🧳" : a.label.includes("Resolved") ? "✅" : a.label.includes("Response") ? "⏱️" : a.label.includes("Volunteer") ? "🤝" : "🛡️"} label={a.label} value={a.value} sub={`${a.trend} today`} color={a.color} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Card style={{ padding: 16 }}>
              <h3 style={{ color: C.text, margin: "0 0 12px", fontSize: 14 }}>🗺️ Live Tourist Map</h3>
              <LiveMap city={city} />
              <div style={{ marginTop: 10, display: "flex", gap: 6, flexWrap: "wrap" }}>
                <Badge color={C.teal}>248 tourists</Badge>
                <Badge color={C.red}>3 SOS active</Badge>
                <Badge color={C.orange}>High crowd zone</Badge>
              </div>
            </Card>
            <Card style={{ padding: 16 }}>
              <h3 style={{ color: C.text, margin: "0 0 12px", fontSize: 14 }}>🚨 Recent Emergencies</h3>
              {cases.filter(c => c.status === "active").map(c => (
                <div key={c.id} style={{ padding: "10px", background: C.red + "0a", border: `1px solid ${C.red}33`, borderRadius: 8, marginBottom: 8 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 13, color: C.text, fontWeight: 700 }}>{c.id} – {c.type}</div>
                      <div style={{ fontSize: 12, color: C.textMuted }}>{c.tourist} • {c.loc} • {c.time}</div>
                    </div>
                    <Btn small color={C.teal} onClick={() => resolveCase(c.id)}>Resolve</Btn>
                  </div>
                </div>
              ))}
            </Card>
          </div>
          <Card style={{ padding: 16 }}>
            <h3 style={{ color: C.text, margin: "0 0 12px", fontSize: 14 }}>👥 Crowd Density Monitor</h3>
            <CrowdDensity areas={crowdAreas} />
          </Card>
        </div>
      )}

      {activeTab === "cases" && (
        <Card style={{ padding: 20 }}>
          <h3 style={{ color: C.text, margin: "0 0 16px" }}>🚨 Emergency Case Management</h3>
          {cases.map(c => {
            const priColor = c.priority === "high" ? C.red : c.priority === "medium" ? C.orange : C.teal;
            const statColor = c.status === "active" ? C.red : c.status === "pending" ? C.orange : C.teal;
            return (
              <div key={c.id} style={{ padding: "14px", background: "#1a2540", borderRadius: 10, marginBottom: 10, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
                <div style={{ width: 8, height: 40, borderRadius: 4, background: priColor, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{c.id}</span>
                    <Badge color={priColor}>{c.priority}</Badge>
                    <Badge color={statColor}>{c.status}</Badge>
                  </div>
                  <div style={{ fontSize: 13, color: C.textSub, marginTop: 4 }}>{c.type} • {c.tourist} • {c.loc} • {c.time}</div>
                </div>
                {c.status !== "resolved" && (
                  <div style={{ display: "flex", gap: 8 }}>
                    <Btn small color={C.teal} onClick={() => resolveCase(c.id)}>✅ Resolve</Btn>
                    <Btn small outline color={C.blue}>📞 Contact</Btn>
                  </div>
                )}
              </div>
            );
          })}
        </Card>
      )}

      {activeTab === "volunteers" && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          {volunteers.map(v => {
            const color = v.status === "available" ? C.teal : v.status === "on-duty" ? C.orange : C.textMuted;
            return (
              <Card key={v.name} style={{ padding: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                  <div style={{ width: 42, height: 42, borderRadius: "50%", background: color + "33", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🤝</div>
                  <div>
                    <div style={{ fontWeight: 700, color: C.text, fontSize: 14 }}>{v.name}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <PulsingDot color={color} size={6} /><span style={{ fontSize: 11, color }}>{v.status}</span>
                    </div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: C.textMuted, marginBottom: 4 }}>📍 {v.area}</div>
                <div style={{ fontSize: 12, color: C.textMuted }}>Cases: <span style={{ color: C.teal, fontWeight: 700 }}>{v.cases}</span></div>
                <Btn small outline color={color} style={{ width: "100%", marginTop: 10 }}>Message</Btn>
              </Card>
            );
          })}
        </div>
      )}

      {activeTab === "analytics" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <Card style={{ padding: 20 }}>
            <h3 style={{ color: C.text, margin: "0 0 16px" }}>📈 7-Day Activity Chart</h3>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 10, height: 140 }}>
              {[72, 88, 65, 94, 78, 102, 88].map((v, i) => {
                const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
                return (
                  <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                    <span style={{ fontSize: 10, color: C.textMuted }}>{v}</span>
                    <div style={{ width: "100%", height: (v / 120) * 100, background: `linear-gradient(${C.teal}, ${C.blue})`, borderRadius: "4px 4px 0 0", minHeight: 4 }} />
                    <span style={{ fontSize: 10, color: C.textMuted }}>{days[i]}</span>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>
      )}

      {activeTab === "heatmap" && (
        <Card style={{ padding: 20 }}>
          <h3 style={{ color: C.text, margin: "0 0 16px" }}>🔥 Safety Heatmap – {cityData.name}</h3>
          <div style={{ position: "relative", width: "100%", height: 300, background: "#0c1628", borderRadius: 12, overflow: "hidden", border: `1px solid ${C.border}` }}>
            <svg style={{ position: "absolute", inset: 0, width: "100%", height: "100%", opacity: 0.15 }}>
              {[0,25,50,75,100].map(v => (<g key={v}><line x1={`${v}%`} y1="0%" x2={`${v}%`} y2="100%" stroke={C.teal} strokeWidth="0.5" /><line x1="0%" y1={`${v}%`} x2="100%" y2={`${v}%`} stroke={C.teal} strokeWidth="0.5" /></g>))}
            </svg>
            {[
              { x: 45, y: 60, r: 50, color: "#ef4444", label: cityData.routes[0] + "\nHigh Risk" },
              { x: 55, y: 40, r: 35, color: "#f97316", label: cityData.routes[1] || "Market" },
              { x: 30, y: 45, r: 28, color: "#22c55e", label: "Safe Zone 1" },
              { x: 70, y: 65, r: 22, color: "#22c55e", label: "Safe Zone 2" },
              { x: 25, y: 70, r: 18, color: "#ef4444", label: "Airport" },
            ].map((h, i) => (
              <div key={i} style={{ position: "absolute", left: `${h.x}%`, top: `${h.y}%`, transform: "translate(-50%,-50%)" }}>
                <div style={{ width: h.r * 2, height: h.r * 2, borderRadius: "50%", background: h.color, opacity: 0.3, filter: "blur(20px)", transform: "translate(-50%,-50%)", position: "absolute" }} />
                <div style={{ fontSize: 9, color: "#fff", textAlign: "center", whiteSpace: "pre", position: "relative", background: "rgba(0,0,0,0.5)", padding: "2px 4px", borderRadius: 3 }}>{h.label}</div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

// ─── VOLUNTEER PANEL ──────────────────────────────────────────────────────────
function VolunteerPanel({ city }) {
  const cityData = CITIES[city] || CITIES.chennai;
  const [activeTab, setActiveTab] = useState("requests");
  const [requests, setRequests] = useState([
    { id: "R-891", type: "Medical Assistance", tourist: "Emma Wilson", loc: cityData.routes[0], urgency: "high", dist: "0.4 km", status: "pending" },
    { id: "R-892", type: "Navigation Help", tourist: "Carlos Diaz", loc: cityData.routes[1] || "Beach", urgency: "low", dist: "1.2 km", status: "pending" },
    { id: "R-893", type: "Lost Passport", tourist: "Yuki Tanaka", loc: "Station", urgency: "medium", dist: "2.1 km", status: "accepted" },
  ]);

  const accept = id => setRequests(rs => rs.map(r => r.id === id ? { ...r, status: "accepted" } : r));
  const complete = id => setRequests(rs => rs.map(r => r.id === id ? { ...r, status: "completed" } : r));

  return (
    <div>
      <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
        {[["requests", "🆘 Requests"], ["map", "🗺️ Area Map"], ["history", "📋 History"]].map(([id, lbl]) => (
          <button key={id} onClick={() => setActiveTab(id)} style={{
            padding: "8px 14px", borderRadius: 10, border: `1.5px solid ${activeTab === id ? C.teal : C.border}`,
            background: activeTab === id ? C.teal + "22" : "transparent", color: activeTab === id ? C.teal : C.textMuted,
            cursor: "pointer", fontFamily: "inherit", fontSize: 13, fontWeight: 600,
          }}>{lbl}</button>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 16 }}>
        <StatCard icon="🆘" label="Pending" value={requests.filter(r => r.status === "pending").length} color={C.orange} />
        <StatCard icon="🤝" label="Accepted" value={requests.filter(r => r.status === "accepted").length} color={C.teal} />
        <StatCard icon="✅" label="Completed Today" value={8} color={C.blue} />
      </div>
      {activeTab === "requests" && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {requests.map(r => {
            const urgColor = r.urgency === "high" ? C.red : r.urgency === "medium" ? C.orange : C.teal;
            return (
              <Card key={r.id} style={{ padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 8 }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontWeight: 700, color: C.text }}>{r.id}</span>
                      <Badge color={urgColor}>{r.urgency} priority</Badge>
                      <Badge color={r.status === "pending" ? C.orange : r.status === "accepted" ? C.blue : C.teal}>{r.status}</Badge>
                    </div>
                    <div style={{ fontSize: 14, color: C.text, marginTop: 6, fontWeight: 600 }}>{r.type}</div>
                    <div style={{ fontSize: 12, color: C.textMuted, marginTop: 4 }}>👤 {r.tourist} • 📍 {r.loc} • 🏃 {r.dist}</div>
                  </div>
                  <div style={{ display: "flex", gap: 8 }}>
                    {r.status === "pending" && <Btn small color={C.teal} onClick={() => accept(r.id)}>Accept</Btn>}
                    {r.status === "accepted" && <Btn small color={C.blue} onClick={() => complete(r.id)}>Complete</Btn>}
                    <Btn small outline color={C.textMuted}>📍 Navigate</Btn>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
      {activeTab === "map" && (
        <Card style={{ padding: 16 }}>
          <h3 style={{ color: C.text, margin: "0 0 12px" }}>📍 Area Assignments</h3>
          <LiveMap city={city} />
        </Card>
      )}
      {activeTab === "history" && (
        <Card style={{ padding: 20 }}>
          <h3 style={{ color: C.text, margin: "0 0 14px" }}>📋 Completed Cases</h3>
          {[
            { id: "R-886", type: "Medical Help", tourist: "John B.", time: "2 hr ago" },
            { id: "R-881", type: "Navigation", tourist: "Aiko T.", time: "5 hr ago" },
            { id: "R-877", type: "Lost Item", tourist: "Maria G.", time: "Yesterday" },
          ].map(r => (
            <div key={r.id} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: `1px solid ${C.border}` }}>
              <span style={{ fontSize: 20 }}>✅</span>
              <div>
                <div style={{ fontSize: 13, color: C.text, fontWeight: 600 }}>{r.id} – {r.type}</div>
                <div style={{ fontSize: 12, color: C.textMuted, marginTop: 2 }}>{r.tourist} • {r.time}</div>
              </div>
            </div>
          ))}
        </Card>
      )}
    </div>
  );
}

// ─── LANDING PAGE ─────────────────────────────────────────────────────────────
function LandingPage({ onGetStarted }) {
  const stats = [
    { value: "2.4M+", label: "Tourists Protected" },
    { value: "98.7%", label: "Safety Rate" },
    { value: "< 4 min", label: "Response Time" },
    { value: "120+", label: "Cities Covered" },
  ];
  const features = [
    { icon: "🆘", title: "Emergency SOS", desc: "One-tap alert sends your location to police, hospitals, and trusted contacts instantly.", color: C.red },
    { icon: "🗺️", title: "Live GPS Tracking", desc: "Real-time animated location tracking with trail history and landmark markers.", color: C.teal },
    { icon: "🗓️", title: "AI Trip Planner", desc: "Get personalized day-by-day itineraries tailored to your interests and budget.", color: C.blue },
    { icon: "🧭", title: "Guide Finder", desc: "Connect with verified local guides filtered by language, specialty and budget.", color: C.purple },
    { icon: "🌸", title: "Women Safety", desc: "Dedicated mode with safety timer, auto location sharing, and emergency voice activation.", color: "#ec4899" },
    { icon: "🤖", title: "AI Chatbot", desc: "24/7 multilingual AI assistant for guidance, recommendations, and emergency help.", color: C.orange },
  ];
  const cities = Object.values(CITIES).map(c => c.name);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.text }}>
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
        <StarField />
        <div style={{ position: "absolute", top: "20%", left: "5%", width: 400, height: 400, borderRadius: "50%", background: `${C.teal}07`, filter: "blur(80px)" }} />
        <div style={{ position: "absolute", bottom: "10%", right: "5%", width: 300, height: 300, borderRadius: "50%", background: `${C.blue}07`, filter: "blur(80px)" }} />
        <div style={{ textAlign: "center", padding: "0 20px", position: "relative", maxWidth: 800 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: C.teal + "22", border: `1px solid ${C.teal}44`, borderRadius: 20, padding: "6px 16px", marginBottom: 24, fontSize: 13, color: C.teal }}>
            <PulsingDot size={7} /> AI-Powered Tourism Safety Platform • India
          </div>
          <h1 style={{ fontSize: "clamp(36px, 7vw, 72px)", fontWeight: 900, lineHeight: 1.1, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
            Travel Smarter.<br />
            <span style={{ background: `linear-gradient(90deg, ${C.teal}, ${C.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Stay Safer.</span>
          </h1>
          <p style={{ fontSize: 18, color: C.textSub, marginBottom: 36, lineHeight: 1.6, maxWidth: 560, margin: "0 auto 24px" }}>
            Real-time emergency assistance, AI trip planning, guide matching, and smart safety alerts — across India's top destinations.
          </p>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center", marginBottom: 28 }}>
            {cities.map(c => <Badge key={c} color={C.teal}>{c}</Badge>)}
          </div>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
            <Btn onClick={onGetStarted} style={{ fontSize: 16, padding: "14px 32px" }}>🚀 Get Started Free</Btn>
            <Btn outline onClick={onGetStarted} style={{ fontSize: 16, padding: "14px 32px" }}>View Demo →</Btn>
          </div>
        </div>
      </div>
      <div style={{ padding: "60px 20px", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24 }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 36, fontWeight: 900, background: `linear-gradient(90deg, ${C.teal}, ${C.blue})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>{s.value}</div>
              <div style={{ color: C.textMuted, marginTop: 6, fontSize: 14 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: "80px 20px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <h2 style={{ textAlign: "center", fontSize: 36, fontWeight: 900, marginBottom: 12 }}>Everything You Need to Travel Safely</h2>
          <p style={{ textAlign: "center", color: C.textMuted, marginBottom: 50, fontSize: 16 }}>Powered by AI • Covering all of India</p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {features.map(f => (
              <Card key={f.title} style={{ padding: 24 }}>
                <div style={{ width: 52, height: 52, borderRadius: 14, background: f.color + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, marginBottom: 14 }}>{f.icon}</div>
                <h3 style={{ margin: "0 0 10px", fontSize: 17, fontWeight: 800, color: C.text }}>{f.title}</h3>
                <p style={{ margin: 0, color: C.textSub, fontSize: 14, lineHeight: 1.6 }}>{f.desc}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function SafeTrailApp() {
  const [page, setPage] = useState("landing");
  const [user, setUser] = useState(null);
  const [selectedCity, setSelectedCity] = useState("chennai");
  const [showChat, setShowChat] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [notifCount] = useState(3);

  const login = (userData) => { setUser(userData); setPage("dashboard"); };
  const logout = () => { setUser(null); setPage("landing"); setShowChat(false); };

  if (page === "landing") return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 100, ...glassStyle, borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>🛡️</span>
            <span style={{ fontWeight: 900, fontSize: 18, color: C.text }}>SafeTrail <span style={{ color: C.teal }}>AI</span></span>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <Btn outline small onClick={() => setPage("auth")}>Sign In</Btn>
            <Btn small onClick={() => setPage("auth")}>Get Started</Btn>
          </div>
        </div>
      </div>
      <div style={{ paddingTop: 64 }}><LandingPage onGetStarted={() => setPage("auth")} /></div>
    </div>
  );

  if (page === "auth") return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <AuthPage onLogin={login} />
    </div>
  );

  const roleLabel = user?.role === "admin" ? "⚙️ Admin" : user?.role === "volunteer" ? "🤝 Volunteer" : "🧳 Tourist";
  const roleColor = user?.role === "admin" ? C.purple : user?.role === "volunteer" ? C.blue : C.teal;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif", background: C.bg, minHeight: "100vh", color: C.text }}>
      <div style={{ position: "sticky", top: 0, zIndex: 200, ...glassStyle, borderRadius: 0, borderTop: "none", borderLeft: "none", borderRight: "none" }}>
        <div style={{ padding: "10px 20px", display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ fontSize: 22 }}>🛡️</span>
          <span style={{ fontWeight: 900, fontSize: 16, color: C.text }}>SafeTrail <span style={{ color: C.teal }}>AI</span></span>
          <Badge color={roleColor}>{roleLabel}</Badge>

          {/* City Selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: C.textMuted }}>📍</span>
            <select
              value={selectedCity}
              onChange={e => setSelectedCity(e.target.value)}
              style={{ background: "#1a2540", border: `1px solid ${C.border}`, borderRadius: 8, padding: "4px 10px", color: C.text, fontSize: 12, fontFamily: "inherit", cursor: "pointer", outline: "none" }}
            >
              {Object.entries(CITIES).map(([key, val]) => (
                <option key={key} value={key}>{val.name}</option>
              ))}
            </select>
          </div>

          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: C.textSub }}>
              <PulsingDot size={7} /> Live
            </div>
            <button onClick={() => setShowNotif(n => !n)} style={{ position: "relative", background: "transparent", border: `1px solid ${C.border}`, borderRadius: 8, padding: "6px 10px", color: C.textSub, cursor: "pointer", fontSize: 16 }}>
              🔔
              {notifCount > 0 && <span style={{ position: "absolute", top: -4, right: -4, background: C.red, color: "#fff", borderRadius: "50%", width: 16, height: 16, fontSize: 10, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>{notifCount}</span>}
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: roleColor + "33", display: "flex", alignItems: "center", justifyContent: "center", color: roleColor, fontWeight: 700, fontSize: 13 }}>
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <span style={{ fontSize: 13, color: C.textSub }}>{user?.name}</span>
            </div>
            <Btn outline small onClick={logout} color={C.red}>Sign Out</Btn>
          </div>
        </div>
      </div>

      {showNotif && <NotifPanel onClose={() => setShowNotif(false)} />}

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 16px 120px" }}>
        <div style={{ marginBottom: 20 }}>
          <h2 style={{ margin: "0 0 4px", fontSize: 22, fontWeight: 900 }}>Welcome back, {user?.name}! 👋</h2>
          <p style={{ color: C.textMuted, margin: 0, fontSize: 14 }}>
            {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })} • {CITIES[selectedCity]?.name}
          </p>
        </div>

        {user?.role === "tourist" && <TouristDashboard user={user} city={selectedCity} />}
        {user?.role === "admin" && <AdminDashboard city={selectedCity} />}
        {user?.role === "volunteer" && <VolunteerPanel city={selectedCity} />}
      </div>

      {showChat && <AIChatbot onClose={() => setShowChat(false)} city={selectedCity} />}
      <button onClick={() => setShowChat(c => !c)} style={{
        position: "fixed", bottom: 20, right: 20, width: 56, height: 56, borderRadius: "50%",
        background: showChat ? C.red : `linear-gradient(135deg, ${C.teal}, ${C.blue})`,
        border: "none", cursor: "pointer", fontSize: 24, zIndex: 999,
        boxShadow: `0 4px 24px ${C.teal}44`, transition: "all 0.3s",
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>{showChat ? "×" : "🤖"}</button>

      <style>{`
        @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 4px; height: 4px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(99,179,237,0.12); border-radius: 2px; }
      `}</style>
    </div>
  );
}
