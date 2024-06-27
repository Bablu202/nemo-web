import UserForm from "@/components/UserForm";
import WhatsAppButtonContact from "@/components/actionComponents/WhatsAppContact";
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
      <WhatsAppButtonContact />
    </div>
  );
}

export default page;
