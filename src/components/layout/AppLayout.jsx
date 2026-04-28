import { useEffect, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, Menu, X } from 'lucide-react';
import TopNavbar from '../common/TopNavbar';
import coBrotherLogo from '../../assets/Cobrother_logo.png';
import { useAuth } from '../../context/AuthContext';
import { notificationAPI } from '../../api/services';
import DashboardIcon from '../../assets/Dashboard.png';
import VentureIcon from '../../assets/Coventure_logo.png';
import CommunityIcon from '../../assets/Community-profileicon.png';
import DomainsIcon from '../../assets/CoBranding.png';
import TechnologyIcon from '../../assets/CoCreation.png';
import AuctionIcon from '../../assets/Auction.png';
import PurchaseIcon from '../../assets/purchase.png';
import NotificationIcon from '../../assets/notification.png';
import AdminIcon from '../../assets/Community-profileicon.png';
import { Zap } from 'lucide-react';

const TYPE_ICONS = {
  COVENTURE_APPLICATION_RECEIVED: 'ðŸ“‹',
  COVENTURE_APPLICATION_STATUS_CHANGED: 'ðŸ“£',
  DOMAIN_SOLD: 'â—‡',
  SOFTWARE_PURCHASED: 'âŸ',
  SOFTWARE_MARKED_COMPLETE: 'âœ“',
  PROFILE_VIEWED: 'ðŸ‘',
  NEW_LISTING_IN_INDUSTRY: 'ðŸ†•',
};

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function renderNavIcon(icon, label) {
  const isImageSource = typeof icon === 'string' && /^(data:|https?:|\/)/.test(icon);

  if (isImageSource) {
    return (
      <span className="inline-flex items-center justify-center w-5 h-5">
        <img src={icon} alt="" className="w-full h-full object-contain" />
      </span>
    );
  }

  return (
    <span
      className="inline-flex items-center justify-center w-5 h-5 text-base leading-none"
      aria-hidden="true"
      title={label}
    >
      {icon}
    </span>
  );
}

