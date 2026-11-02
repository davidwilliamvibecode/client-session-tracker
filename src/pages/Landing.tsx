import { motion } from "framer-motion";
import {
  ArrowRight,
  BadgeDollarSign,
  CalendarDays,
  CircleDollarSign,
  Contact,
  LayoutDashboard,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { STATUS_META, formatBRL } from "@/lib/sessions";

const features = [
  {
    icon: Contact,
    title: "Cadastro de clientes",
    text: "Nome, e-mail, WhatsApp e anotações de cada cliente em um só lugar, com busca instantânea.",
  },
  {
    icon: CalendarDays,
    title: "Agenda de sessões",
    text: "Data, hora, local e tipo de ensaio — casamento, aniversário, book — sempre à mão.",
  },
  {
    icon: CircleDollarSign,
    title: "Status em um clique",
    text: "Orçamento, agendada, realizada ou cancelada: o funil da sessão avança sem planilha.",
  },
  {
    icon: BadgeDollarSign,
    title: "Pagamentos por sessão",
    text: "Valor contratado, total já pago e saldo a receber, calculados automaticamente por sessão.",
  },
  {
    icon: LayoutDashboard,
    title: "Resumo do estúdio",
    text: "KPIs do mês, próximas sessões e pendências financeiras em um painel só.",
  },
  {
    icon: Search,
    title: "Busca e filtros",
    text: "Encontre por cliente, tipo de sessão ou status em segundos, do jeito que você pensa.",
  },
];

const workflow = [
  { step: "01", title: "Cadastra o cliente", text: "Contatos e preferências no perfil." },
  { step: "02", title: "Cria a sessão", text: "Tipo, data, local e o valor do pacote." },
  {
    step: "03",
    title: "Registra o valor pago",
    text: "Total recebido e saldo pendente em cada sessão.",
  },
  { step: "04", title: "Atualiza o status", text: "Até marcar como realizada. Simples assim." },
];

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
};

