type HoneymoonGoalProps = {
  currentAmount: number;
  goalAmount: number;
};

export function HoneymoonGoal({
  currentAmount,
  goalAmount,
}: HoneymoonGoalProps) {
  const progress = Math.min((currentAmount / goalAmount) * 100, 100);

  return (
    <section
      style={{
        padding: "32px",
        borderRadius: "20px",
        background: "#f8f3ef",
        border: "1px solid #eadfd7",
        margin: "24px 0",
      }}
    >
      <h2 style={{ marginBottom: "12px" }}>Nossa Lua de Mel 🌴</h2>

      <p style={{ marginBottom: "16px", color: "#555" }}>
        Já recebemos <strong>R$ {currentAmount.toFixed(2)}</strong> de{" "}
        <strong>R$ {goalAmount.toFixed(2)}</strong>
      </p>

      <div
        style={{
          width: "100%",
          height: "14px",
          background: "#e8ddd5",
          borderRadius: "999px",
          overflow: "hidden",
          marginBottom: "10px",
        }}
      >
        <div
          style={{
            width: `${progress}%`,
            height: "100%",
            background: "#c8a27a",
            borderRadius: "999px",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <span style={{ fontSize: "14px", color: "#666" }}>
        {progress.toFixed(0)}% da nossa meta
      </span>
    </section>
  );
}