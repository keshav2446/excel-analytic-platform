import { useNavigate } from "react-router-dom";

export default function BackToHomeButton() {
  const navigate = useNavigate();

  return (
    <div className="fixed top-4 left-4 z-50">
      <button
        onClick={() => navigate("/")}
        className="bg-white/10 text-white border border-white/20 px-4 py-2 rounded hover:bg-white/20 transition"
      >
        ← Back to Home
      </button>
    </div>
  );
}
