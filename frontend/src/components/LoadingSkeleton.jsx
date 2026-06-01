function LoadingSkeleton() {
  const barStyle = (h, w = "100%", r = "12px") => ({
    height: h,
    width: w,
    borderRadius: r,
    background: "rgba(255,255,255,0.04)",
    backgroundImage:
      "linear-gradient(90deg, rgba(255,255,255,0.03) 25%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0.03) 75%)",
    backgroundSize: "1000px 100%",
    animation: "shimmer 1.6s infinite linear",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <div style={barStyle("28px", "200px")} />
        <div style={barStyle("14px", "300px")} />
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "14px" }}>
        {[1,2,3,4].map((i) => (
          <div key={i} className="card" style={{ padding: "22px 24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                <div style={barStyle("12px", "80px")} />
                <div style={barStyle("36px", "60px", "8px")} />
                <div style={barStyle("10px", "100px")} />
              </div>
              <div style={{ ...barStyle("42px", "42px", "12px") }} />
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "14px" }}>
        <div className="card" style={{ padding: "28px", height: "360px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            <div style={barStyle("15px", "160px")} />
            <div style={barStyle("12px", "240px")} />
          </div>
          <div style={barStyle("260px", "100%", "14px")} />
        </div>
        <div className="card" style={{ padding: "28px", height: "360px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
            <div style={barStyle("15px", "130px")} />
            <div style={barStyle("12px", "160px")} />
          </div>
          {[1,2,3,4].map((i) => (
            <div key={i} style={{ display: "flex", gap: "14px", marginBottom: "20px" }}>
              <div style={barStyle("34px", "34px", "10px")} />
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "6px", paddingTop: "6px" }}>
                <div style={barStyle("12px", "80%")} />
                <div style={barStyle("10px", "50%")} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingSkeleton;