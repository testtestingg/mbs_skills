// GamePage.tsx
const GamePage = () => {
  return (
    <div style={{ width: "100%", height: "100vh" }}>
      <iframe
        src="/game/index.html"
        title="AI Game"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
};

export default GamePage;
