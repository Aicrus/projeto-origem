# Diretrizes de Interação com Github

⚠️ **AVISO CRÍTICO**
A URL definida neste documento (URL_OFICIAL_DO_PROJETO) é a ÚNICA URL CORRETA e fonte da verdade.
Se a URL remota do seu repositório estiver diferente, é a URL remota que DEVE ser corrigida, NUNCA o contrário.

## Repositório Oficial do Projeto
URL_OFICIAL_DO_PROJETO="https://github.com/Aicrus/projeto-origem"

## DIRETRIZES FUNDAMENTAIS:

1. **HIERARQUIA E VERIFICAÇÃO DA URL DO REPOSITÓRIO:**
   - A URL_OFICIAL_DO_PROJETO definida acima é IMUTÁVEL e só pode ser alterada por decisão explícita de mudança do projeto
   - NUNCA altere a URL_OFICIAL_DO_PROJETO para corresponder à URL remota
   - Antes de QUALQUER operação Git, o sistema DEVE verificar se a URL remota corresponde à URL_OFICIAL_DO_PROJETO
   - Se a URL remota estiver diferente, ela DEVE ser corrigida AUTOMATICAMENTE para URL_OFICIAL_DO_PROJETO

2. **PROCESSO DE VERIFICAÇÃO SIMPLIFICADO:**
   ```bash
   # Script de verificação da URL remota sem quebras
   URL_OFICIAL="https://github.com/Aicrus/projeto-origem"
   REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
   
   if [ "$REMOTE_URL" != "$URL_OFICIAL" ]; then
     echo "Corrigindo URL remota."
     git remote remove origin 2>/dev/null
     git remote add origin "$URL_OFICIAL"
     echo "URL remota corrigida para: $URL_OFICIAL"
   else
     echo "URL remota está correta: $REMOTE_URL"
   fi
   ```

⚠️ **IMPORTANTE:** Esta verificação é OBRIGATÓRIA e deve ser executada ANTES de qualquer operação de envio.

## Tipos de commits:

1. Primeiro commit do projeto:
    - Usar mensagem: "feat: initial commit - project setup"
2. Commits subsequentes:
    - Seguir o padrão: "tipo: descrição breve"
    - Tipos comuns:
        - feat (nova funcionalidade)
        - fix (correção)
        - docs (documentação)
        - style (formatação)
        - refactor (refatoração)
        - test (testes)
        - chore (tarefas)

## Processo de Envio de Alterações:

1. **VERIFICAÇÃO INICIAL OBRIGATÓRIA:**
   ```bash
   # Script de verificação da URL remota
   URL_OFICIAL="https://github.com/Aicrus/projeto-origem"
   REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
   
   if [ "$REMOTE_URL" != "$URL_OFICIAL" ]; then
     echo "Corrigindo URL remota."
     git remote remove origin 2>/dev/null
     git remote add origin "$URL_OFICIAL"
     echo "URL remota corrigida para: $URL_OFICIAL"
   else
     echo "URL remota está correta: $REMOTE_URL"
   fi
   ```

2. **Verificar e configurar Git:**
   ```bash
   # Verificar e exibir configuração Git
   git config --get user.name
   git config --get user.email
   ```

3. **Verificar alterações e status:**
   ```bash
   git status
   ```

4. **Adicionar, commitar e enviar alterações:**
   ```bash
   # Adicionar todas as alterações
   git add .
   
   # Verificar o que será commitado
   git status
   
   # Criar commit com mensagem descritiva
   git commit -m "tipo: descrição das alterações"
   
   # Enviar para o repositório remoto
   git push origin main
   ```

5. **Script de automação completo:**
   ```bash
   #!/bin/bash
   # Script completo para verificar e enviar alterações
   
   echo "=== Verificando URL do repositório ==="
   URL_OFICIAL="https://github.com/Aicrus/projeto-origem"
   REMOTE_URL=$(git remote get-url origin 2>/dev/null || echo "")
   
   if [ "$REMOTE_URL" != "$URL_OFICIAL" ]; then
     echo "Corrigindo URL remota."
     git remote remove origin 2>/dev/null
     git remote add origin "$URL_OFICIAL"
     echo "URL remota corrigida para: $URL_OFICIAL"
   else
     echo "URL remota está correta: $REMOTE_URL"
   fi
   
   echo "=== Verificando configuração Git ==="
   git config --get user.name
   git config --get user.email
   
   echo "=== Status das alterações ==="
   git status
   
   read -p "Continuar com o commit e push? (s/n): " continuar
   if [ "$continuar" != "s" ]; then
     echo "Operação cancelada."
     exit 0
   fi
   
   echo "=== Adicionando alterações ==="
   git add .
   
   echo "=== Alterações que serão commitadas ==="
   git status
   
   read -p "Informe a mensagem de commit (tipo: descrição): " mensagem
   git commit -m "$mensagem"
   
   echo "=== Enviando para o repositório remoto ==="
   git push origin main
   
   echo "=== Operação concluída! ==="
   ```

## Regras para Mensagens de Commit:
- Antes de criar um commit, verificar arquivos alterados com `git status`
- Criar mensagem descritiva e breve
- Para alterações menores, usar um único commit
- Para alterações maiores, separar em commits lógicos

## Casos Especiais:
Se for explicitamente solicitado trabalhar em outra branch:

1. Criar nova branch: `git checkout -b nome-da-branch`
2. Fazer alterações necessárias
3. Seguir processo normal de commit
4. Criar PR para main quando solicitado

## Criação de PR (SOMENTE quando solicitado):
`gh pr create --title "Título aqui..." --body "Descrição das alterações"`

- Mensagem do PR deve ser única, sem quebras de linha
- Descrever todas as alterações de forma clara e concisa

Esta versão enfatiza que:
1. Por padrão, todas as alterações devem ser feitas diretamente na branch `main`
2. Só devemos criar branches específicas quando explicitamente solicitado
3. O processo é simplificado para focar no fluxo direto com a main
4. PRs só devem ser criados em casos especiais quando explicitamente solicitado
5. Os comandos são mais diretos e focados no trabalho com a main