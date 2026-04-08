import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full py-16 pb-28 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Funiro.</h2>
            <address className="not-italic text-gray-600 dark:text-gray-400">
              <p className="text-[#9F9F9F]">
                400 University Drive Suite 200 Coral
              </p>
              <p className="text-[#9F9F9F]">Gables,</p>
              <p className="text-[#9F9F9F]">FL 33134 USA</p>
            </address>
          </div>
          <div className="space-y-8">
            <h3 className="text-gray-500 dark:text-gray-300">Links</h3>
            <nav className="flex flex-col space-y-3">
              <Link to="/" className="hover:underline  dark:text-blue-400">
                Home
              </Link>
              <Link to="/shop" className="hover:underline dark:text-blue-400">
                Shop
              </Link>
              <Link to="#" className="hover:underline dark:text-blue-400">
                About
              </Link>
              <Link to="#" className="hover:underline dark:text-blue-400">
                Contact
              </Link>
            </nav>
          </div>
          <div className="space-y-8">
            <h3 className="text-gray-500 dark:text-gray-300">Help</h3>
            <nav className="flex flex-col space-y-3">
              <Link to="#" className="hover:underline dark:text-blue-400">
                Payment Options
              </Link>
              <Link to="#" className="hover:underline dark:text-blue-400">
                Returns
              </Link>
              <Link to="#" className="hover:underline dark:text-blue-400">
                Privacy Policies
              </Link>
            </nav>
          </div>
          <div className="space-y-8">
            <h3 className="text-gray-500 dark:text-gray-300">Newsletter</h3>
            <form className="flex flex-wrap gap-2">
              <input
                type="email"
                placeholder="Enter Your Email Address"
                className="flex-1 border-b border-gray-300 dark:border-gray-600 p-1 focus:border-gray-900 focus:outline-none rounded-md bg-gray-50 dark:bg-gray-800 dark:text-white"
              />
              <button
                type="submit"
                className="whitespace-nowrap border-b border-gray-900 pb-1 text-sm font-semibold hover:border-gray-600 dark:hover:border-gray-400"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>
        <div className="mt-12 border-t border-gray-100 pt-8 dark:border-gray-700">
          <p className="text-center md:text-left">
            2023 furino. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
