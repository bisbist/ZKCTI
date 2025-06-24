import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";

function XaiExplanationPopup({ xai, show, onClose }) {
  if (!xai || !xai.length) return null;

  // You may sort by SHAP value, or show original order
  const sorted = [...xai].sort((a, b) => Math.abs(b.shap) - Math.abs(a.shap));

  // Fixed card dimensions (adjust as needed)
  const CARD_WIDTH = 540;
  const CARD_HEIGHT = 640;
  const CHART_HEIGHT = Math.max(sorted.length * 26, 350);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        background: "rgba(40,34,70,0.25)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        display: show ? "flex" : "none",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.2s",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: CARD_WIDTH,
          height: CARD_HEIGHT,
          background: "rgba(255,255,255,0.90)",
          borderRadius: 20,
          boxShadow: "0 10px 48px 0 #524cff55",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          padding: "2.1rem 2.1rem 2.1rem 1.2rem",
          overflow: "hidden",
          // prevents outside click closing if clicked inside the card
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          style={{
            position: "absolute",
            top: 14,
            right: 18,
            fontSize: 22,
            color: "#888",
            background: "none",
            border: "none",
            cursor: "pointer"
          }}
          aria-label="Close"
          onClick={onClose}
        >×</button>
        <h3 style={{
          marginBottom: 8,
          fontWeight: 700,
          color: "#6047f7",
          fontSize: "1.25rem"
        }}>
          Feature Contributions (XAI)
        </h3>
        <div style={{
          marginBottom: 10,
          fontSize: "0.99rem",
          color: "#444"
        }}>
          All {sorted.length} features shown. Positive SHAP values push toward <span style={{ color: "#24b655" }}>Malicious</span>, negative toward <span style={{ color: "#aaa" }}>Benign</span>.
        </div>
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            minHeight: 0,
            paddingRight: 10,
            marginTop: 4,
            marginBottom: 4,
          }}
        >
          <ResponsiveContainer width="99%" height={CHART_HEIGHT > CARD_HEIGHT - 180 ? CARD_HEIGHT - 180 : CHART_HEIGHT}>
            <BarChart
              data={sorted}
              layout="vertical"
              margin={{ top: 8, right: 22, left: 10, bottom: 8 }}
              barCategoryGap={5}
            >
              <YAxis
                type="category"
                dataKey="feature"
                width={135}
                tick={{ fontSize: 13, fill: "#6056a7" }}
                axisLine={false}
                tickLine={false}
              />
              <XAxis
                type="number"
                domain={['dataMin', 'dataMax']}
                tick={{ fontSize: 12, fill: "#908cff" }}
                axisLine
                tickLine={false}
                label={{
                  value: "SHAP Value",
                  angle: 0,
                  position: "insideBottomRight",
                  fontSize: 13,
                  offset: 8
                }}
              />
              <Tooltip
                formatter={v => v.toFixed(4)}
                labelFormatter={f => (<span><b>Feature:</b> {f}</span>)}
              />
              <Bar
                dataKey="shap"
                fill="#7554ee"
                isAnimationActive
                radius={[8, 8, 8, 8]}
                label={{
                  position: "right",
                  fontSize: 12,
                  formatter: v => v.toFixed(3)
                }}
              />
              <ReferenceLine x={0} stroke="#bbb" strokeDasharray="3 3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{
          marginTop: 9,
          fontSize: "0.95rem",
          color: "#888",
          textAlign: "center"
        }}>
          <b>Tip:</b> Scroll to see all features.
        </div>
      </div>
    </div>
  );
}

export default XaiExplanationPopup;
