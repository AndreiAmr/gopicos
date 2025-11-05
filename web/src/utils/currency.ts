const formatCurrency = (value: string): string => {
  const numbers = value.replace(/\D/g, '');

  if (!numbers) return '';

  const amount = Number(numbers) / 100;

  return amount.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
};

const currencyToNumber = (value: string): number => {
  const numbers = value.replace(/\D/g, '');
  return Number(numbers) / 100;
};

export { formatCurrency, currencyToNumber };
