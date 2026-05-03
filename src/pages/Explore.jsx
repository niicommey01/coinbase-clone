import { useEffect, useMemo, useState } from 'react';
import CryptoTable from '../components/crypto/CryptoTable';
import { apiFetch } from '../lib/api';
import { mapCoinFromApi } from '../lib/cryptoMappers';

const FILTERS = {
    all: 'All assets',
    gainers: 'Top gainers',
    losers: 'Top losers',
};

const Explore = () => {
    const [search, setSearch] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [coins, setCoins] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState(null);

    useEffect(() => {
        let cancelled = false;

        async function load() {
            setLoading(true);
            setLoadError(null);
            try {
                if (selectedFilter === 'losers') {
                    const res = await apiFetch('/crypto');
                    const mapped = (res.data || []).map(mapCoinFromApi);
                    const losers = mapped
                        .filter((c) => c.change < 0)
                        .sort((a, b) => a.change - b.change);
                    if (!cancelled) setCoins(losers);
                } else if (selectedFilter === 'gainers') {
                    const res = await apiFetch('/crypto/gainers');
                    if (!cancelled) setCoins((res.data || []).map(mapCoinFromApi));
                } else {
                    const res = await apiFetch('/crypto');
                    if (!cancelled) setCoins((res.data || []).map(mapCoinFromApi));
                }
            } catch (e) {
                if (!cancelled) {
                    setLoadError(e.message || 'Could not load markets.');
                    setCoins([]);
                }
            } finally {
                if (!cancelled) setLoading(false);
            }
        }

        load();
        return () => {
            cancelled = true;
        };
    }, [selectedFilter]);

    const filteredData = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return coins;
        return coins.filter(
            (coin) =>
                coin.name.toLowerCase().includes(query) ||
                coin.symbol.toLowerCase().includes(query),
        );
    }, [search, coins]);

    return (
        <div className="cb-reveal mx-auto max-w-[1180px] px-6 py-12" style={{ '--reveal-delay': '40ms' }}>
            <h1 className="mb-4 text-3xl font-bold text-[#0a0b0d]">Explore crypto prices</h1>
            <p className="mb-8 text-[#5b616e]">Track top cryptocurrencies by market cap and daily performance.</p>

            <div className="mb-6 flex flex-col gap-4 rounded-xl border border-gray-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <input
                    type="search"
                    placeholder="Search by asset name or symbol"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-2.5 focus:border-[#0052ff] focus:outline-none focus:ring-1 focus:ring-[#0052ff] sm:max-w-sm"
                />
                <div className="flex flex-wrap gap-2">
                    {Object.entries(FILTERS).map(([value, label]) => (
                        <button
                            key={value}
                            onClick={() => setSelectedFilter(value)}
                            className={`rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                                selectedFilter === value
                                    ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-[#4a5260] hover:bg-gray-200'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>
            </div>

            {loadError ? (
                <p className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
                    {loadError} Make sure the API is running and{' '}
                    <code className="rounded bg-red-100 px-1">VITE_API_URL</code> is set in{' '}
                    <code className="rounded bg-red-100 px-1">.env</code>.
                </p>
            ) : null}

            <div className="cb-hover-rise overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {loading ? (
                    <p className="p-8 text-center text-[#5b616e]">Loading markets…</p>
                ) : (
                    <CryptoTable data={filteredData} />
                )}
            </div>
        </div>
    );
};

export default Explore;
