"use client";

import { toast } from "sonner";

export default function ToastTest() {
  return (
    <button
      type="button"
      onClick={() => toast("Toast is working!")}
      className="px-4 py-2 border rounded"
    >
      Show Test Toast
    </button>
  );
}