"use client";
import { ChevronLast, ChevronFirst } from "lucide-react";
import React, { useContext, createContext, useState, ReactNode } from "react";
import Image from 'next/image';

// Define the context type
interface SidebarContextType {
  expanded: boolean;
}

// Create the Sidebar Context
const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

// Define the props for Sidebar component
interface SidebarProps {
  children: ReactNode; // Children elements for the sidebar
}

// Sidebar Component
export default function Sidebar({ children }: SidebarProps) {
  const [expanded, setExpanded] = useState<boolean>(true);

  return (
    <aside className="h-full">
      <nav className="flex flex-col h-full bg-white border-r shadow-sm w-max-1/5">
        {/* Logo and Collapse Button */}
        <div className="px-4 h-20 my-0 flex justify-between items-center">
          <Image
            src="/logo.svg"
            width={24} // w-32 is equivalent to 128px
            height={20} // adjust based on your logo's aspect ratio
            className={`overflow-hidden transition-all ${
              expanded ? "w-24" : "w-0"
            }`}
            alt="Logo"
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>

        {/* Provide Context */}
        <SidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 px-3">
            {children}
          </ul>
        </SidebarContext.Provider>
      </nav>
    </aside>
  );
}

// Define the props for SidebarItem
interface SidebarItemProps {
  icon: ReactNode;
  text: string;
  active?: boolean;
  alert?: boolean;
  setSideBarOption: (option: string) => void;
}

// SidebarItem Component
export function SidebarItem({ icon, text, active, alert, setSideBarOption }: SidebarItemProps) {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("SidebarItem must be used within a SidebarContext.Provider");
  }

  const { expanded } = context;

  return (
    <li
      onClick={() => setSideBarOption(text)}
      className={`
        relative flex items-center py-2 px-3 my-1
        font-medium rounded-md cursor-pointer
        transition-colors group
        ${
          active
            ? "bg-gray-200 text-black font-normal"
            : "hover:bg-gray-100 text-gray-500 hover:text-black"
        }
      `}
    >
      {icon}
      <span
        className={`overflow-hidden transition-all ${
          expanded ? "w-44 ml-3" : "w-0"
        }`}
      >
        {text}
      </span>
      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-gray-400 ${
            expanded ? "" : "top-2"
          }`}
        />
      )}

      {!expanded && (
        <div
          className={`
            absolute left-full rounded-md px-2 py-1 ml-6
            bg-gray-100 text-gray-800 text-sm
            invisible opacity-20 -translate-x-3 transition-all
            group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
        >
          {text}
        </div>
      )}
    </li>
  );
}