export default function AppLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const bellRef = useRef(null);

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: DashboardIcon },
    { to: '/ventures', label: 'Venture', icon: VentureIcon },
    { to: '/domains', label: 'Domains', icon: DomainsIcon },
    { to: '/cocreation', label: 'Technology', icon: TechnologyIcon },
    { to: '/community', label: 'Disruptor', icon: CommunityIcon },
    { to: '/auctions', label: 'Auctions', icon: AuctionIcon },
    { to: '/purchases', label: 'Purchases', icon: PurchaseIcon },
    { to: '/insights', label: 'Insights', icon: '⚡' },
  ];

  const coBrotherLinks = [{ to: '/cobrother', label: 'CoBrother', icon: 'â—†' }];

  const adminLinks = [...navLinks, { to: '/admin', label: 'Admin', icon: AdminIcon }];

  const visibleLinks =
    user?.role === 'COBROTHER'
      ? coBrotherLinks
      : user?.role === 'ADMIN'
        ? adminLinks
        : navLinks;

  useEffect(() => {
    const fetchCount = () =>
      notificationAPI
        .getUnreadCount()
        .then(({ data }) => setUnreadCount(data.count))
        .catch(() => {});

    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (bellRef.current && !bellRef.current.contains(e.target)) {
        setBellOpen(false);
      }
    };

    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  const handleBellOpen = async () => {
    if (!bellOpen) {
      try {
        const { data } = await notificationAPI.getRecent();
        setNotifications(Array.isArray(data) ? data : []);
      } catch {}
    }
    setBellOpen((v) => !v);
  };

  const handleMarkAllRead = async () => {
    await notificationAPI.markAllRead();
    setNotifications((items) => items.map((item) => ({ ...item, read: true })));
    setUnreadCount(0);
  };

  const handleNotificationClick = async (notification) => {
    if (!notification.read) {
      await notificationAPI.markOneRead(notification.id);
      setNotifications((items) =>
        items.map((item) =>
          item.id === notification.id ? { ...item, read: true } : item,
        ),
      );
      setUnreadCount((count) => Math.max(0, count - 1));
    }

    setBellOpen(false);
    if (notification.link) navigate(notification.link);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <TopNavbar />

      <nav className="sticky top-[40px] md:top-[45px] z-[100] flex items-center gap-3 md:gap-5 px-4 sm:px-6 xl:px-8 h-[60px] md:h-16 bg-white border-b border-gray-200 min-w-0">
        <Link to="/" className="flex items-center gap-0 no-underline shrink-0">
          <img
            src={coBrotherLogo}
            alt="CoBrother"
            className="w-[122px] h-9 object-contain md:w-[140px] md:h-[42px]"
          />
        </Link>

        <div className="hidden xl:flex items-center gap-1 flex-1 min-w-0">
          {visibleLinks.map((link) => {
            const isActive = location.pathname.startsWith(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-full border border-gray-200 bg-white text-sm font-semibold text-gray-800 no-underline transition-all duration-200 hover:text-gray-900 hover:border-gray-300 hover:shadow-[-18px_0_28px_-8px_rgba(0,195,255,0.45),18px_0_28px_-8px_rgba(147,51,234,0.40),0_0_18px_-4px_rgba(120,80,220,0.24)] active:translate-y-[1px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-300/60 ${
                  isActive
                    ? 'text-gray-900 bg-white border-gray-300 shadow-[-18px_0_28px_-8px_rgba(0,195,255,0.45),18px_0_28px_-8px_rgba(147,51,234,0.40),0_0_18px_-4px_rgba(120,80,220,0.24)]'
                    : ''
                }`}
              >
                {renderNavIcon(link.icon, link.label)}
                <span className={isActive ? 'bg-gradient-to-r from-indigo-600 to-fuchsia-500 text-transparent bg-clip-text' : ''}>
                  {link.label}
                </span>
              </Link>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2 md:gap-3 shrink-0">
          <div className="relative max-xl:hidden" ref={bellRef}>
            <button
              className="relative bg-white border border-gray-200 cursor-pointer p-2.5 rounded-xl text-gray-600 transition-all duration-150 leading-none hover:bg-gray-100 hover:text-gray-900 hover:border-gray-300 flex items-center justify-center"
              onClick={handleBellOpen}
              title="Notifications"
            >
              <img
                src={NotificationIcon}
                alt="Notifications"
                className="w-5 h-5 object-contain flex-shrink-0"
              />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#c86e6e] text-white text-[0.65rem] font-bold min-w-[18px] h-[18px] rounded-lg flex items-center justify-center px-[5px] pointer-events-none">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>

            {bellOpen && (
              <div className="absolute top-[calc(100%+10px)] right-0 w-[360px] bg-white border border-gray-200 rounded-[14px] shadow-[0_20px_60px_rgba(0,0,0,0.5)] z-[1000] overflow-hidden">
                <div className="flex justify-between items-center px-4 py-3.5 border-b border-gray-100 font-semibold text-sm text-gray-900">
                  <span>Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      className="bg-transparent border-none text-gray-700 text-xs cursor-pointer p-0 hover:underline"
                      onClick={handleMarkAllRead}
                    >
                      Mark all read
                    </button>
                  )}
                </div>

                <div className="max-h-[380px] overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="py-8 px-4 text-center text-gray-500 text-sm">
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`flex items-start gap-3 px-4 py-3.5 border-b border-gray-100 cursor-pointer transition-colors duration-150 relative last:border-b-0 hover:bg-gray-50 ${
                          !notification.read ? 'bg-[#f8faff]' : ''
                        }`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm bg-gray-100 flex-shrink-0">
                          {TYPE_ICONS[notification.type] || 'ðŸ””'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-[0.82rem] font-semibold text-gray-900 mb-0.5">
                            {notification.title}
                          </div>
                          <div className="text-[0.77rem] text-gray-500 leading-snug whitespace-nowrap overflow-hidden text-ellipsis">
                            {notification.message}
                          </div>
                          <div className="text-[0.7rem] text-gray-400 mt-1">
                            {timeAgo(notification.createdAt)}
                          </div>
                        </div>
                        {!notification.read && (
                          <div className="w-[7px] h-[7px] rounded-full bg-gray-600 flex-shrink-0 mt-1.5" />
                        )}
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 py-3 border-t border-gray-100 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setBellOpen(false)}
                    className="text-[0.78rem] text-gray-700 no-underline hover:underline"
                  >
                    View all notifications â†’
                  </Link>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] bg-gray-100 text-gray-700 rounded-full flex items-center justify-center font-semibold text-sm">
              {user?.firstname?.[0]?.toUpperCase() ||
                user?.email?.[0]?.toUpperCase() ||
                '?'}
            </div>
            <span className="text-sm font-medium text-gray-700 max-xl:hidden">
              {user?.firstname?.toUpperCase() || user?.email?.split('@')[0]?.toUpperCase()}
            </span>
            <button
              className="max-xl:hidden bg-transparent border border-gray-200 text-gray-600 rounded-lg p-1.5 cursor-pointer transition-all duration-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
              onClick={handleLogout}
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>

          <button
            type="button"
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="xl:hidden inline-flex items-center justify-center rounded-xl border border-gray-200 bg-white p-2 text-gray-900 cursor-pointer transition-all duration-200 hover:border-gray-300 hover:bg-gray-50"
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {mobileOpen && (
        <>
          <div
            className="xl:hidden fixed top-[100px] md:top-[109px] inset-x-0 bottom-0 bg-black/30 z-[90]"
            onClick={() => setMobileOpen(false)}
          />
          <div className="xl:hidden fixed top-[100px] md:top-[109px] inset-x-0 bg-white border-b border-gray-200 z-[110] p-4 max-h-[calc(100dvh-100px)] md:max-h-[calc(100dvh-109px)] overflow-y-auto">
            <div className="flex flex-col gap-1">
              {visibleLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3.5 py-2.5 rounded-[14px] border border-gray-200 bg-white text-sm font-semibold text-gray-800 no-underline transition-all duration-200 hover:text-gray-900 hover:border-gray-300 hover:shadow-[-18px_0_28px_-8px_rgba(0,195,255,0.40),18px_0_28px_-8px_rgba(147,51,234,0.34),0_0_18px_-4px_rgba(120,80,220,0.20)] active:translate-y-[1px] ${
                    location.pathname.startsWith(link.to)
                      ? 'text-gray-900 bg-white border-gray-300 shadow-[-18px_0_28px_-8px_rgba(0,195,255,0.40),18px_0_28px_-8px_rgba(147,51,234,0.34),0_0_18px_-4px_rgba(120,80,220,0.20)]'
                      : ''
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {renderNavIcon(link.icon, link.label)}
                  <span>{link.label}</span>
                </Link>
              ))}

              <Link
                to="/notifications"
                className="flex items-center justify-between gap-2 px-3.5 py-2.5 rounded-[12px] text-sm font-semibold text-gray-700 no-underline transition-all duration-200 hover:text-gray-900 hover:bg-gray-100"
                onClick={() => setMobileOpen(false)}
              >
                <span className="flex items-center gap-2">
                  <span className="inline-flex items-center justify-center w-5 h-5">
                    <img src={NotificationIcon} alt="" className="w-4 h-4 object-contain" />
                  </span>
                  Notifications
                </span>
                {unreadCount > 0 && (
                  <span className="bg-[#c86e6e] text-white text-[0.7rem] font-bold min-w-[18px] h-[18px] rounded-lg flex items-center justify-center px-[5px]">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
              </Link>

              <button
                type="button"
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-[12px] text-sm font-semibold text-red-600 bg-white border border-red-200 cursor-pointer transition-all duration-200 hover:bg-red-50"
                onClick={async () => {
                  setMobileOpen(false);
                  await handleLogout();
                }}
              >
                <span className="inline-flex items-center justify-center w-5 h-5">
                  <LogOut size={16} />
                </span>
                Logout
              </button>
            </div>
          </div>
        </>
      )}

      <main className="flex-1 p-8 max-w-none m-0 w-full bg-gray-50 max-md:p-4">
        {children}
      </main>
    </div>
  );
}
