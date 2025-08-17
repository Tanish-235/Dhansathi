// Loader Component
const Loader = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-gradient-to-br from-purple-800 via-purple-900 to-purple-800 flex justify-center items-center z-[2000]">
      <div className="relative">
        <div className="flex space-x-2">
          {['ध', 'न', 'सा', 'थी'].map((letter, index) => (
            <span
              key={index}
              className="text-6xl font-bold opacity-0 translate-y-10 text-white drop-shadow-lg"
              style={{
                animation: `fadeInUp 0.8s forwards`,
                animationDelay: `${index * 0.3}s`
              }}
            >
              {letter}
            </span>
          ))}
        </div>
        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="w-16 h-1 bg-orange-500 rounded-full animate-pulse"></div>
        </div>
      </div>
      <style jsx>{`
        @keyframes fadeInUp {
          from { 
            opacity: 0; 
            transform: translateY(40px) scale(0.8); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
      `}</style>
    </div>
  );
};

export default Loader;