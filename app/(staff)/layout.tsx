"use client";

import NotificationBell from "@/components/NotificationBell";
import { Calendar } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  FileCheck,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Search,
  Bell,
  UserCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/leads", label: "Leads", icon: Users },
  { href: "/consultations", label: "Consultations", icon: Calendar },
  { href: "/applications", label: "Applications", icon: FileText },
  { href: "/agreements", label: "Agreements", icon: FileCheck },
  { href: "/settings", label: "Staff", icon: Settings }, 
];

const handleLogout = () => {
  // Clear both localStorage and cookie
  localStorage.removeItem("token");
  localStorage.removeItem("staff");
  document.cookie = "token=; path=/; max-age=0"; // Delete cookie
  router.push("/login");
};


export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside
        className={`
          bg-white border-r transition-all duration-300 flex flex-col
          ${collapsed ? "w-16" : "w-64"}
        `}
      >
       {/* Logo - Clickable to go to landing page */}
        <Link href="/" className="flex items-center justify-between p-4 border-b group">
        <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-sm">
            RP
            </div>
            {!collapsed && (
            <span className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">
                Retirees Paradise
            </span>
            )}
        </div>
        
        {/*  FIX: Add onClick handler to stop navigation */}
        <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
            e.preventDefault();      // Prevent the Link from navigating
            e.stopPropagation();      // Stop event from bubbling up
            setCollapsed(!collapsed);
            }}
            className="ml-auto"
        >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
        </Link>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");
            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={`
                    w-full justify-start gap-3
                    ${collapsed ? "px-2 justify-center" : "px-3"}
                  `}
                >
                  <item.icon className="h-5 w-5 shrink-0" />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        {/* Logout - Always visible at bottom */}
        <div className="p-2 border-t mt-auto">
        <Button 
            variant="ghost" 
            onClick={() => {
            localStorage.removeItem("token");
            localStorage.removeItem("staff");
            document.cookie = "token=; path=/; max-age=0";
            window.location.href = "/login";
            }}
            className="w-full justify-start gap-3 text-red-500 hover:text-red-600 hover:bg-red-50"
        >
            <LogOut className="h-5 w-5 shrink-0" />
            <span>Logout</span>
        </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Global search..."
                className="pl-9 bg-gray-50 border-gray-200"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <NotificationBell />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                      JD
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <UserCircle className="h-4 w-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="h-4 w-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-500">
                  <LogOut className="h-4 w-4 mr-2" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}