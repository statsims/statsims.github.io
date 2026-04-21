const slopeSlider = document.getElementById("slope");
const interceptSlider = document.getElementById("intercept");
const slopeValue = document.getElementById("slopeValue");
const interceptValue = document.getElementById("interceptValue");
const equation = document.getElementById("equation");
const sseOutput = document.getElementById("sse");
const newDataButton = document.getElementById("newData");

let points = [];

function generateData(n = 12) {
  const data = [];
  const trueSlope = 1.2;
  const trueIntercept = 2;

  for (let i = 0; i < n; i++) {
    const x = i + 1;
    const noise = (Math.random() - 0.5) * 6;
    const y = trueSlope * x + trueIntercept + noise;
    data.push({ x, y });
  }

  return data;
}

function calculateSSE(m, b, data) {
  let sse = 0;

  for (const p of data) {
    const yHat = m * p.x + b;
    const residual = p.y - yHat;
    sse += residual ** 2;
  }

  return sse;
}

function buildResidualTraces(m, b, data) {
  return data.map((p) => {
    const yHat = m * p.x + b;
    return {
      x: [p.x, p.x],
      y: [p.y, yHat],
      mode: "lines",
      type: "scatter",
      hoverinfo: "skip",
      showlegend: false
    };
  });
}

function updatePlot() {
  const m = Number(slopeSlider.value);
  const b = Number(interceptSlider.value);

  slopeValue.textContent = m;
  interceptValue.textContent = b;

  const xValues = points.map(p => p.x);
  const yValues = points.map(p => p.y);

  const minX = Math.min(...xValues);
  const maxX = Math.max(...xValues);

  const lineTrace = {
    x: [minX, maxX],
    y: [m * minX + b, m * maxX + b],
    mode: "lines",
    type: "scatter",
    name: "Your line"
  };

  const pointTrace = {
    x: xValues,
    y: yValues,
    mode: "markers",
    type: "scatter",
    name: "Data"
  };

  const residualTraces = buildResidualTraces(m, b, points);
  const sse = calculateSSE(m, b, points);

  equation.textContent = `y = ${m.toFixed(2)}x + ${b.toFixed(2)}`;
  sseOutput.textContent = sse.toFixed(2);

  Plotly.newPlot(
    "plot",
    [pointTrace, lineTrace, ...residualTraces],
    {
      margin: { t: 20 },
      xaxis: { title: "X" },
      yaxis: { title: "Y" }
    },
    { responsive: true }
  );
}

function resetData() {
  points = generateData();
  updatePlot();
}

slopeSlider.addEventListener("input", updatePlot);
interceptSlider.addEventListener("input", updatePlot);
newDataButton.addEventListener("click", resetData);

resetData();