"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { name: "Dashboard", path: "/dashboard" },
  { name: "Bazaar", path: "/dashboard/bazaar" },
  { name: "Playground", path: "/playground" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">Micropay</div>
        <span className="devnet-badge">DEVNET</span>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`nav-item ${isActive ? "nav-item-active" : ""}`}
            >
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        v1.0.0 · Solana Devnet
      </div>
    </div>
  );
}
