import ProfileForm from "./_components/ProfileForm";

export default function ProfilePage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-8">Profile Settings</h1>
      
      {/* We just import the form here */}
      <ProfileForm />
    </div>
  );
}