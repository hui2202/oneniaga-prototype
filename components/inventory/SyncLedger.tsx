'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Activity, Bell, Gauge, Radio, ShieldCheck, Terminal, Wifi } from 'lucide-react';
import { BORDER, CORAL, MUTED, NAVY } from '@/lib/theme';
import { PLATFORMS } from '@/lib/platforms';
import { useLang } from '@/lib/i18n';
import { StatTile } from '../ui';
import { formatClock } from '@/lib/utils';
import type { EventType, LedgerEvent } from '@/lib/types';

const EVENT_STYLES: Record<EventType, { color: string; label: string }> = {
  INBOUND: { color: '#0F7AB8', label: 'INBOUND' },
  CALC: { color: '#B8791A', label: 'CALC  ' },
  OUTBOUND: { color: '#2E7D5B', label: 'OUTBOUND' },
};

export function SyncLedger({
  events,
  onInsertWebhook,
  liveFeed,
  onToggleLiveFeed,
}: {
  events: LedgerEvent[];
  onInsertWebhook: () => void;
  liveFeed: boolean;
  onToggleLiveFeed: () => void;
}) {
  const { t } = useLang();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [events.length]);

  const avgLatency = useMemo(() => {
    if (events.length === 0) return 0;
    const sum = events.reduce((s, e) => s + e.latencyMs, 0);
    return Math.round(sum / events.length);
  }, [events]);

  return (
    <div className="px-4 sm:px-8 py-6">
      <div className="mb-5">
        <div className="text-xs font-bold tracking-wide" style={{ color: CORAL }}>{t('nav.syncLedger').toUpperCase()}</div>
        <h1 className="flex items-center gap-2 text-2xl font-bold mt-1" style={{ color: NAVY }}>
          <Terminal className="h-5 w-5" style={{ color: CORAL }} />
          {t('syncLedger.title')}
        </h1>
        <p className="text-sm mt-1.5 max-w-2xl" style={{ color: MUTED }}>{t('syncLedger.desc')}</p>
      </div>

      <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatTile icon={Activity} label="Events Logged" value={`${events.length}`} accent="navy" />
        <StatTile icon={Gauge} label="Avg Latency" value={`${avgLatency}ms`} sub="Target < 500ms" accent="green" />
        <StatTile icon={Wifi} label="Feed Status" value={liveFeed ? 'Live' : 'Paused'} accent={liveFeed ? 'green' : 'amber'} />
        <StatTile icon={ShieldCheck} label="Failed Deliveries" value="0" sub="30-day window" accent="green" />
      </div>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row">
        <button onClick={onInsertWebhook} className="flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold text-white" style={{ background: NAVY }}>
          <Bell className="h-4 w-4" />
          Insert Simulated Order Webhook
        </button>
        <button
          onClick={onToggleLiveFeed}
          className="flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold"
          style={liveFeed ? { border: '1px solid #2E7D5B55', background: '#2E7D5B14', color: '#2E7D5B' } : { border: `1px solid ${BORDER}`, background: 'white', color: '#1F2328' }}
        >
          <Radio className="h-4 w-4" />
          {liveFeed ? 'Live Feed: On' : 'Live Feed: Off'}
        </button>
      </div>

      <div className="thin-scroll h-[480px] overflow-y-auto rounded-2xl p-4 font-mono text-[12.5px] leading-relaxed" style={{ background: '#0B1220', border: `1px solid ${BORDER}` }}>
        {events.map((e) => {
          const style = EVENT_STYLES[e.type];
          return (
            <div key={e.id} className="flex flex-wrap items-baseline gap-x-2 py-1.5" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: '#5A6B85' }}>{formatClock(e.ts)}</span>
              <span className="font-bold" style={{ color: style.color }}>[{style.label}]</span>
              <span style={{ color: '#8A97AC' }}>
                {e.channel === 'SYSTEM' ? 'system' : PLATFORMS.find((p) => p.id === e.channel)?.name.toLowerCase().replace(' ', '_')}
              </span>
              <span style={{ color: e.latencyMs < 250 ? '#4ADE80' : e.latencyMs < 500 ? '#FBBF24' : '#F87171', fontWeight: 600 }}>{e.latencyMs}ms</span>
              <span style={{ color: '#D6DCE8' }}>{e.message}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
