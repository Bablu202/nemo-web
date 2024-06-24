import UserForm from "@/components/UserForm";
import getUserSession from "@/lib/getUserSession";
import { redirect } from "next/navigation";

async function page() {
  const {
    data: { session },
  } = await getUserSession();

  if (session) {
    return redirect("/profile");
  }
  return (
    <div className=" bg-gray-100">
      <UserForm />
    </div>
  );
}

export default page;
