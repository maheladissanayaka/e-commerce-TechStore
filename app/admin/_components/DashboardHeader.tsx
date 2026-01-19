"use client";

interface DashboardHeaderProps {
  title: string;
}

export default function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          {title}
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back to your store admin.
        </p>
      </div>
      
      {/* Placeholder for future features like "Profile" or "Logout" button */}
      <div className="hidden md:block">
        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
          A
        </div>
      </div>
    </div>
  );
}