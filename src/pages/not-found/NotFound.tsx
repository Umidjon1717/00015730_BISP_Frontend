import { memo, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  });
  const navigate = useNavigate();
  return (
    <section className="h-screen w-full flex flex-col justify-center items-center text-gray-600">
      <div className="text-center">
        <h1 className="text-9xl font-extrabold drop-shadow-2xl max-[600px]:text-7xl">
          404
        </h1>
        <h2 className="text-4xl font-bold mt-4 drop-shadow-2xl max-[600px]:text-2xl">
          Oops! Page Not Found
        </h2>
        <p className="text-lg mt-2 drop-shadow-lg max-[600px]:text-sm">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 inline-block bg-white dark:bg-bg-primary dark:text-white text-bg-primary font-semibold px-6 py-3 rounded-md shadow-md hover:bg-gray-100 transition duration-300"
        >
          Go Back to Home
        </button>
      </div>
    </section>
  );
};

export default memo(NotFoundPage);
