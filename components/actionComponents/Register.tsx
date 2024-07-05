"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { signUpWithEmailAndPassword } from "@/app/_actions";
import { CreateUserInput, createUserSchema } from "@/lib/user-schema";

export const RegisterForm = () => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const methods = useForm<CreateUserInput>({
    resolver: zodResolver(createUserSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = methods;

  const onSubmitHandler: SubmitHandler<CreateUserInput> = (values) => {
    startTransition(async () => {
      const result = await signUpWithEmailAndPassword({
        data: values,
        emailRedirectTo: `${location.origin}/auth/callback`,
      });
      const { error } = JSON.parse(result);
      if (error?.message) {
        toast.error(error.message);
        console.log("Error message", error.message);
        reset({ password: "" });
        return;
      }

      toast.success("registered successfully");
      router.push("/login");
    });
  };

  const input_style =
    "form-control block w-full px-4 py-2 text-lg font-normal text-color-sec bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-custom-blue focus:outline-none";

  return (
    <form onSubmit={handleSubmit(onSubmitHandler)}>
      <div className="mb-6">
        <input
          {...register("name")}
          placeholder="Name"
          className={`${input_style}`}
        />
        {errors["name"] && (
          <span className="text-color-red text-xs pt-1 block">
            {errors["name"]?.message as string}
          </span>
        )}
      </div>
      <div className="mb-6">
        <input
          type="email"
          {...register("email")}
          placeholder="Email address"
          className={`${input_style}`}
        />
        {errors["email"] && (
          <span className="text-color-red text-xs pt-1 block">
            {errors["email"]?.message as string}
          </span>
        )}
      </div>
      <div className="mb-6">
        <input
          type="password"
          {...register("password")}
          placeholder="Password"
          className={`${input_style}`}
        />
        {errors["password"] && (
          <span className="text-color-red text-xs pt-1 block">
            {errors["password"]?.message as string}
          </span>
        )}
      </div>
      <div className="mb-6">
        <input
          type="password"
          {...register("passwordConfirm")}
          placeholder="Confirm Password"
          className={`${input_style}`}
        />
        {errors["passwordConfirm"] && (
          <span className="text-color-red text-xs pt-1 block">
            {errors["passwordConfirm"]?.message as string}
          </span>
        )}
      </div>
      <button
        type="submit"
        style={{ backgroundColor: `${isPending ? "#0D0D0D" : "#24386E"}` }}
        className="  px-7 py-2 bg-custom-pri text-white  text leading-snug text-xl  lg:text-2xl font-normal   
        uppercase rounded shadow-md  hover:shadow-lg  focus:shadow-lg focus:outline-none focus:ring-0  active:shadow-lg transition duration-150 ease-in-out w-full"
        disabled={isPending}
      >
        {isPending ? "loading..." : "Sign Up"}
      </button>
    </form>
  );
};
