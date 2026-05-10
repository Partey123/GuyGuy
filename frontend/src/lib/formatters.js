export const formatCedi = (amount) =>
  new Intl.NumberFormat("en-GH", { style: "currency", currency: "GHS" }).format(
    Number(amount || 0),
  );

export const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-GH", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

export const formatPhone = (p) => (p || "").replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
