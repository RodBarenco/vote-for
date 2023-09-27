import React, { useState, useEffect } from "react";

function Preview({ newPollName, newPollSummary, titleColor, textColor, bgColor, coverPhoto }) {
  const previewStyle = {
    backgroundColor: bgColor,
    color: textColor,
  };

  // Defina o estado inicial diretamente na chamada ao useState
  const [placeholderImage, setPlaceholderImage] = useState(
    coverPhoto != null
      ? URL.createObjectURL(coverPhoto)
      : "https://upload.wikimedia.org/wikipedia/commons/3/3f/Placeholder_view_vector.svg"
  );

  useEffect(() => {
    // Use o URL.createObjectURL para criar a URL da imagem quando coverPhoto estiver disponível
    if (coverPhoto != null) {
      setPlaceholderImage(URL.createObjectURL(coverPhoto));
    }
  }, [coverPhoto]);

  return (
    <div style={previewStyle} className="border rounded-lg p-4 h-64 w-60">
      {placeholderImage && (
        <div
          className="bg-cover bg-center w-full h-10"
          style={{ backgroundImage: `url(${placeholderImage})` }}
        ></div>
      )}

      <div className="text-xl" style={{ color: titleColor }}>
        {newPollName}
      </div>
      <div className="text-sm" style={{ color: textColor }}>
        {newPollSummary}
      </div>
      <div className="w-full h-px bg-gray-900 mt-4"></div>
    </div>
  );
}

export default Preview;
