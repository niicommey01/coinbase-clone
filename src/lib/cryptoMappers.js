/** Map backend crypto document to the shape used by CryptoRow / Home cards */
export function mapCoinFromApi(c) {
  const imageUrl = typeof c.image === 'string' && c.image.length > 0 ? c.image : null;
  return {
    id: c.id,
    name: c.name,
    symbol: c.symbol,
    price: Number(c.price),
    change: Number(c.change24h),
    marketCap: '—',
    volume: '—',
    circulatingSupply: '—',
    image: imageUrl,
    color: 'bg-blue-600',
  };
}
