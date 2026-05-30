import { useState } from "react";

export default function PaymentMethodSelector({ course, onMethodChange }) {
  const [selectedMethod, setSelectedMethod] = useState("upfront");

  const paymentMethods = [
    {
      id: "upfront",
      label: "Thanh toán toàn bộ",
      details: course.paymentOptions?.upfront?.price || "Liên hệ",
    },
    {
      id: "installment",
      label: "Trả góp",
      details: course.paymentOptions?.installment
        ? `${course.paymentOptions.installment.months} tháng - ${course.paymentOptions.installment.monthlyPrice}/tháng`
        : "Chưa hỗ trợ",
    },
  ];

  const handleMethodChange = (method) => {
    setSelectedMethod(method);
    onMethodChange?.(method);
  };

  return (
    <div className="space-y-4">
      {paymentMethods.map((method) => (
        <label
          key={method.id}
          className={`flex cursor-pointer items-start rounded-xl border-2 p-4 transition ${
            selectedMethod === method.id ? "border-[var(--ws-primary)] bg-[var(--ws-primary-soft)]" : "border-[var(--ws-border)] bg-white"
          }`}
        >
          <input
            type="radio"
            name="payment"
            value={method.id}
            checked={selectedMethod === method.id}
            onChange={() => handleMethodChange(method.id)}
            className="mt-1 cursor-pointer"
          />
          <div className="ml-4">
            <p className="font-semibold text-[var(--ws-ink)]">{method.label}</p>
            <p className="text-sm text-[var(--ws-muted)]">{method.details}</p>
          </div>
        </label>
      ))}
    </div>
  );
}
