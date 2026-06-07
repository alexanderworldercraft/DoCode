import React, { useEffect, useState } from "react";
import { Dialog, Menu, Transition } from "@headlessui/react";
import {
  Bars3Icon,
  Cog6ToothIcon,
  ChevronDownIcon,
  DocumentTextIcon,
  HomeIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  ShieldCheckIcon,
  SunIcon,
  UsersIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { Link, NavLink, useLocation } from "react-router-dom";
import api from "../services/api";
import { useTheme } from "../theme";

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
    <Link to="/" className="flex items-center gap-3" aria-label="DoCode">
      <span className="grid size-9 place-items-center rounded-lg border border-sky-400/40 bg-sky-500/15 text-sm font-black text-sky-100">
        DC
      </span>
      <span className="theme-text text-[15px] font-black uppercase tracking-[0.12em]">DoCode</span>
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

function ThemeDropdown({ theme, closeMenu }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border border-transparent px-4 text-sm font-semibold text-slate-300 transition hover:border-sky-400/30 hover:bg-sky-500/10 hover:text-white"
      >
        <span className="truncate">{theme.Nom}</span>
        <ChevronDownIcon className={`h-4 w-4 shrink-0 transition ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>
      {isOpen && (
        <div className="space-y-1 pl-3">
          {theme.Pages.map((page) => (
            <NavLink
              key={page.PageID}
              to={`/p/${page.Slug}`}
              onClick={closeMenu}
              className={({ isActive }) => classNames(
                "group flex min-h-10 items-center gap-3 rounded-lg border px-3 py-2 text-sm font-medium transition duration-200",
                isActive
                  ? "border-sky-400/45 bg-sky-500/15 text-white"
                  : "border-transparent text-slate-400 hover:border-sky-400/30 hover:bg-sky-500/10 hover:text-white"
              )}
            >
              <DocumentTextIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{page.Titre}</span>
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

function SidebarContent({ user, publicLinks, closeMenu }) {
  const publicPayload = publicLinks || {};
  const themes = publicPayload.themes || [];
  const ungroupedPages = publicPayload.ungroupedPages || [];
  const navItems = [
    { name: "Accueil", href: "/", icon: HomeIcon },
    ...ungroupedPages.map((page) => ({
      name: page.Titre,
      href: `/p/${page.Slug}`,
      icon: DocumentTextIcon,
    })),
    ...(user
      ? [
          { name: "Administration", href: "/administration", icon: ShieldCheckIcon },
          { name: "Paramètres", href: "/settings", icon: Cog6ToothIcon },
        ]
      : []),
  ];

  return (
    <div className="theme-surface-strong flex h-full flex-col border-r text-slate-100 shadow-2xl shadow-sky-950/40 backdrop-blur-xl">
      <div className="flex h-24 items-center px-6">
        <DoCodeLogo />
      </div>

      <nav className="flex-1 space-y-2 px-4">
        {navItems.map((item) => (
          <NavItem key={item.name} item={item} closeMenu={closeMenu} />
        ))}
        {themes.map((theme) => (
          <ThemeDropdown key={theme.ThemeID} theme={theme} closeMenu={closeMenu} />
        ))}
      </nav>

      <div className="space-y-3 px-4 pb-6">
        {user ? (
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-slate-900/50 p-3">
            <img
              src={getUserImageSrc(user)}
              alt=""
              className="size-9 rounded-full object-cover ring-1 ring-sky-400/30"
            />
            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-white">{user.Surnom || "Administrateur"}</p>
              <p className="truncate text-xs text-slate-500">v{appVersion}</p>
            </div>
          </div>
        ) : (
          <Link
            to="/updates"
            onClick={closeMenu}
            className="block rounded-xl border border-white/10 bg-slate-900/50 p-3 text-xs leading-5 text-slate-400 transition hover:border-sky-400/35 hover:bg-sky-500/10 hover:text-slate-200"
          >
            Contenu public DoCode · v{appVersion}
          </Link>
        )}
      </div>
    </div>
  );
}

function HeaderSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    const timeoutId = window.setTimeout(async () => {
      setIsLoading(true);
      try {
        const response = await api.get("/pages/search", { params: { q: trimmedQuery } });
        setResults(response.data);
      } catch (error) {
        console.error("Failed to search pages:", error);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    }, 220);

    return () => window.clearTimeout(timeoutId);
  }, [query]);

  const showPreview = isFocused && query.trim().length >= 2;

  return (
    <div className="relative hidden min-w-[18rem] max-w-md flex-1 md:block">
      <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-500" />
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => window.setTimeout(() => setIsFocused(false), 140)}
        placeholder="Rechercher une page ou section..."
        className="theme-input h-11 w-full rounded-xl border pl-10 pr-4 text-sm font-medium outline-none transition focus:border-sky-400/50"
      />

      {showPreview && (
        <div className="absolute right-0 top-12 z-50 w-full overflow-hidden rounded-xl border border-sky-500/20 bg-slate-950 text-sm shadow-2xl shadow-sky-950/50">
          <div className="border-b border-white/10 px-4 py-3 text-xs font-semibold uppercase text-slate-500">
            Prévisualisation
          </div>
          {isLoading && <div className="px-4 py-3 text-slate-400">Recherche...</div>}
          {!isLoading && results.length === 0 && (
            <div className="px-4 py-3 text-slate-400">Aucun résultat.</div>
          )}
          {!isLoading && results.map((page) => (
            <div key={page.PageID} className="border-b border-white/5 last:border-b-0">
              <Link
                to={`/p/${page.Slug}`}
                onClick={() => {
                  setQuery("");
                  setIsFocused(false);
                }}
                className="block px-4 py-3 transition hover:bg-sky-500/10"
              >
                <span className="block font-semibold text-white">{page.Titre}</span>
                {page.Description && <span className="mt-1 block line-clamp-2 text-xs leading-5 text-slate-400">{page.Description}</span>}
              </Link>
              {page.Sections?.length > 0 && (
                <div className="space-y-1 px-4 pb-3">
                  {page.Sections.map((section) => (
                    <Link
                      key={section.SectionID}
                      to={`/p/${page.Slug}#section-${section.SectionID}`}
                      onClick={() => {
                        setQuery("");
                        setIsFocused(false);
                      }}
                      className="block rounded-md border border-sky-500/15 bg-sky-500/5 px-3 py-2 text-xs font-semibold text-sky-200 transition hover:border-sky-400/35 hover:bg-sky-500/10"
                    >
                      Section: {section.Titre}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isLight = theme === "light";
  const Icon = isLight ? MoonIcon : SunIcon;

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="theme-input inline-flex h-11 items-center gap-2 rounded-xl border px-3 text-sm font-semibold transition hover:border-sky-400/45 hover:bg-sky-500/10"
      aria-label={isLight ? "Activer le thème sombre" : "Activer le thème clair"}
      title={isLight ? "Thème sombre" : "Thème clair"}
    >
      <Icon className="size-5" aria-hidden="true" />
      <span className="hidden sm:inline">{isLight ? "Sombre" : "Clair"}</span>
    </button>
  );
}

export default function Navbar() {
  const [user, setUser] = useState(null);
  const [publicLinks, setPublicLinks] = useState([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!localStorage.getItem("token")) return;
      try {
        const response = await api.get("/users/me");
        setUser(response.data);
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchPublicLinks = async () => {
      try {
        const response = await api.get("/pages/public-links");
        setPublicLinks(response.data);
      } catch (err) {
        console.error("Failed to fetch public links:", err);
      }
    };

    fetchPublicLinks();
  }, []);

  const pageLabel = React.useMemo(() => {
    if (location.pathname === "/") return "Accueil";
    if (location.pathname === "/administration") return "Administration";
    if (location.pathname === "/settings") return "Paramètres";
    if (location.pathname === "/updates") return "Mises à jour";
    const allPublicPages = [
      ...(publicLinks?.ungroupedPages || []),
      ...(publicLinks?.themes || []).flatMap((theme) => theme.Pages || []),
    ];
    const publicPage = allPublicPages.find((page) => location.pathname === `/p/${page.Slug}`);
    if (publicPage) return publicPage.Titre;
    return "DoCode";
  }, [location.pathname, publicLinks]);

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 lg:block">
        <SidebarContent user={user} publicLinks={publicLinks} />
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
                <SidebarContent user={user} publicLinks={publicLinks} closeMenu={() => setMobileMenuOpen(false)} />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>

      <header className="theme-surface sticky top-0 z-30 border-b backdrop-blur-xl lg:pl-64">
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
              <h1 className="theme-text truncate text-2xl font-black">{pageLabel}</h1>
              <p className="theme-subtle mt-1 truncate text-sm font-medium">
                {user ? "Espace administrateur DoCode." : "Contenu public DoCode."}
              </p>
            </div>
          </div>

          <HeaderSearch />

          <ThemeToggle />

          {user ? (
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center gap-3 rounded-xl border border-sky-500/20 bg-slate-900/70 p-1.5 pr-3 text-sm font-semibold text-slate-200 transition hover:border-sky-400/45 hover:bg-sky-500/10 hover:text-white">
                <img
                  src={getUserImageSrc(user)}
                  alt=""
                  className="size-8 rounded-full object-cover"
                />
                <span className="hidden max-w-28 truncate sm:block">{user.Surnom || "Profil"}</span>
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
                        window.location.href = "/";
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
          ) : (
            <Link
              to="/login"
              className="rounded-xl border border-sky-500/20 bg-slate-900/70 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-sky-400/45 hover:bg-sky-500/10 hover:text-white"
            >
              Connexion
            </Link>
          )}
        </div>
      </header>
    </>
  );
}
