import { SignIn } from "@clerk/nextjs";

function SignInPage() {
  return (
    <section className="flex h-full items-center justify-center">
      <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
    </section>
  );
}

export default SignInPage;
