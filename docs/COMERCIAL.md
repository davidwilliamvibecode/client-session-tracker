# Fotoflow — pacote comercial do primeiro cliente

## Oferta inicial única

**Fotoflow Essencial** — sugestão de preço para validação: **R$ 49/mês**
por fotógrafo/conta, sem taxa de implantação no primeiro contrato.

Inclui acesso ao painel, cadastro de clientes, acompanhamento de sessões,
controle simples de recebimentos, resumo e exportação CSV. Suporte por canal
acordado com o cliente, em horário comercial previamente comunicado.
Não inclui integração Google Calendar, multiusuário, cobrança automática,
migração massiva, agendamento público nem backup individual self-service.

O preço é uma **hipótese comercial**, não uma decisão aprovada nem uma
funcionalidade de cobrança implementada. Confirmar disposição de pagamento
com um fotógrafo real antes de investir em recursos extras.

## Demonstração e venda

1. Mostrar landing e explicar o benefício: não perder o controle de quem
   contratou, qual sessão está agendada e quanto ainda falta receber.
2. Acessar uma conta de demonstração **apenas depois do deploy confirmado**.
   Usar dados fictícios, nunca dados de clientes reais sem autorização.
3. Cadastrar cliente → criar sessão com valor e sinal → mudar status →
   exibir saldo no Resumo → exportar CSV para o Excel.
4. Explicar limites reais: login individual, sem app de pagamentos,
   sem recuperação automática de senha nem integração de agenda ativa.
5. Convidar para usar o plano inicial e combinar pagamento por meio externo.

## Onboarding manual (primeiro fotógrafo)

1. Formalizar preço, vencimento, suporte, política de cancelamento e
   identificação do fornecedor em contrato/termos revisados.
2. Disponibilizar o endereço HTTPS real do Cloudflare Pages.
3. Criar conta com e-mail e senha
   única forte e marcar aceite dos documentos.
4. Validar login, cadastro, sessão, valores, exportação, logout/relogin,
   uso no celular e acesso isolado de outro cliente.
5. Explicar exportação de dados e canal de suporte; registrar data de ativação
   e próxima data de cobrança **fora do sistema**.

## Critérios para receber dinheiro

- GitHub Actions: lint, testes, build e `bun audit` aprovados.
- Funções Convex publicadas e variáveis de autenticação configuradas.
- Cloudflare Pages acessível, login real e persistência testados.
- Teste com duas contas comprovando isolamento dos dados.
- Backup realizado e plano de recuperação compreendido.
- Chaves expostas em histórico revogadas/rotacionadas.
- Termos/privacidade com dados corretos do fornecedor, revisados.
- Teste de aceite do cliente no computador e no celular.

Se qualquer item crítico estiver faltando, fazer demonstração apenas com
dados fictícios; não prometer que o MVP está pronto para dados reais.
