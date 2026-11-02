# Fotoflow — MVP de gestão para fotógrafos

Clientes, sessões, preços, pagamentos, saldo a receber e resumo financeiro;
exportações CSV em português (Excel). React/Vite + Convex + Convex Auth.

## O que o MVP oferece
- Cadastro aberto e login com e-mail e senha de no mínimo 8 caracteres.
- Acesso individual: um fotógrafo por conta. O backend filtra clientes e sessões
  por usuário autenticado. Os registros persistem no Convex.
- Clientes e sessões: criação, edição e exclusão. CSV exportável.
- Registro da data/versão do aceite de termos no cadastro.
- Google Calendar é opcional, **oculto por padrão** no MVP.
- Sem Freebuff, convidados, cobrança automática, recuperação de senha ou múltiplas
  contas de funcionários. Venda e suporte gerenciados fora do aplicativo.

## Publicação única — main → Cloudflare Pages + Convex

1. Crie ou escolha **um único deployment Convex próprio do Fotoflow**.
   Configure auth conforme a documentação do Convex Auth: `JWT_PRIVATE_KEY`,
   `JWKS`, `SITE_URL`, `CONVEX_SITE_URL`. Não reutilize o Barber OS.
2. Publique as funções com `bunx convex deploy`. Se adicionar o segredo
   `CONVEX_DEPLOY_KEY` no GitHub Actions, cada push validado na main também
   publicará as funções no Convex.
3. Cloudflare Pages → Conectar GitHub → este repositório, branch **main**,
   framework **Vite**, comando `bun install --frozen-lockfile && bun run build`,
   saída `dist`. Adicione `VITE_CONVEX_URL` com a URL do seu Convex
   `https://...convex.cloud`; `VITE_ENABLE_GOOGLE_CALENDAR=false`.
4. Defina `SITE_URL` no Convex para o endereço `https://...pages.dev`
   **realmente gerado pelo Pages**.
5. Teste cadastro, login, persistência após recarregar, clientes,
   sessões, exportações e acesso cruzado entre dois usuários.

Não há credenciais de backend/hospedagem no repositório. Um CI verde não
significa que um ambiente público esteja publicado ou testado.

## Comandos

```bash
bun install --frozen-lockfile
bun run lint
bun run test
bun run build
bun audit
```

A pasta `src/convex/_generated` é versionada para permitir CI sem deploy key.
Após alterar funções/schema, rode `bunx convex codegen` com o deployment
correto antes de publicar.

Veja [docs/OPERATIONS.md](docs/OPERATIONS.md) para backup, recuperação,
segurança, checklist de venda e limitações.
