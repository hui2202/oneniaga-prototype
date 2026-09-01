'use client';

import { Check } from 'lucide-react';
import { BORDER, CORAL, GREEN, MUTED, NAVY, NAVY_LIGHT } from '@/lib/theme';
import { PLAN_DEFS } from '@/lib/seed';
import { useLang } from '@/lib/i18n';
import { PageHeader } from '../ui';
import type { PlanId } from '@/lib/types';

export function SubscriptionPage({
  subscribed,
  plan,
  setSubscribed,
  setPlan,
}: {
  subscribed: boolean;
  plan: PlanId | null;
  setSubscribed: (v: boolean) => void;
  setPlan: (p: PlanId | null) => void;
}) {
  const { t } = useLang();
  function subscribe(id: PlanId) {
    setPlan(id);
    setSubscribed(true);
  }
  function cancel() {
    setSubscribed(false);
    setPlan(null);
  }
  return (
    <div>
      <PageHeader eyebrow={t('nav.subscription')} title={subscribed ? t('subscription.titleManage') : t('subscription.title')} desc={subscribed ? t('subscription.descManage') : t('subscription.desc')} />
      <div className="px-4 sm:px-8 pb-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PLAN_DEFS.map((pl) => {
          const active = plan === pl.id;
          return (
            <div key={pl.id} className="rounded-xl p-5 flex flex-col" style={{ background: active ? NAVY : 'white', border: pl.highlight && !active ? `1.5px solid ${CORAL}` : `1px solid ${BORDER}` }}>
              {pl.highlight && !active && <span className="text-[10px] font-bold self-start px-2 py-0.5 rounded-full mb-2" style={{ background: '#FBE4DB', color: CORAL }}>{t('subscription.popular')}</span>}
              <div className="font-bold text-sm" style={{ color: active ? 'white' : NAVY }}>{pl.name}</div>
              <div className="mt-1">
                <span className="text-xl font-bold" style={{ color: active ? 'white' : NAVY }}>{pl.price}</span>
                <span className="text-[11px]" style={{ color: active ? '#9AA6C0' : MUTED }}>/mo</span>
              </div>
              <ul className="mt-3 space-y-1.5 flex-1">
                {pl.features.map((f, i) => (
                  <li key={i} className="flex items-start gap-1.5 text-[11.5px]" style={{ color: active ? '#E4E8F2' : '#1F2328' }}>
                    <Check size={12} className="mt-0.5 shrink-0" style={{ color: active ? '#8FD9B6' : GREEN }} /> {f}
                  </li>
                ))}
              </ul>
              {active ? (
                <button onClick={cancel} className="mt-4 w-full py-2 rounded-lg text-[12.5px] font-semibold" style={{ background: NAVY_LIGHT, color: 'white' }}>{t('subscription.cancel')}</button>
              ) : (
                <button onClick={() => subscribe(pl.id)} className="mt-4 w-full py-2 rounded-lg text-[12.5px] font-semibold text-white" style={{ background: CORAL }}>{subscribed ? t('subscription.switch') : t('subscription.subscribe')}</button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
