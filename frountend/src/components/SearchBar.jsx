import React from "react";

function SearchBar({ setSearch }) {
  const styles = {
    container: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "12vh",
       backgroundColor: "#f5f7fa",
    },
    input: {
      padding: "12px 20px",
      width: "400px",
      fontSize: "16px",
      border: "2px solid #007bff",
      borderRadius: "12px",
      outline: "none",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      transition: "all 0.3s ease",
    },
    inputFocus: {
      borderColor: "#0056b3",
      boxShadow: "0 6px 14px rgba(0, 91, 187, 0.2)",
    },
  };

  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <div style={styles.container}>
      <input
        type="text"
        placeholder="🔍 Search Medicine..."
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        style={{
          ...styles.input,
          ...(isFocused ? styles.inputFocus : {}),
        }}
      />
    </div>
  );
}

export default SearchBar;
