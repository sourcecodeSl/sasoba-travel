import { useState } from 'react';
import { Loader2, Save } from 'lucide-react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';
import PageHeader from '../ui/PageHeader.jsx';
import { inputCls } from '../ui/Fields.jsx';
import { useToast } from '../ui/Toast.jsx';

function Row({ label, children }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs font-semibold text-navy-800">{label}</span>
      {children}
    </label>
  );
}

export default function AccountPage() {
  const { admin, setAdmin } = useAuth();
  const toast = useToast();
  const [form, setForm] = useState({ name: admin.name, email: admin.email, currentPassword: '', newPassword: '', confirm: '' });
  const [busy, setBusy] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const save = async (e) => {
    e.preventDefault();
    if (form.newPassword && form.newPassword !== form.confirm) return toast('The new passwords don’t match.', 'error');
    setBusy(true);
    try {
      const { admin: updated } = await api('auth/account', {
        method: 'PUT',
        body: { name: form.name, email: form.email, currentPassword: form.currentPassword, newPassword: form.newPassword },
      });
      setAdmin(updated);
      setForm((f) => ({ ...f, currentPassword: '', newPassword: '', confirm: '' }));
      toast(form.newPassword ? 'Password changed. Other devices were signed out.' : 'Account updated');
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={save} className="max-w-2xl space-y-6">
      <PageHeader eyebrow="Settings" title="Your account" text={admin.lastLoginAt ? `Last sign-in: ${new Date(admin.lastLoginAt.replace(' ', 'T')).toLocaleString()}` : undefined} />
      <section className="grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-navy-900/5 sm:grid-cols-2">
        <h2 className="font-display text-2xl font-semibold sm:col-span-2">Profile</h2>
        <Row label="Name">
          <input value={form.name} onChange={set('name')} className={inputCls} autoComplete="name" />
        </Row>
        <Row label="Email (used to sign in)">
          <input type="email" value={form.email} onChange={set('email')} className={inputCls} autoComplete="username" />
        </Row>
      </section>
      <section className="grid gap-4 rounded-3xl bg-white p-6 ring-1 ring-navy-900/5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <h2 className="font-display text-2xl font-semibold">Change password</h2>
          <p className="text-xs text-navy-800/50">Leave blank to keep your current password. Minimum 10 characters.</p>
        </div>
        <Row label="Current password">
          <input type="password" value={form.currentPassword} onChange={set('currentPassword')} className={inputCls} autoComplete="current-password" />
        </Row>
        <div className="hidden sm:block" />
        <Row label="New password">
          <input type="password" value={form.newPassword} onChange={set('newPassword')} className={inputCls} autoComplete="new-password" />
        </Row>
        <Row label="Confirm new password">
          <input type="password" value={form.confirm} onChange={set('confirm')} className={inputCls} autoComplete="new-password" />
        </Row>
      </section>
      <button type="submit" disabled={busy} className="inline-flex items-center gap-2 rounded-full bg-navy-900 px-6 py-3 text-sm font-semibold text-white hover:bg-teal disabled:opacity-60">
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Save account
      </button>
    </form>
  );
}