export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <div className="modern-grain">
        {/* Header */}
        <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4 sm:px-6">
            <a href="/" className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                <Sparkles className="size-4" />
              </span>
              <span className="text-[15px] font-semibold tracking-tight">
                Fotoflow
              </span>
            </a>
            <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
              <a href="#recursos" className="transition-colors hover:text-foreground">
                Recursos
              </a>
              <a href="#como-funciona" className="transition-colors hover:text-foreground">
                Como funciona
              </a>
            </nav>
            <div className="flex items-center gap-2">
              <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
                <a href="/auth">Entrar</a>
              </Button>
              <Button asChild size="sm" className="gap-1.5">
                <a href="/auth?returnTo=%2Fdashboard">
                  Começar grátis
                  <ArrowRight className="size-3.5" />
                </a>
              </Button>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-14 sm:px-6 sm:pt-20 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55 }}
            >
              <Badge
                variant="outline"
                className="mb-5 gap-1.5 border-primary/25 bg-accent px-3 py-1 text-accent-foreground"
              >
                <Sparkles className="size-3" />
                Feito para fotógrafos
              </Badge>
              <h1 className="text-balance text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-[3.4rem]">
                Seus clientes e sessões,{" "}
                <span className="text-primary">no controle</span> — sem planilha.
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg">
                O Fotoflow é o painel do fotógrafo organizado: cadastre clientes,
                agende ensaios, acompanhe orçamentos, pagamentos e status de cada
                sessão — tudo em um lugar, do primeiro contato à entrega.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="gap-2 shadow-md shadow-primary/25">
                  <a href="/auth?returnTo=%2Fdashboard">
                    Criar meu painel grátis
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="modern-ring">
                  <a href="#recursos">Ver recursos</a>
                </Button>
              </div>
              <p className="mt-4 text-xs text-muted-foreground">
                Cadastro por convite • Acesso com e-mail e senha
              </p>
            </motion.div>

            {/* Hero mock — painel resumo */}
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="relative"
            >
              <div className="absolute -inset-4 -z-10 rounded-3xl bg-gradient-to-br from-primary/15 via-transparent to-primary/5 blur-2xl" />
              <Card className="modern-ring overflow-hidden border-border/70 bg-card/95">
                <CardContent className="p-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        Resumo do estúdio
                      </p>
                      <p className="mt-0.5 text-lg font-semibold tracking-tight">
                        Outubro 2026
                      </p>
                    </div>
                    <Badge className="gap-1 border-transparent bg-primary/10 text-primary" variant="outline">
                      <TrendingUp className="size-3" />
                      Em dia
                    </Badge>
                  </div>

                  <p className="mb-3 text-xs text-muted-foreground">
                    Prévia ilustrativa do painel
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-3">
                    {[
                      { label: "Clientes", value: "42" },
                      { label: "Sessões", value: "17" },
                      { label: "Faturamento", value: formatBRL(12850) },
                    ].map((kpi) => (
                      <div
                        key={kpi.label}
                        className="rounded-xl border border-border/70 bg-background/60 p-3"
                      >
                        <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                          {kpi.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold tracking-tight sm:text-base">
                          {kpi.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-5 space-y-2.5">
                    {(
                      [
                        { name: "Ana & Rafael", type: "Casamento", status: "agendada" },
                        { name: "Marina Duarte", type: "Book gestante", status: "orcamento" },
                        { name: "Família Costa", type: "Ensaio externo", status: "realizada" },
                      ] as const
                    ).map((row) => (
                      <div
                        key={row.name}
                        className="flex items-center justify-between rounded-xl border border-border/60 bg-background/60 px-3.5 py-2.5"
                      >
                        <div className="flex items-center gap-3">
                          <span className="flex size-8 items-center justify-center rounded-full bg-accent text-[11px] font-semibold text-accent-foreground">
                            {row.name.slice(0, 2).toUpperCase()}
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[13px] font-medium">{row.name}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {row.type}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-medium ${STATUS_META[row.status].badge}`}
                        >
                          <span className={`size-1.5 rounded-full ${STATUS_META[row.status].dot}`} />
                          {STATUS_META[row.status].label}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section id="recursos" className="border-t border-border/70 bg-card/50">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Recursos da v1</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Tudo que a sua planilha faz — só que melhor
              </h2>
              <p className="mt-3 text-base leading-7 text-muted-foreground">
                Controle de clientes e sessões em foco: sem enfeite, sem distração.
              </p>
            </motion.div>

            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  {...fadeUp}
                  transition={{ duration: 0.45, delay: i * 0.05 }}
                >
                  <Card className="group h-full border-border/70 bg-card transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                    <CardContent className="p-5">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-accent text-accent-foreground transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                        <f.icon className="size-5" />
                      </div>
                      <h3 className="mt-4 text-[15px] font-semibold tracking-tight">
                        {f.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                        {f.text}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow */}
        <section id="como-funciona" className="border-t border-border/70">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <motion.div {...fadeUp} transition={{ duration: 0.5 }} className="max-w-2xl">
              <p className="text-sm font-medium text-primary">Como funciona</p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                Do contato ao ensaio em 4 passos
              </h2>
            </motion.div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {workflow.map((w, i) => (
                <motion.div
                  key={w.step}
                  {...fadeUp}
                  transition={{ duration: 0.45, delay: i * 0.06 }}
                  className="rounded-2xl border border-border/70 bg-card p-5"
                >
                  <span className="text-xs font-semibold tracking-widest text-primary">
                    {w.step}
                  </span>
                  <h3 className="mt-3 text-[15px] font-semibold tracking-tight">
                    {w.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-muted-foreground">
                    {w.text}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA final */}
        <section className="border-t border-border/70 bg-card/50">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <motion.div
              {...fadeUp}
              transition={{ duration: 0.5 }}
              className="modern-ring relative overflow-hidden rounded-3xl border border-primary/20 bg-gradient-to-br from-accent via-card to-card p-8 text-center sm:p-12"
            >
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Pronto para trocar a planilha?
              </h2>
              <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-muted-foreground">
                Crie sua conta em segundos e comece a organizar clientes e sessões
                hoje mesmo.
              </p>
              <div className="mt-8 flex justify-center">
                <Button asChild size="lg" className="gap-2 shadow-md shadow-primary/25">
                  <a href="/auth?returnTo=%2Fdashboard">
                    Começar agora — é grátis
                    <ArrowRight className="size-4" />
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border/70">
          <div className="mx-auto flex w-full max-w-6xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-muted-foreground sm:flex-row sm:px-6">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <Sparkles className="size-3" />
              </span>
              <span className="font-medium text-foreground">Fotoflow</span>
            </div>
            <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-5">
              <p>Controle de clientes e sessões para fotógrafos.</p>
              <nav className="flex items-center gap-4">
                <a
                  href="/privacidade"
                  className="transition-colors hover:text-foreground"
                >
                  Privacidade
                </a>
                <a
                  href="/termos"
                  className="transition-colors hover:text-foreground"
                >
                  Termos
                </a>
              </nav>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
