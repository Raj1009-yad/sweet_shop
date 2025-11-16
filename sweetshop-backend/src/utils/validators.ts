export const isValidPrice = (price: any): boolean => {
  return typeof price === "number" && price >= 0;
};

export const isValidQuantity = (qty: any): boolean => {
  return typeof qty === "number" && qty >= 0;
};
