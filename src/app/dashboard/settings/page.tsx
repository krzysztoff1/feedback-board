import { EditNameForm } from "~/app/_components/dashboard/edit-name-form";
import { getServerAuthSession } from "~/server/auth";

export default async function Settings() {
  const session = await getServerAuthSession();

  return (
    <>
      <h1 className="mb-8 text-2xl font-bold">Settings</h1>
      <div className="rounded-lg border p-4">
        <EditNameForm name={session?.user?.name ?? ""} />
      </div>
    </>
  );
}
