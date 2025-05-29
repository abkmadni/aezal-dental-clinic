import React from "react";
import { useNavigate } from "react-router-dom";

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}
      className="bg-[#661043] hover:bg-[#47062b] text-white px-4 py-2 rounded text-sm flex items-center gap-2"
    >
      <span>&lt;</span> Go Back
    </button>
  );
}
