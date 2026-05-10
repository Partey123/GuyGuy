// Mock Paystack hook. Replace with real Paystack inline integration.
export function usePaystack() {
  const pay = async ({ amount, onSuccess }) => {
    await new Promise((r) => setTimeout(r, 800));
    onSuccess?.({ reference: "PSK-" + Date.now(), amount, status: "success" });
  };
  return { pay };
}
