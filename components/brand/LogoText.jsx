export default function LogoText({ size = "md" }) {
  const arabicSize =
    size === "sm" ? 22 :
    size === "lg" ? 34 : 28;

  const englishSize =
    size === "sm" ? 8 :
    size === "lg" ? 11 : 9;

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        lineHeight: 1,
      }}
    >
      <span
        style={{
          fontFamily: "Tajawal, sans-serif",
          fontWeight: 800,
          fontSize: arabicSize,
          background:
            "linear-gradient(135deg,#F4D88D,#D4AF5A,#8A6322)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          letterSpacing: ".5px",
        }}
      >
        نخبة
      </span>

      <span
        style={{
          marginTop: 2,
          fontFamily: "Montserrat, sans-serif",
          fontWeight: 500,
          fontSize: englishSize,
          letterSpacing: 5,
          color: "#8d7a53",
        }}
      >
        NUKHBA
      </span>
    </div>
  );
}