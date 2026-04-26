import { useState, useEffect } from "react";

export const useImageColor = (imageUrl: string | null) => {
  const [dominantColor, setDominantColor] = useState<string>("0, 162, 255"); // Default primary blue

  useEffect(() => {
    if (!imageUrl || imageUrl.includes("placeholder")) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, 1, 1); // Draw just one pixel to scale the image down
      
      const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
      
      // Ensure the color isn't too dark or too light for visibility
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      
      let finalR = r;
      let finalG = g;
      let finalB = b;

      // Adjust if too dark
      if (brightness < 40) {
        finalR = Math.min(255, r + 60);
        finalG = Math.min(255, g + 60);
        finalB = Math.min(255, b + 60);
      }

      const colorStr = `${finalR}, ${finalG}, ${finalB}`;
      setDominantColor(colorStr);
      
      // Update CSS variables
      document.documentElement.style.setProperty("--primary", colorStr);
      document.documentElement.style.setProperty("--primary-rgb", colorStr);
    };
  }, [imageUrl]);

  return dominantColor;
};
