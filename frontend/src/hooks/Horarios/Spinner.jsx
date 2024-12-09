import "@styles/Horarios/spinner.css";

const Spinner = () => {
  return (
    <div
      style={{
        background: "transparent", 
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div className="spiral-spinner">
        <div className="spiral"></div>
      </div>
    </div>
  );
};

export default Spinner;
