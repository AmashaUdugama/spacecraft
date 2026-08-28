import { useState } from "react";
import { uploadRoomImage, runPrediction, getRecommendations } from "../api/spacecraft";
import { useAuth } from "../context/AuthContext";
import ColorProportionBar from "../components/ColorProportionBar";
import RecommendationTable from "../components/RecommendationTable";
import RoomLayoutDiagram from "../components/RoomLayoutDiagram";
import StatRing from "../components/StatRing";
import ReportActions from "../components/ReportActions";
import { getRoomIcon } from "../utils/roomIcons";

const BUDGET_OPTIONS = ["low", "medium", "high"];
const LIFESTYLE_OPTIONS = ["student", "family", "remote_worker", "professional"];
const STYLE_OPTIONS = ["modern", "minimalist", "luxury", "industrial", "scandinavian"];

export default function Upload() {
  const { user } = useAuth();
  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [budget, setBudget] = useState("medium");
  const [lifestyle, setLifestyle] = useState("student");
  const [preferredStyle, setPreferredStyle] = useState("modern");

  const [stage, setStage] = useState("idle"); // idle | uploading | predicting | recommending | done
  const [error, setError] = useState("");

  const [prediction, setPrediction] = useState(null);
  const [recommendations, setRecommendations] = useState(null);

  function handleFileChange(e) {
    const selected = e.target.files[0];
    setFile(selected);
    setPrediction(null);
    setRecommendations(null);
    setPreviewUrl(selected ? URL.createObjectURL(selected) : null);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!file) {
      setError("Please choose an image first.");
      return;
    }
    setError("");
    setPrediction(null);
    setRecommendations(null);

    try {
      setStage("uploading");
      const upload = await uploadRoomImage({
        file,
        budget,
        lifestyle,
        preferred_style: preferredStyle,
      });

      setStage("predicting");
      const predictionResult = await runPrediction(upload.id);
      setPrediction(predictionResult);

      setStage("recommending");
      const recs = await getRecommendations(predictionResult.id);
      setRecommendations(recs);

      setStage("done");
    } catch (err) {
      setError(err.response?.data?.detail || "Something went wrong. Please try again.");
      setStage("idle");
    }
  }

  const dominantColors = prediction?.dominant_colors ? prediction.dominant_colors.split(",") : [];
  const dominantPercentages = prediction?.dominant_color_percentages
    ? prediction.dominant_color_percentages.split(",").map(Number)
    : [];
  const isBusy = stage === "uploading" || stage === "predicting" || stage === "recommending";

  return (
    <div className="page">
      <h1>Analyze a room</h1>
      <p className="subtitle">Upload a photo, tell us your preferences, and SpaceCraft reads the room.</p>

      <form className="upload-form" onSubmit={handleSubmit}>
        <div className="upload-left">
          <label className={`file-drop ${isBusy ? "is-scanning" : ""}`}>
            {previewUrl ? (
              <img src={previewUrl} alt="Preview" className="preview-img" />
            ) : (
              <span>Click to choose a room photo (.jpg / .png)</span>
            )}
            <input type="file" accept=".jpg,.jpeg,.png" onChange={handleFileChange} hidden />
          </label>
        </div>

        <div className="upload-right">
          <label>
            Budget
            <select value={budget} onChange={(e) => setBudget(e.target.value)}>
              {BUDGET_OPTIONS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </label>
          <label>
            Lifestyle
            <select value={lifestyle} onChange={(e) => setLifestyle(e.target.value)}>
              {LIFESTYLE_OPTIONS.map((l) => <option key={l} value={l}>{l.replace("_", " ")}</option>)}
            </select>
          </label>
          <label>
            Preferred style
            <select value={preferredStyle} onChange={(e) => setPreferredStyle(e.target.value)}>
              {STYLE_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </label>

          {error && <div className="error-banner">{error}</div>}

          <button type="submit" disabled={isBusy}>
            {stage === "uploading" && "Uploading..."}
            {stage === "predicting" && "Analyzing room..."}
            {stage === "recommending" && "Generating recommendations..."}
            {(stage === "idle" || stage === "done") && "Analyze room"}
          </button>
        </div>
      </form>

      {prediction && (
        <>
          <ReportActions targetId="report-content" filename={`spacecraft-${prediction.room_type}-${prediction.id}`} />
          <div id="report-content">
          <div className="pdf-print-header">
            <div className="pdf-header-brand">
              <span className="pdf-header-mark" />
              SpaceCraft
            </div>
            <div className="pdf-header-meta">
              <div>Report for: {user?.full_name || user?.email || "Guest"}</div>
              <div>{new Date().toLocaleDateString()}</div>
            </div>
          </div>
          <section className="results">
            <h2>Analysis results</h2>

          <div className="result-header-grid">
            <div className="result-header-card">
              <span className="result-icon" style={{ background: "#fdf1ea" }}>
                {getRoomIcon(prediction.room_type)}
              </span>
              <div>
                <span className="stat-label">Room type</span>
                <span className="result-header-value">{prediction.room_type.replace("_", " ")}</span>
                <span className="result-header-sub" style={{ color: "var(--brass-dark)" }}>
                  {Math.round(prediction.room_confidence * 100)}% confidence
                </span>
              </div>
            </div>
            <div className="result-header-card">
              <span className="result-icon" style={{ background: "#eaf5f3" }}>🎨</span>
              <div>
                <span className="stat-label">Style</span>
                <span className="result-header-value">{prediction.style.replace("_", " ")}</span>
                <span className="result-header-sub" style={{ color: "var(--teal, #2f8f83)" }}>
                  {Math.round(prediction.style_confidence * 100)}% confidence
                </span>
              </div>
            </div>
          </div>

          <div className="ring-stat-grid">
            <div className="ring-stat-card">
              <StatRing value={prediction.comfort_score} color="#c79a56" />
              <span className="stat-label">Comfort</span>
            </div>
            <div className="ring-stat-card">
              <StatRing value={prediction.movement_efficiency} color="#a85275" />
              <span className="stat-label">Movement</span>
            </div>
            <div className="ring-stat-card">
              <StatRing value={prediction.layout_balance} color="#4a5b8c" />
              <span className="stat-label">Balance</span>
            </div>
            <div className="ring-stat-card">
              <StatRing value={prediction.crowdedness * 100} color="#7c9885" suffix="%" />
              <span className="stat-label">Crowded</span>
            </div>
          </div>

          <h3>Dominant colors</h3>
          <ColorProportionBar colors={dominantColors} percentages={dominantPercentages} />
          </section>

          {recommendations && (
            <section className="results">
              <h2>Recommendations</h2>
              <RecommendationTable items={recommendations.items} />

              <h3>Suggested layout</h3>
              <p className="subtitle layout-caption">
                Computed from your room's detected type and real extracted colors - not a stock image.
              </p>
              <RoomLayoutDiagram
                roomType={prediction.room_type}
                dominantColors={dominantColors}
                recommendationItems={recommendations.items}
              />
            </section>
          )}
          </div>
        </>
      )}
    </div>
  );
}