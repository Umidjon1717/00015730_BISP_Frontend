import { Link } from "react-router-dom";

export default function Footer() {
  const mainLinks = [
    { to: "/", label: "Home" },
    { to: "/shop", label: "Shop" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const helpLinks = [
    { to: "/contact", label: "Help Center" },
    { to: "/payment-options", label: "Payment Options" },
    { to: "/returns", label: "Returns" },
    { to: "/privacy-policy", label: "Privacy Policy" },
  ];

  return (
    <footer className="w-full border-t border-gray-200 bg-gradient-to-b from-white to-gray-50 py-16 pb-20 text-gray-900 dark:border-zinc-800 dark:from-zinc-900 dark:to-zinc-950 dark:text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 xl:grid-cols-[1.2fr_0.9fr_1fr_1.2fr]">
          <div className="space-y-5">
            <h2 className="text-3xl font-semibold tracking-tight">Furino.</h2>
            <p className="max-w-md text-sm leading-6 text-gray-600 dark:text-gray-400">
              Timeless furniture for modern homes. Explore comfort, style, and
              practical living with pieces designed to elevate every room.
            </p>
            <address className="not-italic text-sm text-gray-600 dark:text-gray-400">
              <p className="text-[#9F9F9F] dark:text-gray-400">
                400 University Drive Suite 200 Coral
              </p>
              <p className="text-[#9F9F9F] dark:text-gray-400">Gables,</p>
              <p className="text-[#9F9F9F] dark:text-gray-400">FL 33134 USA</p>
            </address>
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-300">
              Links
            </h3>
            <nav className="flex flex-col space-y-3">
              {mainLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-300">
              Help
            </h3>
            <nav className="flex flex-col space-y-3">
              {helpLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="text-sm text-gray-700 transition-colors hover:text-black dark:text-gray-300 dark:hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-500 dark:text-gray-300">
              Newsletter
            </h3>
            <p className="text-sm leading-6 text-gray-600 dark:text-gray-400">
              Subscribe via email for product drops, special offers, and home
              styling inspiration.
            </p>
            <form
              className="flex flex-col gap-3 sm:max-w-md"
              onSubmit={(e) => e.preventDefault()}
            >
              <input
                type="email"
                placeholder="Enter your email address"
                className="h-12 rounded-xl border border-gray-300 bg-white px-4 text-sm text-gray-900 outline-none transition focus:border-gray-900 dark:border-gray-700 dark:bg-zinc-800 dark:text-white dark:focus:border-white"
              />
              <button
                type="submit"
                className="h-12 rounded-xl bg-gray-900 px-5 text-sm font-semibold text-white transition hover:bg-gray-700 dark:bg-white dark:text-zinc-900 dark:hover:bg-gray-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8 dark:border-gray-700">
          <p className="text-center text-sm font-medium tracking-wide text-gray-600 dark:text-gray-400">
            2026 Furino. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
}
