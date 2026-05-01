export default function ExploreButton({
  as: Component = 'button',
  type = 'button',
  children = 'Explore',
  className = '',
  showArrow = true,
  ...rest
}) {
  const isButton = Component === 'button';

  return (
    <Component
      {...(isButton ? { type } : {})}
      className={`relative z-10 inline-flex justify-center items-center gap-2 mx-auto px-4 py-2 overflow-hidden border-2 rounded-full shadow-xl text-sm sm:text-base bg-gray-50 backdrop-blur-md font-medium border-gray-50 text-gray-900 no-underline transition-colors duration-300 group hover:text-black hover:border-transparent ${className}`}
      {...rest}
    >
      <span className="relative z-10">{children}</span>

      {showArrow && (
        <svg
          className="relative z-10 w-7 h-7 p-2 rounded-full border border-gray-700 text-current transition-transform duration-300 transform-gpu rotate-45 group-hover:translate-x-1 group-hover:rotate-90 group-hover:border-black group-hover:bg-black group-hover:text-white"
          viewBox="0 0 16 19"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M7 18C7 18.5523 7.44772 19 8 19C8.55228 19 9 18.5523 9 18H7ZM8.70711 0.292893C8.31658 -0.0976311 7.68342 -0.0976311 7.29289 0.292893L0.928932 6.65685C0.538408 7.04738 0.538408 7.68054 0.928932 8.07107C1.31946 8.46159 1.95262 8.46159 2.34315 8.07107L8 2.41421L13.6569 8.07107C14.0474 8.46159 14.6805 8.46159 15.0711 8.07107C15.4616 7.68054 15.4616 7.04738 15.0711 6.65685L8.70711 0.292893ZM9 18L9 1H7L7 18H9Z"
            className="fill-current"
          />
        </svg>
      )}

      <span className="absolute inset-y-0 left-0 w-0 rounded-full transition-all duration-700 group-hover:w-full group-hover:scale-100 -z-10 bg-gradient-to-r from-emerald-300/35 via-cyan-200/25 to-sky-400/35" />
      <span className="absolute inset-0 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100 shadow-[0_0_18px_-4px_rgba(20,184,166,0.35),-18px_0_28px_-8px_rgba(59,131,246,0.28),18px_0_28px_-8px_rgba(20,184,166,0.28)]" />
    </Component>
  );
}
