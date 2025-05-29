export default function Unauthorized() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
      <p className="text-gray-700 mt-2">You do not have permission to view this page.</p>
    </div>
  );
}
