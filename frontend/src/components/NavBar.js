import React, { useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  ArrowPathIcon,
  Bars3Icon,
  Cog6ToothIcon,
  HomeIcon,
  ShieldCheckIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, NavLink, useLocation } from "react-router-dom";
import api from "../services/api";

const apiBaseUrl = process.env.REACT_APP_URL_LOCAL;
const appVersion = process.env.REACT_APP_VER || "0.0.0";
const defaultImage = "https://via.placeholder.com/150?text=Profile";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function getUserImageSrc(user) {
  if (!user?.CheminImage) return defaultImage;
  if (user.CheminImage.startsWith("http")) return user.CheminImage;
  if (user.CheminImage.startsWith("/uploads/")) return `${apiBaseUrl}${user.CheminImage}`;
  return user.CheminImage;
}

function DoCodeLogo() {
  return (
    <Link to="/administration" className="flex items-center gap-3" aria-label="DoCode admin">
      <span className="grid size-9 place-items-center rounded-lg border border-sky-400/40 bg-sky-500/15 text-sm font-black text-sky-100">
        DC
      </span>
      <span className="text-[15px] font-black uppercase tracking-[0.12em] text-white">DoCode</span>
    </Link>
  );
}

function NavItem({ item, closeMenu }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.href}
      onClick={closeMenu}
      className={({ isActive }) => classNames(
        "group flex h-12 items-center gap-3 rounded-xl border px-4 text-sm font-semibold transition duration-200",
        isActive
          ? "border-sky-400/45 bg-sky-500/15 text-white shadow-lg shadow-sky-950/40"
          : "border-transparent text-slate-300 hover:border-sky-400/30 hover:bg-sky-500/10 hover:text-white"
      )}
    >
      <Icon className="size-5 shrink-0" aria-hidden="true" />
      <span className="truncate">{item.name}</span>
    </NavLink>
  );
}

function SidebarContent({ user, closeMenu }) {
  const navItems = [
    { name: "Administration", href: "/administration", icon: ShieldCheckIcon },
    { name: "Paramètres", href: "/settings", icon: Cog6ToothIcon },
    { name: "Mises à jour", href: "/updates", icon: ArrowPathIcon },
    { name: "Site public", href: "/", icon: HomeIcon },
  ];

  return (
    <div className="flex h-full flex-col border-r border-sky-500/20 bg-slate-950/95 text-slate-100 shadow-2xl shadow-sky-950/40 backdrop-blur-xl">
      <div className="flex h-24 items-center px-6">
        <DoCodeLogo />
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => (
          <NavItem key={item.name} item={item} closeMenu={closeMenu} />
        ))}
      </nav>

      <div className="space-y-3 px-4 pb-6">
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-3">
          <img
            src={getUserImageSrc(user)}
            alt=""
            className="size-9 rounded-full object-cover ring-1 ring-sky-400/30"
          />
          <div className="min-w-0">
            <p className="truncate text-sm font-bold text-white">{user?.Surnom || "Administrateur"}</p>
            <p className="truncate text-xs text-slate-500">v{appVersion}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await api.get("/users/me");
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  const pageLabel = React.useMemo(() => {
    if (location.pathname === "/administration") return "Administration";
    if (location.pathname === "/settings") return "Paramètres";
    if (location.pathname === "/updates") return "Mises à jour";
    return "DoCode";
  }, [location.pathname]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarContent user={user} />
      </aside>

      <Transition show={mobileMenuOpen} as={React.Fragment}>
        <Dialog className="relative z-50 lg:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child
            as={React.Fragment}
            enter="transition-opacity ease-linear duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-linear duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-slate-950/70" />
          </Transition.Child>
          <div className="fixed inset-0 flex">
            <Transition.Child
              as={React.Fragment}
              enter="transition ease-in-out duration-200 transform"
              enterFrom="-translate-x-full"
              enterTo="translate-x-0"
              leave="transition ease-in-out duration-200 transform"
              leaveFrom="translate-x-0"
              leaveTo="-translate-x-full"
            >
              <Dialog.Panel className="relative w-80 max-w-[88vw]">
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  className="absolute right-3 top-3 z-10 rounded-lg p-2 text-slate-300 hover:bg-white/10 hover:text-white"
                >
                  <span className="sr-only">Fermer le menu</span>
                  <XMarkIcon className="size-6" aria-hidden="true" />
                </button>
                <SidebarContent user={user} closeMenu={() => setMobileMenuOpen(false)} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <header className="sticky top-0 z-30 border-b border-sky-500/10 bg-slate-950/80 backdrop-blur-xl lg:pl-64">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex min-w-0 items-center gap-4">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="rounded-xl border border-sky-500/20 bg-slate-900/70 p-2 text-slate-200 transition hover:border-sky-400/45 hover:bg-sky-500/10 lg:hidden"
            >
              <span className="sr-only">Ouvrir le menu</span>
              <Bars3Icon className="size-6" aria-hidden="true" />
            </button>
            <div className="min-w-0">
              <h1 className="truncate text-2xl font-black text-white">{pageLabel}</h1>
              <p className="mt-1 truncate text-sm font-medium text-slate-400">Espace administrateur DoCode.</p>
            </div>
          </div>

          <Menu as="div" className="relative">
            <Menu.Button className="flex items-center gap-3 rounded-xl border border-sky-500/20 bg-slate-900/70 p-1.5 pr-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400/45 hover:bg-sky-500/10 hover:text-white">
              <img
                src={getUserImageSrc(user)}
                alt=""
                className="size-8 rounded-full object-cover"
              />
              <span className="hidden max-w-28 truncate sm:block">{user?.Surnom || "Profil"}</span>
              <UsersIcon className="hidden size-4 sm:block" aria-hidden="true" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-52 overflow-hidden rounded-xl border border-sky-500/20 bg-slate-950 text-sm shadow-2xl shadow-sky-950/50 focus:outline-none">
              {[
                { name: "Paramètres", href: "/settings" },
                { name: "Administration", href: "/administration" },
              ].map((item) => (
                <Menu.Item key={item.name}>
                  {({ active }) => (
                    <Link
                      to={item.href}
                      className={classNames(
                        "block px-4 py-3 font-semibold text-slate-200",
                        active && "bg-sky-500/10 text-white"
                      )}
                    >
                      {item.name}
                    </Link>
                  )}
                </Menu.Item>
              ))}
              <Menu.Item>
                {({ active }) => (
                  <button
                    type="button"
                    onClick={() => {
                      localStorage.removeItem("token");
                      window.location.href = "/login";
                    }}
                    className={classNames(
                      "block w-full px-4 py-3 text-left font-semibold text-slate-200",
                      active && "bg-sky-500/10 text-white"
                    )}
                  >
                    Se déconnecter
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </header>
    </>
  );
}
