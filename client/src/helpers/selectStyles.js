export const customStyles = (width, height) => ({
  control: (base, state) => ({
    ...base,
    minWidth: width,
    minHeight: height,
    borderColor: state.isFocused ? "#0B4A2D" : "#B0B0B0",
    boxShadow: state.isFocused ? "0 0 0 1px #0B4A2D" : null,
    "&:hover": {
      borderColor: "#0B4A2D",
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#0B4A2D"
      : state.isFocused
      ? "#E0E0E0"
      : "white",
    color: state.isSelected ? "white" : "#0B4A2D",
    "&:hover": {
      backgroundColor: "#E0E0E0",
      color: "#0B4A2D",
    },
  }),
  singleValue: (base) => ({
    ...base,
    color: "#0B4A2D",
  }),
  placeholder: (base) => ({
    ...base,
    color: "#A0A0A0", // Medium gray for the placeholder text
  }),
  menu: (base) => ({
    ...base,
    borderRadius: 0,
    marginTop: 0,
    backgroundColor: "white",
    borderColor: "#E0E0E0", // Light gray border
  }),
  menuList: (base) => ({
    ...base,
    padding: 0,
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#0B4A2D" : "#B0B0B0",
    "&:hover": {
      color: "#0B4A2D",
    },
  }),
  indicatorSeparator: (base) => ({
    ...base,
    backgroundColor: "#E0E0E0", // Light gray separator
  }),
  clearIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "#0B4A2D" : "#B0B0B0", // Medium gray for the clear indicator
    "&:hover": {
      color: "#0B4A2D",
    },
  }),
});
