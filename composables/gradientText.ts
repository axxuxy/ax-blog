type GradientText = HTMLCanvasElement & {
  update: () => void;
  reset: () => void;
}

export function getGradientText(text: string, { width = 1280, maxHeight = 40, color = "#fff", time = 6000 } = {}): GradientText {
  if (text.length <= 0) throw new Error("Could not can input empty text.");
  const canvas: HTMLCanvasElement & {
    update?: () => void;
    reset?: () => void;
  } = document.createElement("canvas");
  canvas.width = width;
  const ctx = canvas.getContext("2d")!;
  let fontSize = Math.round(width / text.length);
  (function setFont() {
    const textWidth = ctx.measureText(text).width;
    if (textWidth > width) {
      fontSize--;
      setFont();
    } else {
      if (fontSize > maxHeight) fontSize = maxHeight;
      else fontSize = Math.ceil(fontSize);
      canvas.height = fontSize;
    }
  })();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  let startTime: number = Date.now();
  const grdientWidth = fontSize / width;
  let isStop = false;
  canvas.update = () => {
    if (isStop) return;
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    const runTime = Date.now() - startTime;
    const x = runTime / time;
    ctx.font = `bold ${fontSize}px 楷体`;
    if (x > 1) {
      ctx.fillStyle = color;
      isStop = true;
    } else {
      const gradient = ctx.createLinearGradient(0, 0, width, 0);

      gradient.addColorStop(0, color);
      gradient.addColorStop(x, color);
      const gradientEnd = x + grdientWidth;
      if (gradientEnd > 1) {
        gradient.addColorStop(1, "transparent");
      }
      else {
        gradient.addColorStop(gradientEnd, "transparent");
      }
      ctx.fillStyle = gradient;
    }
    ctx.fillText(text, width / 2, fontSize / 2);
  }
  canvas.reset = () => {
    isStop = false;
    startTime = Date.now();
  }
  return canvas as GradientText;
}