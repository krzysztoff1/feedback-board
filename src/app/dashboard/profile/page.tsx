import { EditNameForm } from "~/components/dashboard/edit-name-form";
import { getServerAuthSession } from "~/server/auth";

export default async function Profile() {
  const session = await getServerAuthSession();

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">Profile</h1>
      <div className="h-min rounded-lg border p-4">
        <EditNameForm name={session?.user?.name ?? ""} />
      </div>
    </>
  );
}
