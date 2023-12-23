const CustomTooltip = ({ children, text }) => (
    <div className="relative inline-block group">
      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className={`bg-blue-950 border border-white text-white py-1 w-max px-2 text-center rounded-md absolute top-full left-1/2 -translate-x-1/2 z-[999]`}>
          {text}
        </div>
      </div>
      {children}
    </div>
  );

export default CustomTooltip;