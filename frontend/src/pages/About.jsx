import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "🛏️",
    color: "#c79a56",
    title: "Room classification",
    description: "A trained CNN identifies whether a photo shows a bedroom, kitchen, or living room, so recommendations are always relevant to the actual space.",
  },
  {
    icon: "🎨",
    color: "#2f8f83",
    title: "Style detection",
    description: "A second CNN reads the visual character of the room and classifies it as contemporary or industrial, informing the tone of every suggestion.",
  },
  {
    icon: "📐",
    color: "#a85275",
    title: "Space optimization",
    description: "A Random Forest model, trained on real spatial features extracted with OpenCV, scores comfort, movement efficiency, and layout balance.",
  },
  {
    icon: "🧩",
    color: "#4a5b8c",
    title: "Personalized recommendations",
    description: "Furniture, color palette, and layout suggestions are matched to your room, style, budget, and lifestyle - with real, sourced price ranges.",
  },
];

const STEPS = [
  { n: "01", title: "Upload a photo", text: "Choose a room image and set your budget, lifestyle, and preferred style." },
  { n: "02", title: "SpaceCraft reads the room", text: "Computer vision models classify the room, detect its style, and extract its color palette." },
  { n: "03", title: "Space is scored", text: "Comfort, crowdedness, movement efficiency, and layout balance are calculated from real image features." },
  { n: "04", title: "Get recommendations", text: "Furniture, color, and layout suggestions arrive - matched to your actual budget in real currency." },
];

export default function About() {
  return (
    <div className="page about-page">
      <section className="about-hero">
        <h1>Read the room. Literally.</h1>
        <p className="subtitle about-hero-sub">
          SpaceCraft is a machine-learning system that analyzes a photo of your room and turns it into
          personalized interior design guidance - room type, style, spatial comfort, and furniture recommendations,
          all grounded in real computer vision models rather than static templates.
        </p>
        <Link to="/upload" className="about-cta">Analyze a room →</Link>
      </section>

      <section className="about-features">
        <h2>What it does</h2>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <span className="feature-icon" style={{ background: `${f.color}22` }}>{f.icon}</span>
              <h3>{f.title}</h3>
              <p>{f.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-steps">
        <h2>How it works</h2>
        <div className="steps-row">
          {STEPS.map((s) => (
            <div key={s.n} className="step-card">
              <span className="step-number">{s.n}</span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="about-stats">
        <h2>Under the hood</h2>
        <div className="stat-grid">
          <div className="stat-card">
            <span className="stat-label">Room classifier accuracy</span>
            <span className="stat-value">94.1%</span>
            <span className="stat-sub">Trained on 3,308 real images</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Style classifier accuracy</span>
            <span className="stat-value">86.1%</span>
            <span className="stat-sub">Trained on 396 real images</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Comfort model fit</span>
            <span className="stat-value">R² 0.97</span>
            <span className="stat-sub">Random Forest on spatial features</span>
          </div>
        </div>
      </section>
    </div>
  );
}