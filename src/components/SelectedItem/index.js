const SelectedItem = ({ key, text, onClick }) => {
  if (!text) return null;
  return (
    <span key={key} className="search__selected-item" onClick={onClick}>
    <span>{text} ×</span>
    </span>
  );
};

export default SelectedItem;