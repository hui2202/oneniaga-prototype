'use client';

import { useState } from 'react';
import {
  Boxes,
  ClipboardList,
  CreditCard,
  Database,
  LayoutDashboard,
  LineChart as LineChartIcon,
  Lock,
  LogOut,
  Menu,
  MessageCircle,
  Radio,
  Settings as SettingsIcon,
  Sparkles,
  Terminal,
  Wand2,
  X,
  Zap,
  type LucideIcon,
} from 'lucide-react';
import { NAVY } from '@/lib/theme';
import { useLang } from '@/lib/i18n';
import { LangPicker } from './ui';
import type { TabId } from '@/lib/types';

type NavItem = { id: TabId; key: string; icon: LucideIcon; gated: boolean };

const MAIN_NAV: NavItem[] = [
  { id: 'overview', key: 'nav.overview', icon: LayoutDashboard, gated: false },
  { id: 'orders', key: 'nav.orders', icon: ClipboardList, gated: false },
  { id: 'products', key: 'nav.products', icon: Boxes, gated: false },
  { id: 'automate', key: 'nav.automate', icon: Wand2, gated: true },
  { id: 'analyze', key: 'nav.analyze', icon: LineChartIcon, gated: true },
  { id: 'advise', key: 'nav.advise', icon: Sparkles, gated: true },
  { id: 'messages', key: 'nav.messages', icon: MessageCircle, gated: true },
];

const SYNC_NAV: NavItem[] = [
  { id: 'action-console', key: 'nav.actionConsole', icon: Zap, gated: false },
  { id: 'master-catalog', key: 'nav.masterCatalog', icon: Database, gated: false },
  { id: 'reservations', key: 'nav.reservations', icon: Lock, gated: false },
  { id: 'sync-ledger', key: 'nav.syncLedger', icon: Terminal, gated: false },
];

export function Sidebar({
  tab,
  setTab,
  subscribed,
  user,
  onSignOut,
}: {
  tab: TabId;
  setTab: (id: TabId) => void;
  subscribed: boolean;
  user: { email: string } | null;
  onSignOut: () => void;
}) {
  const { lang, setLang, t } = useLang();
  const [mobileOpen, setMobileOpen] = useState(false);

  function selectTab(id: TabId) {
    setTab(id);
    setMobileOpen(false);
  }

  function renderItem(n: NavItem) {
    const Icon = n.icon;
    const active = tab === n.id;
    const locked = n.gated && !subscribed;
    return (
      <button
        key={n.id}
        onClick={() => selectTab(n.id)}
        className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
        style={{ background: active ? '#E8552F' : 'transparent', color: active ? 'white' : '#C7CEDD' }}
      >
        <span className="flex items-center gap-3">
          <Icon size={17} />
          {t(n.key)}
        </span>
        {locked && <Lock size={13} style={{ color: active ? 'white' : '#7C88A6' }} />}
      </button>
    );
  }

  const navContent = (
    <>
      <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
        {MAIN_NAV.map(renderItem)}

        <div className="pt-3 mt-3 px-1" style={{ borderTop: '1px solid #2E4270' }}>
          <div className="text-[10px] font-bold tracking-wide mb-1.5 px-2" style={{ color: '#7C88A6' }}>
            {t('nav.inventorySync').toUpperCase()}
          </div>
          <div className="space-y-1">{SYNC_NAV.map(renderItem)}</div>
        </div>

        <div className="pt-3 mt-3" style={{ borderTop: '1px solid #2E4270' }}>
          <button onClick={() => selectTab('subscription')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium" style={{ background: tab === 'subscription' ? '#E8552F' : 'transparent', color: tab === 'subscription' ? 'white' : '#C7CEDD' }}>
            <CreditCard size={17} /> {t('nav.subscription')}
          </button>
          <button onClick={() => selectTab('settings')} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium" style={{ background: tab === 'settings' ? '#E8552F' : 'transparent', color: tab === 'settings' ? 'white' : '#C7CEDD' }}>
            <SettingsIcon size={17} /> {t('nav.settings')}
          </button>
        </div>
      </nav>
      <div className="px-4 pb-3 shrink-0">
        <div className="text-[10px] font-semibold mb-1.5 px-0.5" style={{ color: '#7C88A6' }}>{t('common.uiLanguage')}</div>
        <LangPicker lang={lang} setLang={setLang} dark />
      </div>
      <div className="px-4 py-4 shrink-0" style={{ borderTop: '1px solid #2E4270' }}>
        <div className="flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[12px] font-semibold text-white truncate">{user?.email}</div>
            <div className="text-[10.5px]" style={{ color: subscribed ? '#8FD9B6' : '#9AA0AC' }}>{subscribed ? t('common.subscribed') : t('common.free')}</div>
          </div>
          <button onClick={onSignOut} title={t('settings.signOut')} className="p-1.5 rounded-lg" style={{ color: '#C7CEDD' }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile top bar */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 shrink-0" style={{ background: NAVY }}>
        <button onClick={() => setMobileOpen(true)} className="p-1" style={{ color: 'white' }}>
          <Menu size={22} />
        </button>
        <span className="flex items-center gap-1.5 text-white font-bold text-base">
          <Radio size={16} style={{ color: '#E8552F' }} /> OneNiaga
        </span>
        <span style={{ width: 22 }} />
      </div>

      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-64 shrink-0 flex-col" style={{ background: NAVY, maxHeight: '100vh' }}>
        <div className="px-5 pt-6 pb-5 shrink-0">
          <div className="text-white font-bold text-xl tracking-tight">OneNiaga</div>
          <div className="text-[11px] mt-1" style={{ color: '#9AA0AC' }}>MVP Prototype · simulated data</div>
        </div>
        {navContent}
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.45)' }} onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 bottom-0 w-72 max-w-[85vw] flex flex-col" style={{ background: NAVY }}>
            <div className="flex items-center justify-between px-5 pt-6 pb-5 shrink-0">
              <div>
                <div className="text-white font-bold text-xl tracking-tight">OneNiaga</div>
                <div className="text-[11px] mt-1" style={{ color: '#9AA0AC' }}>MVP Prototype</div>
              </div>
              <button onClick={() => setMobileOpen(false)} style={{ color: '#C7CEDD' }}>
                <X size={20} />
              </button>
            </div>
            {navContent}
          </aside>
        </div>
      )}
    </>
  );
}
