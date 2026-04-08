import { memo } from "react";
import { useCheckTokenQuery } from "@/redux/api/customer-api";

const Self = () => {
  const { data } = useCheckTokenQuery(null);
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white dark:bg-zinc-900 shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4">Mijoz Ma'lumotlari</h2>
      <div className=" flex flex-col gap-2">
        <p>
          <strong>Ism:</strong> {data?.customer?.first_name}
        </p>
        <p>
          <strong>Familiya:</strong> {data?.customer?.last_name}
        </p>
        <p>
          <strong>Telefon:</strong> {data?.customer?.phone_number}
        </p>
        <p>
          <strong>Email:</strong> {data?.customer?.email}
        </p>
        <div>
          <button className="py-2 mt-3 px-4 bg-bg-primary text-white rounded-md">
            Malumotlarni o'zgartirish
          </button>
        </div>
      </div>
    </div>
  );
};

export default memo(Self);
