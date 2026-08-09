"use client";

import Link from "next/link";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { startPuzzlePackCheckout } from "@/lib/firebase";

interface BuyButtonProps {
  productId: string;
  locale: string;
  label: string;
  localDemo?: boolean;
}

export default function BuyButton({ productId, locale, label, localDemo = true }: BuyButtonProps) {
  const t = useTranslations("purchase");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  const onClick = async () => {
    setLoading(true);
    setError(false);
    try {
      const isLocal = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
      const useRealStripeLocally = process.env.NEXT_PUBLIC_USE_REAL_STRIPE_LOCAL === "true";
      if (localDemo && isLocal && !useRealStripeLocally) {
        window.location.href = `/${locale}/purchase/success/?demo=1`;
        return;
      }
      const url = await startPuzzlePackCheckout(productId, locale);
      if (!url) throw new Error("No checkout URL returned");
      window.location.href = url;
    } catch (err) {
      if (process.env.NODE_ENV !== "production") console.error("Checkout failed", err);
      setError(true);
      setLoading(false);
    }
  };

  return (
    <div className="checkout-actions">
      <label className="checkout-policy">
        <input
          type="checkbox"
          checked={acceptedPolicy}
          onChange={(event) => setAcceptedPolicy(event.target.checked)}
        />
        <span>
          {t("checkout.consent")} <Link href={`/${locale}/terms/#digital-purchases`}>{t("checkout.refundPolicy")}</Link>.
        </span>
      </label>
      <button type="button" className="button primary" onClick={onClick} disabled={loading || !acceptedPolicy}>
        {loading ? t("checkout.opening") : label}
      </button>
      <p className="checkout-note">{t("checkout.secureNote")}</p>
      {error && <p className="checkout-error">{t("checkout.error")}</p>}
    </div>
  );
}
