import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera, Loader2 } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";

const SAFE_RETURN_TO = /^\/(?!\/)[^\s\\]*$/;

function Auth({ redirectAfterAuth = "/dashboard" }: { redirectAfterAuth?: string }) {
  const { isLoading: authLoading, isAuthenticated, signIn } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const returnTo = searchParams.get("returnTo");
  const redirect = returnTo && SAFE_RETURN_TO.test(returnTo) ? returnTo : redirectAfterAuth;
  const [mode, setMode] = useState<"signIn" | "signUp" | "verify">("signIn");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [verificationEmail, setVerificationEmail] = useState("");
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!authLoading && isAuthenticated) navigate(redirect, { replace: true });
  }, [authLoading, isAuthenticated, redirect, navigate]);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (working) return;
    setError("");
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "").trim().toLowerCase();
    const password = String(form.get("password") ?? "");
    if (mode === "signUp" && !accepted) {
      setError("Leia e aceite os Termos e a Política de Privacidade.");
      return;
    }
    if (mode === "signUp" && password.length < 8) {
      setError("A senha precisa ter pelo menos 8 caracteres.");
      return;
    }
    setWorking(true);
    try {
      const result = await signIn("password", {
        email, password, flow: mode,
        ...(mode === "signUp" ? { acceptedTerms: "true" } : {}),
      });
      if (result.signingIn) navigate(redirect, { replace: true });
      else { setVerificationEmail(email); setMode("verify"); }
    } catch {
      // Do not reveal whether an email is registered.
      setError(mode === "signIn"
        ? "Não foi possível entrar. Confira seus dados."
        : "Cadastro não concluído. Verifique e-mail e senha.");
    } finally {
      setWorking(false);
    }
  }

  async function verify(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (working) return;
    setWorking(true); setError("");
    const code = String(new FormData(event.currentTarget).get("code") ?? "");
    try {
      const result = await signIn("password", { email: verificationEmail, code, flow: "email-verification" });
      if (!result.signingIn) throw new Error("Código inválido.");
      navigate(redirect, { replace: true });
    } catch { setError("Código inválido ou expirado. Confira com o responsável pelo atendimento."); }
    finally { setWorking(false); }
  }

  return (
    <main className="modern-grain flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-sm">
        <Link to="/" className="mb-6 flex items-center justify-center gap-2 font-semibold">
          <Camera className="size-6 text-primary" /> Fotoflow
        </Link>
        <Card className="border-border/70">
          <CardHeader>
            <CardTitle>{mode === "verify" ? "Confirme seu cadastro" : mode === "signIn" ? "Entrar na conta" : "Criar conta"}</CardTitle>
            <CardDescription>Gestão de clientes e sessões de fotografia</CardDescription>
          </CardHeader>
          <CardContent>
            {mode === "verify" ? <form onSubmit={verify} className="space-y-4">
              <p className="text-sm">Solicite ao responsável pelo FotoFlow o código de confirmação para {verificationEmail}, pelo canal de atendimento combinado. O código vale por 15 minutos.</p>
              <label className="block space-y-1 text-sm">
                <span>Código de confirmação</span>
                <Input name="code" type="text" inputMode="numeric" pattern="[0-9]{8}" minLength={8} maxLength={8} autoComplete="one-time-code" required disabled={working} />
              </label>
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={working}>Confirmar código</Button>
              <button type="button" className="w-full text-sm text-primary" disabled={working} onClick={() => { setMode("signIn"); setError(""); }}>Voltar ao login</button>
            </form> : <form onSubmit={submit} className="space-y-4">
              <label className="block space-y-1 text-sm">
                <span>E-mail</span>
                <Input name="email" type="email" autoComplete="email" maxLength={254} required disabled={working} />
              </label>
              <label className="block space-y-1 text-sm">
                <span>Senha</span>
                <Input name="password" type="password"
                  autoComplete={mode === "signUp" ? "new-password" : "current-password"}
                  minLength={mode === "signUp" ? 8 : undefined} maxLength={128}
                  required disabled={working} />
              </label>
              {mode === "signUp" && (
                <>
                  <p className="text-xs text-muted-foreground">Use uma senha única com 8 caracteres ou mais.</p>
                  <label className="flex items-start gap-2 text-xs leading-5">
                    <input type="checkbox" checked={accepted} onChange={(e) => setAccepted(e.target.checked)}
                      className="mt-1" disabled={working} />
                    <span>Li e aceito os <Link to="/termos" target="_blank" className="underline">Termos de Uso</Link>
                      {" "}e a <Link to="/privacidade" target="_blank" className="underline">Política de Privacidade</Link>.</span>
                  </label>
                </>
              )}
              {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
              <Button type="submit" className="w-full"
                disabled={working || authLoading || (mode === "signUp" && !accepted)}>
                {working && <Loader2 className="mr-2 size-4 animate-spin" />}
                {mode === "signIn" ? "Entrar" : "Criar conta"}
              </Button>
              <button type="button" className="w-full text-center text-sm text-primary underline-offset-4 hover:underline"
                disabled={working} onClick={() => { setMode(mode === "signIn" ? "signUp" : "signIn"); setError(""); }}>
                {mode === "signIn" ? "Primeiro acesso? Criar conta" : "Já tenho conta"}
              </button>
            </form>}
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-xs text-muted-foreground">
          A recuperação automática de senha não está disponível nesta versão.
          Guarde sua senha em um gerenciador seguro.
        </p>
      </div>
    </main>
  );
}
export default function AuthPage(props: { redirectAfterAuth?: string }) {
  return <Suspense><Auth {...props} /></Suspense>;
}
