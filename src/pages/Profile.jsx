import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { apiFetch } from '../lib/api';

export default function Profile() {
  const { user, logout } = useAuth();
  const [form, setForm] = useState({
    name: '',
    symbol: '',
    price: '',
    image: '',
    change24h: '',
  });
  const [msg, setMsg] = useState(null);
  const [err, setErr] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAddCrypto = async (e) => {
    e.preventDefault();
    setErr(null);
    setMsg(null);
    setSaving(true);
    try {
      await apiFetch('/crypto', {
        method: 'POST',
        body: {
          name: form.name.trim(),
          symbol: form.symbol.trim(),
          price: Number(form.price),
          image: form.image.trim(),
          change24h: Number(form.change24h),
        },
      });
      setMsg('Listing added.');
      setForm({ name: '', symbol: '', price: '', image: '', change24h: '' });
    } catch (error) {
      setErr(error.message || 'Could not add listing.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="cb-reveal mx-auto max-w-[720px] px-6 py-12" style={{ '--reveal-delay': '40ms' }}>
      <Link to="/" className="mb-6 inline-flex items-center font-medium text-blue-600 hover:text-blue-800">
        <FiArrowLeft className="mr-2 h-4 w-4" /> Back home
      </Link>

      <h1 className="text-3xl font-bold text-[#0a0b0d]">Your profile</h1>
      <p className="mt-2 text-[#5b616e]">Signed-in account from your class API.</p>

      <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <dl className="space-y-3 text-sm">
          <div>
            <dt className="font-semibold text-gray-500">Name</dt>
            <dd className="text-lg text-[#0a0b0d]">{user?.name}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-500">Email</dt>
            <dd className="text-lg text-[#0a0b0d]">{user?.email}</dd>
          </div>
          <div>
            <dt className="font-semibold text-gray-500">User id</dt>
            <dd className="break-all font-mono text-xs text-[#374151]">{user?.id}</dd>
          </div>
        </dl>

        <button
          type="button"
          onClick={() => logout()}
          className="mt-8 rounded-full border border-gray-300 px-6 py-2 text-sm font-semibold text-[#0a0b0d] hover:bg-gray-50"
        >
          Sign out
        </button>
      </div>

      <div className="mt-10 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#0a0b0d]">Add cryptocurrency (demo)</h2>
        <p className="mt-1 text-sm text-[#5b616e]">
          POST /crypto requires authentication. Use fake data only.
        </p>

        <form onSubmit={handleAddCrypto} className="mt-6 grid gap-4 sm:grid-cols-2">
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-gray-600">Name</span>
            <input
              required
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="Bitcoin"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-gray-600">Symbol</span>
            <input
              required
              value={form.symbol}
              onChange={(e) => setForm((f) => ({ ...f, symbol: e.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 uppercase"
              placeholder="BTC"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-gray-600">Price (USD)</span>
            <input
              required
              type="number"
              min="0"
              step="any"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="68000"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-gray-600">Image URL</span>
            <input
              required
              type="url"
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="https://…"
            />
          </label>
          <label className="block sm:col-span-2">
            <span className="text-xs font-semibold text-gray-600">24h change (%)</span>
            <input
              required
              type="number"
              step="any"
              value={form.change24h}
              onChange={(e) => setForm((f) => ({ ...f, change24h: e.target.value }))}
              className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2"
              placeholder="2.5"
            />
          </label>
          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={saving}
              className="rounded-full bg-[#0052ff] px-6 py-2 text-sm font-semibold text-white hover:bg-[#0046d5] disabled:opacity-60"
            >
              {saving ? 'Saving…' : 'Add listing'}
            </button>
            {msg ? <p className="mt-2 text-sm text-green-600">{msg}</p> : null}
            {err ? <p className="mt-2 text-sm text-red-600">{err}</p> : null}
          </div>
        </form>
      </div>
    </div>
  );
}
