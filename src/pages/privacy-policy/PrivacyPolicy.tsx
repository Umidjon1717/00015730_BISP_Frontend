const privacyPoints = [
  "We collect only the information needed to process orders and support your account.",
  "Your personal details are stored securely and handled with care.",
  "We do not share your private information without a valid business reason.",
  "You may contact us anytime for questions about your data and privacy.",
];

export default function PrivacyPolicy() {
  return (
    <section className="bg-[#FCF8F3] py-16 dark:bg-zinc-900">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm dark:bg-zinc-800">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#B88E2F]">
            Help
          </p>
          <h1 className="mb-4 text-4xl font-semibold text-gray-900 dark:text-white">
            Privacy Policy
          </h1>
          <p className="mb-8 text-base leading-7 text-gray-600 dark:text-gray-300">
            Your privacy matters to us. This page gives a simple overview of
            how customer information is protected and used responsibly.
          </p>

          <div className="space-y-4">
            {privacyPoints.map((item) => (
              <div
                key={item}
                className="rounded-2xl border border-gray-200 p-4 text-gray-700 dark:border-zinc-700 dark:text-gray-200"
              >
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
