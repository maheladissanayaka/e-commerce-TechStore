import Image from "next/image";

export default function ProfileAvatar({ image }: { image: string }) {
  return (
    <div className="flex justify-center mb-6">
      <div className="relative w-24 h-24 rounded-full overflow-hidden border bg-gray-100">
        {image ? (
          <Image 
            src={image} 
            alt="Profile" 
            fill 
            className="object-cover" 
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-2xl text-gray-400">
            👤
          </div>
        )}
      </div>
    </div>
  );
}