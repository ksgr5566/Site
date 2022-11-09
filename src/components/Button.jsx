const Button = ({ text, onClick }) => {
    return (
      <button className="bg-primary text-white px-6 py-2 rounded-full" onClick={onClick}>
        { text }
      </button>
    );
};
  
export default Button;