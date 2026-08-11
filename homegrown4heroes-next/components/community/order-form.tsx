"use client";

import { FormEvent, useState } from "react";
import { submitOrder } from "@/app/community/actions";

type OrderSummary = {
  id: string;
  items: string;
  status: "new" | "reviewed" | "completed" | "cancelled";
  created_at: string;
};

const statusLabels: Record<OrderSummary["status"], string> = {
  new: "Received",
  reviewed: "Reviewed",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function OrderForm({ recentOrders }: { recentOrders: OrderSummary[] }) {
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("saving");
    setMessage("");

    const form = event.currentTarget;
    const result = await submitOrder(new FormData(form));

    if (!result.success) {
      setStatus("error");
      setMessage(result.message);
      return;
    }

    setStatus("saved");
    setMessage("Your order was saved. Review the prepared email and press Send to finish.");
    form.reset();
    window.location.href = result.mailtoUrl;
  }

  return (
    <div className="order-layout">
      <form onSubmit={handleSubmit} className="order-card">
        <div className="order-card-heading">
          <div>
            <span className="community-label">Order form</span>
            <h3>What would you like today?</h3>
          </div>
          <span className="secure-note">Members only</span>
        </div>

        {status === "saved" && <p className="form-success" role="status">{message}</p>}
        {status === "error" && <p className="form-message" role="alert">{message}</p>}

        <label>
          Items and quantities
          <textarea
            name="items"
            rows={6}
            placeholder={"Example:\n2 × Green tea\n1 × Seasonal blend"}
            required
            disabled={status === "saving"}
          />
        </label>

        <label>
          Notes <span className="optional-label">Optional</span>
          <textarea
            name="notes"
            rows={3}
            placeholder="Pickup details, substitutions, or questions…"
            disabled={status === "saving"}
          />
        </label>

        <button className="button button-full" type="submit" disabled={status === "saving"}>
          {status === "saving" ? "Saving order…" : "Save order and open email"}
        </button>

        <small className="order-explainer">
          Your request is recorded in the admin dashboard before your email app opens.
        </small>
      </form>

      <aside className="recent-orders-card">
        <span className="community-label">Your recent requests</span>
        <h3>Order history</h3>
        {recentOrders.length ? (
          <div className="member-order-list">
            {recentOrders.map((order) => (
              <article key={order.id}>
                <div className="member-order-meta">
                  <time>{new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(new Date(order.created_at))}</time>
                  <span className={`status-pill status-${order.status}`}>{statusLabels[order.status]}</span>
                </div>
                <p>{order.items}</p>
                <small>Order #{order.id.slice(0, 8)}</small>
              </article>
            ))}
          </div>
        ) : (
          <div className="recent-order-empty">
            <strong>No orders yet</strong>
            <p>Your three most recent requests will appear here.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
