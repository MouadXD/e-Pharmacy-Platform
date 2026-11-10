const Container = ({ children }) => {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-full">
      {children}
    </div>
  );
};

export default Container;
