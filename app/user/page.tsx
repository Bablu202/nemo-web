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
    <div className="mt-24 mx-2 md:mx-6 lg:mx-36 bg-custom-pri/5 rounded-md shadow-md">
      <UserForm />
      <WhatsAppButtonContact />
    </div>
  );
}

export default page;
