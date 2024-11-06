import '@styles/horarios.css';

const SelectorColor = ({ onSelectColor }) => {
    const coloresPasteles = ['#FFD1DC', '#FFDDC1', '#FFFFC1', '#D1FFC1', '#C1FFFF', '#D1D1FF'];

    return (
        <div className="selector-color">
            <p>Seleccione un color:</p>
            <div className="color-palette">
                {coloresPasteles.map((color) => (
                    <div
                        key={color}
                        className="color-block"
                        style={{ backgroundColor: color }}
                        onClick={() => onSelectColor(color)}
                    ></div>
                ))}
            </div>
        </div>
    );
};

export default SelectorColor;
