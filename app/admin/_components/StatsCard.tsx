interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode; // Optional icon
}

export default function StatsCard({ title, value }: StatsCardProps) {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-3xl font-bold mt-2 text-gray-800">{value}</p>
    </div>
  );
}