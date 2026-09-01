'use client';

import { useState } from 'react';
import { CreditCard, LogOut } from 'lucide-react';
import { BORDER, GREEN, MUTED, NAVY } from '@/lib/theme';
import { PLATFORMS } from '@/lib/platforms';
import { PLAN_DEFS } from '@/lib/seed';
import { useLang } from '@/lib/i18n';
import { PageHeader } from '../ui';
import type { PlanId, PlatformId, TabId } from '@/lib/types';

export function SettingsPage({
  user,
  linked,
  setLinked,
  subscribed,
  plan,
  setTab,
  onSignOut,
}: {
  user: { email: string } | null;
  linked: Record<PlatformId, boolean>;
  setLinked: (updater: (prev: Record<PlatformId, boolean>) => Record<PlatformId, boolean>) => void;
  subscribed: boolean;
  plan: PlanId | null;
  setTab: (id: TabId) => void;
  onSignOut: () => void;
}) {
  const { t } = useLang();
  const [connecting, setConnecting] = useState<PlatformId | null>(null);
  function toggle(id: PlatformId) {
    if (linked[id]) {
      setLinked((prev) => ({ ...prev, [id]: false }));
      return;
    }
    setConnecting(id);
    setTimeout(() => {
      setLinked((prev) => ({ ...prev, [id]: true }));
      setConnecting(null);
    }, 800);
  }
  return (
    <div>
      <PageHeader eyebrow={t('nav.settings')} title={t('settings.title')} />
      <div className="px-4 sm:px-8 pb-8 space-y-5 max-w-xl">
        <div className="rounded-xl p-5" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
          <div className="text-[12px] font-semibold mb-1" style={{ color: MUTED }}>{t('settings.signedInAs')}</div>
          <div className="text-sm font-medium" style={{ color: NAVY }}>{user?.email}</div>
          <button onClick={onSignOut} className="mt-3 flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-1.5 rounded-lg" style={{ background: '#FBE4DB', color: '#E8552F' }}>
            <LogOut size={13} /> {t('settings.signOut')}
          </button>
        </div>
        <div className="rounded-xl p-5" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
          <div className="text-[12px] font-semibold mb-3" style={{ color: MUTED }}>{t('settings.linked')}</div>
          <div className="space-y-2">
            {PLATFORMS.map((p) => (
              <div key={p.id} className="flex items-center justify-between rounded-lg px-3.5 py-2.5" style={{ border: `1px solid ${BORDER}` }}>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  <span className="text-sm" style={{ color: '#1F2328' }}>{p.name}</span>
                </div>
                <button onClick={() => toggle(p.id)} disabled={connecting === p.id} className="text-[11.5px] font-semibold px-3 py-1 rounded-lg" style={{ background: linked[p.id] ? '#E3EFE9' : NAVY, color: linked[p.id] ? GREEN : 'white' }}>
                  {connecting === p.id ? t('connect.connecting') : linked[p.id] ? t('settings.disconnect') : t('connect.connect')}
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl p-5" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
          <div className="text-[12px] font-semibold mb-1" style={{ color: MUTED }}>{t('settings.subscription')}</div>
          <div className="text-sm font-medium" style={{ color: NAVY }}>{subscribed ? PLAN_DEFS.find((p) => p.id === plan)?.name : t('settings.notSubscribed')}</div>
          <button onClick={() => setTab('subscription')} className="mt-3 flex items-center gap-1.5 text-[12.5px] font-semibold px-3 py-1.5 rounded-lg text-white" style={{ background: NAVY }}>
            <CreditCard size={13} /> {t('settings.manage')}
          </button>
        </div>
      </div>
    </div>
  );
}
