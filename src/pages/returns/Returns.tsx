const returnSteps = [
  "Request a return within the eligible return period.",
  "Keep the product in good condition with original packaging.",
  "Our support team will guide pickup or drop-off instructions.",
  "Approved returns are processed after product inspection.",
];

export default function Returns() {
  return (
    <section className="bg-[#FCF8F3] py-16 dark:bg-zinc-900">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm dark:bg-zinc-800">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#B88E2F]">
            Help
          </p>
          <h1 className="mb-4 text-4xl font-semibold text-gray-900 dark:text-white">
            Returns
          </h1>
          <p className="mb-8 text-base leading-7 text-gray-600 dark:text-gray-300">
            We want you to shop with confidence. If something is not right, our
            return process is designed to be clear and customer-friendly.
          </p>

          <div className="space-y-4">
            {returnSteps.map((item) => (
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
