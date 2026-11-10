const Modal = ({ children }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-gray-600 opacity-50"></div>
      <div className="relative bg-white p-8 rounded-lg shadow-lg w-1/2 max-w-5xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default Modal;
