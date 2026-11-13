## Funcionalidades

- **Home:** apresentação das duas áreas, indicadores calculados a partir do JSON e amostras de fabricantes.
- **Catálogos:** busca por fabricante, descrição, palavra-chave ou solução; filtros por tags com múltipla seleção; opção de limpar filtros.
- **Perfis de fabricantes:** descrições, produtos, tecnologias, concorrentes, perfis de clientes e contatos quando cadastrados.
- **Contatos:** ação para copiar e-mails, com tratamento para navegadores em que a API de área de transferência não está disponível.
- **Navegação:** sugestões de outros fabricantes e compatibilidade com links históricos ainda válidos.
- **Interface responsiva:** layout adaptado para desktop, tablets e celulares, inclusive menu mobile.
- **Estados vazios e erros:** tratamento para fabricante não encontrado, dados opcionais ausentes e falha no carregamento do catálogo.

## Tecnologias e organização

- HTML5, CSS3 e JavaScript puro, sem framework SPA e sem etapa de build.
- Bootstrap distribuído nos próprios arquivos do projeto.
- JSON como fonte de conteúdo para as páginas dinâmicas.
- GitHub Pages como opção de hospedagem estática.

```text
portfolio-support/
├── index.html                 # Home
├── section.html               # Catálogo de Security / Data Center
├── vendor.html                # Página de detalhes de cada fabricante
├── assets/
│   ├── JSON/vendors.json      # Fonte única de dados
│   ├── JS/                    # Renderização, busca, filtros e navegação
│   ├── CSS/                   # Estilos e Bootstrap
│   └── IMG/                   # Logos, ícones e imagens
├── pages/
│   ├── sections/              # Redirecionamentos das antigas seções
│   └── vendors/               # Redirecionamentos e mídias legadas
├── legacy-source/             # Cópia histórica, não usada na renderização
```

## Executar localmente

**Pré-requisito:** Python 3 ou outro servidor HTTP estático. Não é necessário instalar Node.js nem rodar `npm install`.

1. Extraia os arquivos mantendo `index.html` na raiz do diretório.
2. Abra um terminal nesse diretório.
3. Inicie o servidor:

   ```bash
   python -m http.server 8000
   ```

4. Acesse **http://localhost:8000/**.

**Importante:** abrir `index.html` diretamente com `file://` pode impedir o carregamento do JSON por restrições do navegador. Utilize HTTP local.

### Rotas principais

| Destino | Caminho |
| :-- | :-- |
| Home | `index.html` |
| Catálogo Security | `section.html?type=security` |
| Catálogo Data Center | `section.html?type=datacenter` |

Os caminhos relativos do projeto são compatíveis com a subpasta `/portfolio-support/` do GitHub Pages.

## Atualizar o catálogo (JSON)

O arquivo **`assets/JSON/vendors.json` é a única fonte de dados da interface**. Ele possui exatamente duas listas principais: `security` e `datacenter`.

Cada fabricante é um objeto dentro da lista de sua área. Campos principais:

| Campo | Uso |
| :-- | :-- |
| `name` | Nome exibido no catálogo e no perfil. |
| `slug` | Identificador estável do fabricante nas URLs. Deve ser único. |
| `logo` | Caminho relativo para a imagem do fabricante. |
| `summary`, `description` | Resumo do cartão e descrição completa do perfil. |
| `tags` | Tecnologias e palavras-chave usadas pelos filtros. |
| `products` | Lista de produtos: `title`, `description` e, quando houver, `logo`. |
| `competitors` | Lista de concorrentes conhecidos; pode ficar vazia. |
| `profile` | Público-alvo em `segments`, `sizes` e `roles`. |
| `contacts` | Lista de objetos com `name`, `role` e `email`; pode ficar vazia. |
| `aliases` | Opcional: nomes alternativos aceitos na busca e na abertura do perfil. |
| `sourceUrl`, `dataStatus` | Opcionais: referência da informação e observação editorial. |

Outros campos já usados por fabricantes existentes — como `tagline`, `heroSubtitle`, `heroImage`, `productSectionTitle`, `productSectionSubtitle`, `productSectionNote` e `productMedia` — devem ser preservados durante edições. Para criar um registro novo, **copie a estrutura de um fabricante existente** e altere apenas os campos necessários.

### Cuidados ao editar

1. **Não altere `slug`s existentes** sem planejar a migração de URLs. Alguns identificadores são históricos, como `1trust` (OneTrust), `sentinel` (SentinelOne) e `pure` (EverPure).
2. Mantenha `security` e `datacenter` como as únicas categorias ativas; não recrie `alliances`.
3. Use caminhos relativos para imagens e confirme que os arquivos existem. Não inclua caminhos locais do computador.
4. Quando não houver informações confiáveis de contatos, concorrentes ou perfis, use listas vazias (`[]`), sem inventar dados.
5. **O JSON é público no GitHub Pages.** Não insira informações confidenciais, credenciais ou contatos que não possam ser divulgados publicamente.

## Situação editorial e dados pendentes

- Os **31 fabricantes já existentes** conservaram os dados previamente migrados; esses textos não passaram por revisão editorial completa nesta atualização.
- Foram adicionados **A10, Citrix, Exabeam, Fortinet, Arista, Quantum e Supermicro**. Os perfis têm descrições e soluções iniciais com referências oficiais registradas em `sourceUrl`, mas ainda precisam de validação comercial.
- Os sete novos registros **não têm contatos, concorrentes ou perfis de clientes cadastrados**. Não foram usados dados inventados para completar esses campos.
- As identificações em SVG desses sete fabricantes são **tipográficas e provisórias**, não logotipos oficiais. Substitua-as quando houver artes autorizadas.
- **Object First, CyberArk, HCL e Pentera** foram retirados do catálogo ativo conforme a lista definitiva.
