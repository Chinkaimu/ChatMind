import { SignUp } from "@clerk/nextjs";

function SignUpPage() {
  return (
    <section className="flex h-full items-center justify-center">
      <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
    </section>
  );
}

export default SignUpPage;
