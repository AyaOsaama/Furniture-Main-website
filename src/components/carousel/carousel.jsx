import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; 

function Carousel({ slides, variant = "banner", idPrefix = "carousel" }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isRTL, setIsRTL] = useState(document.dir === 'rtl');
  const navigate = useNavigate()
 
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000); // تغيير الشريحة كل 5 ثواني

    return () => clearInterval(interval);
  }, [slides.length]);

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  return (
    <div className="carousel w-full relative overflow-hidden" dir={isRTL ? 'rtl' : 'ltr'}>
      <div 
        className="flex transition-transform duration-500 ease-in-out"
        style={{ 
          transform: `translateX(${isRTL ? currentSlide * 100 : -currentSlide * 100}%)`,
          direction: isRTL ? 'rtl' : 'ltr'
        }}
      >
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="carousel-item relative w-full flex-shrink-0"
          >
            {variant === "banner" && (
              <>
                <img
                  src={slide.image}
                  className="w-full h-[75vh] object-cover"
                  alt={slide.title}
                />
                <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-white text-center px-4">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3">
                    {slide.title}
                  </h1>
                  <p className="mb-6 text-sm sm:text-base md:text-lg w-[85%] sm:w-[70%] md:w-[60%] lg:w-[50%] xl:w-[40%]">
                    {slide.description}
                  </p>
                  <button className="btn btn-outline btn-sm sm:btn-md md:btn-lg" onClick={() => navigate("/shop")} > 

                    {slide.button} <span style={{marginTop:"3px"}}> ❯</span> 
                  </button>
                </div>
              </>
            )}

            {variant === "quoutes" && (
              <div className="w-full h-[60vh] flex flex-col justify-center items-center text-center bg-gray-100 px-6">
                <div className="text-5xl text-gray-400 mb-4">"</div>
                <p className="text-gray-700 max-w-2xl text-base sm:text-lg mb-4 italic">
                  {slide.quote}
                </p>
                <p className="font-bold text-gray-800">{slide.author}</p>
                <p className="text-sm text-gray-500">{slide.role}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="absolute top-1/2 left-2 right-2 -translate-y-1/2 flex justify-between sm:left-5 sm:right-5 z-10">
        <button
          onClick={isRTL ? handleNextSlide : handlePrevSlide}
          className="btn btn-circle btn-sm sm:btn-md bg-white/50 hover:bg-white/80 transition-all"
        >
          {isRTL ? '❯' : '❮'}
        </button>
        <button
          onClick={isRTL ? handlePrevSlide : handleNextSlide}
          className="btn btn-circle btn-sm sm:btn-md bg-white/50 hover:bg-white/80 transition-all"
        >
          {isRTL ? '❮' : '❯'}
        </button>
      </div>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all ${
              currentSlide === index ? "bg-white w-4" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default Carousel;
