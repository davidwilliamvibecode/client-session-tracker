# Fotoflow — Operações e Segurança do MVP

## Um único ambiente

- GitHub `main` → Cloudflare Pages, URL pública fornecida pela Cloudflare
  no formato `https://<projeto>.pages.dev`.
- Backend/banco: um deployment Convex independente do Barber OS.
- Pages: `VITE_CONVEX_URL` (público), `VITE_ENABLE_GOOGLE_CALENDAR=false`.
- Convex (privado): `JWT_PRIVATE_KEY`, `JWKS`, `SITE_URL`,
  `CONVEX_SITE_URL`.
- Opcional: segredo GitHub Actions `CONVEX_DEPLOY_KEY` para publicar as
  funções automaticamente. Nunca usar segredos em variáveis `VITE_*`.

O cadastro é aberto, com e-mail e senha de 8 a 128 caracteres.
A confirmação utiliza código de 8 dígitos, válido por 15 minutos, entregue
pelo operador em canal privado após confirmar a identidade por contato independente.
No Dashboard Convex, Functions → `manualVerification:pending` (interna),
informe o e-mail do solicitante. Nunca publique códigos ou execute essa consulta
em um cliente público. O Convex Auth valida expiração e uso único; novos códigos
substituem os anteriores. Não há envio automático de e-mail nem serviço externo.
Senhas são processadas pelo Convex Auth.
Não há recuperação automática de senha nem envio automático de e-mails na versão
MVP; não prometer essas funções ao primeiro cliente.

## Privacidade, autorização e segurança

Os dados de clientes e sessões residem no Convex (não em cache/localStorage)
e são consultados/alterados com verificação de `getAuthUserId` e `userId`.
Apenas esconder a rota no React **não** é segurança suficiente.
O aceite de termos de novos cadastros registra `termsAcceptedAt` e
`termsVersion`; documentos legais ainda precisam de dados corretos
do fornecedor e revisão antes de contratar clientes reais.

A chave `.env.keys` foi removida do commit atual em 2026-10-30,
**mas permanece no histórico público do GitHub**. Rotacione qualquer chave
válida que tenha sido exposta e examine o histórico; a exclusão do arquivo
não revoga nem elimina dados históricos.

CI: instalação congelada, ESLint, testes, build, `bun audit`. Validar
login, isolamento de dados entre usuários, conteúdo legal e mobile
no endereço público após publicar. CSP e headers no `public/_headers`.

## Backup, exportação e restauração

CSV de clientes e sessões é exportado pelo próprio painel, compatível com
Excel. Não é um backup restaurável do banco. Para snapshot completo:

```bash
mkdir -p backups
bunx convex export --prod --include-file-storage --path backups/fotoflow.zip
```

Guarde o ZIP em armazenamento externo seguro e verifique periodicamente.
Restaurar com `--replace-all` é destrutivo; só executar com confirmação,
cópia atual e escolha do deployment correto:

```bash
bunx convex import --prod --replace-all backups/fotoflow.zip
```

## Integração opcional Google Calendar

Por padrão, não aparece no MVP. Para habilitar no futuro, configurar
`GOOGLE_CLIENT_ID` e `GOOGLE_CLIENT_SECRET` no Convex e
`VITE_ENABLE_GOOGLE_CALENDAR=true` no Pages.
Ao excluir dados enquanto Google está desconectado, eventos externos podem
precisar de limpeza manual; o painel emite aviso.

## Primeiro cliente — teste necessário

- Cadastro com e-mail, senha e checkbox dos termos; sem aceite falha.
- Login correto/errado, logout, reload e retorno à tela protegida.
- Criar, editar e excluir um cliente e uma sessão; valores e resumo coerentes.
- Exportar clientes/sessões em CSV e abrir no Excel pt-BR.
- Confirmar isolamento entre dois usuários, inclusive tentativa de alteração
  por ID alheio e leitura após logout.
- Validar restauração/backup e dados do fornecedor nos textos legais.
- Só depois iniciar uso real. Assinatura e cobrança fora do aplicativo.

## Migração de contas antigas

Se este projeto tiver usuários/dados pré-existentes do login Freebuff/OTP,
não presuma que a nova conta por senha herdará o mesmo `userId`. Antes de
atender um cliente existente, inventarie os registros e migre a titularidade
com backup e procedimento autorizado. Uma nova conta isolada não visualiza
automaticamente os registros associados a outro usuário.
