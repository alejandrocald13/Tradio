"use client";
import dynamic from "next/dynamic";
const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const round2 = (v) => Math.round(Number(v) * 100) / 100;
const eq2 = (a, b) => round2(a) === round2(b);

function splitByRef(data, labels, ref) {
  const up = [];
  const down = [];
  const outLabels = [];

  const signTol = (v) => (eq2(v, ref) ? 0 : v > ref ? 1 : -1);

  for (let i = 0; i < data.length; i++) {
    const y = Number(data[i]);
    const s = signTol(y);
    const lbl = labels?.[i] ?? "";

    if (s === 0) {
      if (i > 0) {
        const sp = signTol(Number(data[i - 1]));
        if (sp !== 0) {
          up.push(sp > 0 ? ref : null);
          down.push(sp < 0 ? ref : null);
          outLabels.push("");
        }
      }
      up.push(null);
      down.push(null);
      outLabels.push(lbl);
      if (i < data.length - 1) {
        const sn = signTol(Number(data[i + 1]));
        if (sn !== 0) {
          up.push(sn > 0 ? ref : null);
          down.push(sn < 0 ? ref : null);
          outLabels.push("");
        }
      }
      continue;
    }

    if (s > 0) { up.push(y); down.push(null); }
    else       { up.push(null); down.push(y); }
    outLabels.push(lbl);

    if (i < data.length - 1) {
      const s2 = signTol(Number(data[i + 1]));
      if (s2 !== s && s2 !== 0) {
        up.push(ref);
        down.push(ref);
        outLabels.push("");
      } else if (s2 === 0) {
        up.push(s > 0 ? ref : null);
        down.push(s < 0 ? ref : null);
        outLabels.push("");
      }
    }
  }
  return { up, down, labels: outLabels };
}

export default function BigChart({
  chartKey,
  data = [],
  labels = [],
  refLine,
  height = 300,
  colorUp = "#22c55e",
  colorDown = "#ef4444",
  colorRef = "#22c55e",
}) {
  if (!Array.isArray(data) || data.length === 0) return null;

  if (labels.length !== data.length) {  // Rellenar los tabs (dias, años, etc) o recortar los tabs
    const needed = data.length - labels.length;
    labels = needed > 0 ? [...labels, ...Array(needed).fill("")] : labels.slice(0, data.length);
  }

  const hasRef = Number.isFinite(Number(refLine));
  if (hasRef) {
    const ref = Number(refLine);
    const { up, down, labels: categories } = splitByRef(data, labels, ref);

    const isFlat   = (i) => up[i] == null && down[i] == null;          // punto neutro
    const isBorder = (i) => {                                          
      const curIsRef = eq2(up[i], ref) || eq2(down[i], ref);
      if (!curIsRef) return false;
      const prevFlat = i > 0 && isFlat(i - 1);
      const nextFlat = i < up.length - 1 && isFlat(i + 1);
      return prevFlat || nextFlat;
    };
    const refSeries = up.map((_, i) => (isFlat(i) || isBorder(i) ? ref : null));

    const series = [
      { name: "Loss",     data: down,       type: "area" },
      { name: "Gain",     data: up,         type: "area" },
      { name: "neutral",  data: refSeries,  type: "area" },
    ];

    const options = {
      chart: {
        type: "area",
        toolbar: { show: false },
        zoom: { enabled: false },
        animations: {
          enabled: true,
          easing: "linear",
          speed: 550,
          animateGradually: { enabled: false },
          dynamicAnimation: { enabled: true, speed: 250 },
        },
      },
      dataLabels: { enabled: false },
      stroke: { curve: "smooth", width: [2, 2, 2] },
      colors: [colorDown, colorUp, colorRef],
      fill: {
        type: "gradient",
        gradient: {
          shadeIntensity: 0,
          type: "vertical",
          opacityFrom: 0.03,
          opacityTo: 0.03,
          stops: [0, 100],
          colorStops: [
            { offset: 0, color: "#34d399", opacity: 0.05 },
            { offset: 100, color: "#34d399", opacity: 0.05 }
          ]
        }
      },
      xaxis: { type: "category", categories },
      yaxis: { labels: { formatter: (v) => Number(v).toFixed(2) } },
      grid: { borderColor: "#e5e7eb", strokeDashArray: 4 },
      tooltip: {
        shared: true,
        y: { formatter: (v) => (v == null ? "" : `$${Number(v).toFixed(2)}`) },
      },
      legend: { show: false },

      annotations: {
        position: "back",
        yaxis: [{
          y: ref,
          borderColor: "#7e7e7eff",
          strokeDashArray: 6,
          opacity: 0.5,
        }]
      }
    };

    return (
      <ReactApexChart
        key={chartKey}
        options={options}
        series={series}
        type="area"
        height={height}
      />
    );
  }

  // sin referencia
  const trendUp = data.at(-1) >= data[0];
  const series = [{ name: "Price", data, type: "area" }];

  const options = {
    chart: {
      type: "area",
      toolbar: { show: false },
      zoom: { enabled: false },
      animations: {
        enabled: true,
        easing: "linear",
        speed: 550,
        animateGradually: { enabled: false },
        dynamicAnimation: { enabled: true, speed: 250 },
      },
    },
    dataLabels: { enabled: false },
    stroke: { curve: "smooth", width: 2 }, // mismo grosor que con ref
    colors: [trendUp ? colorUp : colorDown],
    // 👉 mismo fill que en el caso con ref (verde suave y uniforme)
    fill: {
      type: "gradient",
      gradient: {
        shadeIntensity: 0,
        type: "vertical",
        opacityFrom: 0.03,
        opacityTo: 0.03,
        stops: [0, 100],
        colorStops: [
          { offset: 0,   color: "#34d399", opacity: 0.05 },
          { offset: 100, color: "#34d399", opacity: 0.05 },
        ],
      },
    },
    xaxis: { type: "category", categories: labels },
    yaxis: { labels: { formatter: (v) => Number(v).toFixed(2) } },
    grid: { borderColor: "#e5e7eb", strokeDashArray: 4 },
    tooltip: { y: { formatter: (v) => `$${Number(v).toFixed(2)}` } },
    legend: { show: false },
  };

  return (
    <ReactApexChart
      key={chartKey}
      options={options}
      series={series}
      type="area"
      height={height}
    />
  );
}

