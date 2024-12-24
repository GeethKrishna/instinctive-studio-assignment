"use client";
import Sidebar, { SidebarItem } from "@/components/SideBar";
import { Bolt, BookMarked, ChartPie, CircleGauge, CircleHelp, Users } from "lucide-react";
import { useState, useEffect } from "react";
import useUserStore from "@/stores/UserStore";
import { useParams } from "next/navigation";
import Loader from "@/components/Loader";
import DashboardPage from "@/components/pages/Dashboard/DashboardPage";
import StudentsPage from "@/components/pages/Students/StudentsPage";
import ChapterPage from "@/components/pages/Chapter/ChapterPage";
import HelpPage from "@/components/pages/Help/HelpPage";
import ReportsPage from "@/components/pages/Reports/ReportsPage";
import SettingsPage from "@/components/pages/Settings/SettingsPage";

export default function Home() {
    const {userID} = useParams();
    const { isLoading, fetchUser } = useUserStore();
    const [sideBarOption, setSideBarOption] = useState<string>("Students");

    useEffect(() => {
      fetchUser(userID)
    }, [userID, fetchUser])

    if (isLoading) {
      return <Loader/>;
    }
    
    return (
        <div className="w-full flex flex-row h-screen">
            <div className="w-auto">
                <Sidebar>
                    <SidebarItem icon={<CircleGauge size={20}/>} text="Dashboard" active={sideBarOption === "Dashboard"} setSideBarOption={setSideBarOption} />
                    <SidebarItem icon={<Users size={20}/>} text="Students" active={sideBarOption === "Students"} setSideBarOption={setSideBarOption} />
                    <SidebarItem icon={<BookMarked size={20}/>} text="Chapter" active={sideBarOption === "Chapter"} setSideBarOption={setSideBarOption} />
                    <SidebarItem icon={<CircleHelp size={20}/>} text="Help" active={sideBarOption === "Help"} setSideBarOption={setSideBarOption} />
                    <SidebarItem icon={<ChartPie size={20}/>} text="Reports" active={sideBarOption === "Reports"} setSideBarOption={setSideBarOption} />
                    <SidebarItem icon={<Bolt size={20}/>} text="Settings" active={sideBarOption === "Settings"} setSideBarOption={setSideBarOption} />
                </Sidebar>
            </div>
            <div className="w-full">
                {sideBarOption === "Dashboard" && <DashboardPage />}
                {sideBarOption === "Students" && <StudentsPage />}
                {sideBarOption === "Chapter" && <ChapterPage />}
                {sideBarOption === "Help" && <HelpPage />}
                {sideBarOption === "Reports" && <ReportsPage />}
                {sideBarOption === "Settings" && <SettingsPage />}
            </div>
        </div>
    );
}
