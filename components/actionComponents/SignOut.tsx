import getUserSession from "@/lib/getUserSession";
import createSupabaseServerClient from "@/lib/supabase/server";
import Link from "next/link";

const SignOutButton = async () => {
  const { data } = await getUserSession();

  const logoutAction = async () => {
    "use server";
    const supabase = await createSupabaseServerClient();
    await supabase.auth.signOut();
  };
  const info = () => {
    console.log(data);
  };
  return (
    <nav className=" flex justify-between container items-center">
      <ul className="flex items-center space-x-4">
        {data.session && (
          <>
            <form action={logoutAction} className="flex">
              <button
                className="ml-4 bg-white border rounded-sm shadow-sm px-4 py-1 mb-6 text-lg lg:text-xl font-normal uppercase 
              hover:bg-custom-pri hover:text-white"
              >
                Logout
              </button>
            </form>
          </>
        )}
      </ul>
    </nav>
  );
};

export default SignOutButton;
