import '@styles/search.css';

function Search({ value, onChange, placeholder, style }) {
    return (
        <div className="search-input-container">
            <input
                type="text"
                className='search-input-table'
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                style={style}
            />
        </div>
    )
}

export default Search;