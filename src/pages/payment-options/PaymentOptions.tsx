const paymentMethods = [
  "Credit and debit cards for fast checkout",
  "Secure online payments processed safely",
  "Cash on delivery where available",
  "Order confirmation sent after successful payment",
];

export default function PaymentOptions() {
  return (
    <section className="bg-[#FCF8F3] py-16 dark:bg-zinc-900">
      <div className="container">
        <div className="mx-auto max-w-3xl rounded-3xl bg-white p-8 shadow-sm dark:bg-zinc-800">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#B88E2F]">
            Help
          </p>
          <h1 className="mb-4 text-4xl font-semibold text-gray-900 dark:text-white">
            Payment Options
          </h1>
          <p className="mb-8 text-base leading-7 text-gray-600 dark:text-gray-300">
            We offer simple and secure payment choices to make ordering your
            favorite furniture easy from start to finish.
          </p>

          <div className="space-y-4">
            {paymentMethods.map((item) => (
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
