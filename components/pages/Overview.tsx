'use client';

import { AlertTriangle, MessageCircle, Package, RotateCcw, Sparkles, TrendingUp } from 'lucide-react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { AMBER, BORDER, CORAL, GREEN, MUTED, NAVY } from '@/lib/theme';
import { PLATFORMS } from '@/lib/platforms';
import { WEEKLY_SALES } from '@/lib/seed';
import { useLang } from '@/lib/i18n';
import { AnimatedList, StatCard, StockTooltip, TiltCard } from '../ui';
import { stockDaysLeft, totalReturns } from '@/lib/utils';
import type { CustomerMessage, Order, PlatformId, Product, TabId } from '@/lib/types';

const PLATFORM_LINE_COLORS: Record<string, string> = {
  Shopee: '#EE4D2D',
  Lazada: '#0F146D',
  'TikTok Shop': '#12968C',
  Webstore: '#5B4B8A',
};

export function Overview({
  products,
  orders,
  anyLinked,
  linked,
  messages,
  setTab,
  goToWithFocus,
}: {
  products: Product[];
  orders: Order[];
  anyLinked: boolean;
  linked: Record<PlatformId, boolean>;
  messages: CustomerMessage[];
  setTab: (id: TabId) => void;
  goToWithFocus: (tab: TabId, focus: string | null) => void;
}) {
  const { t } = useLang();
  const totalRevenue = WEEKLY_SALES.reduce((s, d) => s + d.Shopee + d.Lazada + d['TikTok Shop'] + d.Webstore, 0);
  const awaiting = orders.filter((o) => o.status === 'awaiting').length;
  const lowStock = products.filter((p) => p.stock / p.dailySales < 3);
  const returnsThisWeek = products.reduce((s, p) => s + totalReturns(p.returns), 0);
  const unreplied = messages.filter((m) => !m.replied && linked[m.platform]).length;
  const elevatedReturns = products.filter((p) => totalReturns(p.returns) > 2);

  const attentionItems = [
    { key: 'orders', count: awaiting, label: t(awaiting === 1 ? 'overview.itemOrders1' : 'overview.itemOrdersN'), icon: Package, tab: 'orders' as TabId, focus: null },
    { key: 'stock', count: lowStock.length, label: t(lowStock.length === 1 ? 'overview.itemStock1' : 'overview.itemStockN'), icon: AlertTriangle, tab: 'products' as TabId, focus: 'lowStock' },
    { key: 'messages', count: unreplied, label: t(unreplied === 1 ? 'overview.itemMsg1' : 'overview.itemMsgN'), icon: MessageCircle, tab: 'messages' as TabId, focus: null },
    { key: 'returns', count: elevatedReturns.length, label: t(elevatedReturns.length === 1 ? 'overview.itemReturns1' : 'overview.itemReturnsN'), icon: RotateCcw, tab: 'products' as TabId, focus: 'elevatedReturns' },
  ].filter((it) => it.count > 0);

  const stockData = products
    .map((p) => ({ name: p.name, daysLeft: stockDaysLeft(p), stock: p.stock }))
    .sort((a, b) => a.daysLeft - b.daysLeft);
  const stockColor = (days: number) => (days < 3 ? CORAL : days < 7 ? AMBER : GREEN);

  return (
    <div>
      <div className="px-4 sm:px-8 pt-8 pb-2">
        <div className="text-xs font-bold tracking-wide" style={{ color: CORAL }}>{t('nav.overview').toUpperCase()}</div>
        <h1 className="text-2xl font-bold mt-1" style={{ color: NAVY }}>{t('overview.title')}</h1>
        <p className="text-sm mt-1.5 max-w-2xl" style={{ color: MUTED }}>{t('overview.desc')}</p>
      </div>

      {!anyLinked && (
        <div className="mx-4 sm:mx-8 mt-4 rounded-lg px-4 py-3 text-[13px]" style={{ background: '#FBE4DB', color: '#8A3A1F' }}>{t('overview.noPlatforms')}</div>
      )}

      {anyLinked && (
        <div className="mx-4 sm:mx-8 mt-4 rounded-xl overflow-hidden" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
          <div className="px-4 py-2.5 text-[11px] font-bold" style={{ color: NAVY, background: '#F4F1EC' }}>{t('overview.attention')}</div>
          {attentionItems.length === 0 ? (
            <div className="px-4 py-4 text-[13px]" style={{ color: MUTED }}>{t('overview.caughtUp')}</div>
          ) : (
            <AnimatedList staggerMs={50}>
              {attentionItems.map((it, i) => {
                const Icon = it.icon;
                return (
                  <button key={it.key} onClick={() => goToWithFocus(it.tab, it.focus)} className="w-full flex items-center justify-between px-4 py-2.5 text-left" style={{ borderTop: i > 0 ? '1px solid #F0EDE6' : 'none' }}>
                    <span className="flex items-center gap-2.5 text-[13px]" style={{ color: '#1F2328' }}>
                      <Icon size={15} style={{ color: CORAL }} />
                      <span>
                        <b style={{ color: NAVY }}>{it.count}</b> {it.label}
                      </span>
                    </span>
                  </button>
                );
              })}
            </AnimatedList>
          )}
        </div>
      )}

      <div className="px-4 sm:px-8 py-6 grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label={t('overview.statRevenue')} value={`RM ${totalRevenue.toLocaleString()}`} icon={TrendingUp} />
        <StatCard label={t('overview.statAwaiting')} value={awaiting} icon={Package} tone={awaiting > 3 ? 'warn' : 'default'} />
        <StatCard label={t('overview.statStock')} value={lowStock.length} icon={AlertTriangle} tone={lowStock.length > 0 ? 'warn' : 'default'} />
        <StatCard label={t('overview.statReturns')} value={returnsThisWeek} icon={RotateCcw} tone={returnsThisWeek > 5 ? 'warn' : 'default'} />
      </div>

      <div className="px-4 sm:px-8 pb-4 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl p-5" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
          <div className="font-semibold text-sm mb-3" style={{ color: NAVY }}>{t('overview.chartMix')}</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={WEEKLY_SALES}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEEAE0" />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke={MUTED} />
              <YAxis tick={{ fontSize: 11 }} stroke={MUTED} />
              <Tooltip />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              {PLATFORMS.map((p) => (
                <Line key={p.name} type="monotone" dataKey={p.name} stroke={PLATFORM_LINE_COLORS[p.name] ?? p.color} strokeWidth={2} dot={false} />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
        <TiltCard className="rounded-xl p-5" style={{ background: NAVY }}>
          <div className="flex items-center gap-2 text-white font-semibold text-sm mb-3">
            <Sparkles size={16} style={{ color: '#E8552F' }} /> {t('overview.adviseTitle')}
          </div>
          <p className="text-[13px] leading-relaxed" style={{ color: '#C7CEDD' }}>{t('overview.adviseBody')}</p>
        </TiltCard>
      </div>

      <div className="px-4 sm:px-8 pb-8">
        <div className="rounded-xl p-5" style={{ background: 'white', border: `1px solid ${BORDER}` }}>
          <div className="font-semibold text-sm mb-1" style={{ color: NAVY }}>{t('overview.chartStock')}</div>
          <p className="text-[11.5px] mb-3" style={{ color: MUTED }}>{t('overview.chartStockHint')}</p>
          <ResponsiveContainer width="100%" height={Math.max(140, stockData.length * 42)}>
            <BarChart data={stockData} layout="vertical" margin={{ left: 10, right: 30, top: 5, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#EEEAE0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} stroke={MUTED} label={{ value: t('overview.daysLeft'), position: 'insideBottom', offset: -3, fontSize: 10, fill: MUTED }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11.5 }} stroke={MUTED} width={170} />
              <Tooltip content={<StockTooltip t={t} />} />
              <Bar dataKey="daysLeft" radius={[0, 4, 4, 0]} barSize={20}>
                {stockData.map((d, i) => (
                  <Cell key={i} fill={stockColor(d.daysLeft)} />
                ))}
                <LabelList dataKey="daysLeft" position="right" style={{ fontSize: 11, fill: '#1F2328', fontWeight: 600 }} formatter={(v: number) => `${v}d`} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
