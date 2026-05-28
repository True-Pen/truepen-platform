import { AuthShell } from "@/components/auth-shell";
import { RegisterForm } from "@/components/register-form";

export default function RegisterPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Start analyzing your academic writing for free"
    >
      <RegisterForm />
    </AuthShell>
  );
}
