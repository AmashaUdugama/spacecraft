export default function LoadingState({ label = "Loading..." }) {
  return (
    <div className="page loading-state">
      <span className="spinner" />
      <span>{label}</span>
    </div>
  );
}