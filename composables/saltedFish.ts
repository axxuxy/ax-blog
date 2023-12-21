type SaltedFish = HTMLCanvasElement & {
  update: () => void;
  reset: () => void;
}

export function getSaltedFish({
  maxWidth = 1280,
  maxHeight = 920,
}): SaltedFish {
  const canvas: HTMLCanvasElement & {
    update?: () => void;
    reset?: () => void;
  } = document.createElement("canvas");
  if (maxWidth / 2 > maxHeight) {
    canvas.height = maxHeight;
    canvas.width = maxHeight * 2;
  } else {
    canvas.height = Math.round(maxWidth / 2);
    canvas.width = canvas.height * 2;
  }
  let now = Date.now();
  const ctx = canvas.getContext("2d")!;

  function conversionDot(x: number, y: number, time: number) {
    if (time > 1500) return {
      x, y
    };
    const _ = Math.abs(Math.sin(time / 500 * Math.PI));
    const move = _ * (Math.pow(0.5 - x, 2) * 0.3) / Math.pow(Math.ceil(time / 500), 2) * 1.5;
    return {
      x: x > 0.5 ? x - move : x + move,
      y: y - move,
    }
  }
  function conversionPosition(
    [x, y]: [number, number],
    [width, height]: [number, number],
    time: number,
  ): [number, number] {
    const dot = conversionDot(x, y, time);
    return [dot.x * width, dot.y * height]
  }

  canvas.update = () => {
    const { width, height } = ctx.canvas;
    ctx.clearRect(0, 0, width, height);

    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 0.01 * width;
    ctx.lineJoin = "round";
    ctx.beginPath();
    const time = (Date.now() - now);
    ctx.moveTo(...conversionPosition([0.09, 0.5], [width, height], time)
    );
    ctx.lineTo(...conversionPosition([0.05, 0.5], [width, height], time));
    ctx.bezierCurveTo(
      ...conversionPosition([0.06, 0.2], [width, height], time),
      ...conversionPosition([0.2, 0.1], [width, height], time),
      ...conversionPosition([0.28, 0.1], [width, height], time)
    );
    ctx.bezierCurveTo(
      ...conversionPosition([0.5, 0.1], [width, height], time),
      ...conversionPosition([0.8, 0.5], [width, height], time),
      ...conversionPosition([0.95, 0.74], [width, height], time),
    );
    ctx.lineTo(...conversionPosition([0.95, 0.24], [width, height], time));
    ctx.bezierCurveTo(
      ...conversionPosition([0.8, 0.5], [width, height], time),
      ...conversionPosition([0.5, 0.9], [width, height], time),
      ...conversionPosition([0.28, 0.9], [width, height], time)
    );
    ctx.bezierCurveTo(
      ...conversionPosition([0.2, 0.9], [width, height], time),
      ...conversionPosition([0.06, 0.8], [width, height], time),
      ...conversionPosition([0.05, 0.5], [width, height], time)
    );
    ctx.lineTo(...conversionPosition([0.09, 0.5], [width, height], time));
    ctx.closePath();
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(
      ...conversionPosition([0.2, 0.48], [width, height], time),
      0.05 * width,
      0,
      Math.PI * 2
    );
    ctx.moveTo(...conversionPosition([0.28, 0.1], [width, height], time));
    ctx.quadraticCurveTo(
      ...conversionPosition([0.42, 0.5], [width, height], time),
      ...conversionPosition([0.28, 0.9], [width, height], time)
    );
    ctx.stroke();
  };
  canvas.reset = () => {
    now = Date.now();
  }
  return canvas as SaltedFish;
}