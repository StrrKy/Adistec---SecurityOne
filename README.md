# Portfólio Técnico — Adistec Brasil

Catálogo estático e responsivo de fabricantes, tecnologias e soluções de **Segurança (Security)** e **Data Center**. O conteúdo é centralizado em um único JSON e a identidade visual azul é compartilhada por todas as páginas.

**Site de publicação:** https://brlizkin.github.io/portfolio-support/  
**Versão deste pacote:** 13/11/2026  
**Fonte de dados:** [`assets/JSON/vendors.json`](assets/JSON/vendors.json)

## Catálogo atual

| Categoria | Fabricantes | Produtos e soluções |
|---|---:|---:|
| Security | **24** | **123** |
| Data Center | **13** | **56** |
| **Total** | **37** | **179** |

O catálogo também contém **119 contatos cadastrados**. A antiga área **Alliances foi incorporada a Security**. A10, Object First, CyberArk, HCL e Pentera não pertencem à lista vigente.

### O que o site faz

- **Home (`index.html`):** visão geral das duas áreas, indicadores e destaques.
- **Catálogo (`section.html`):** pesquisa por fabricante/solução, tags e filtros combináveis.
- **Fabricantes (`vendor.html`):** produtos, mini-logos, palavras-chave, concorrentes, segmentos, perfis e contatos, conforme o JSON.
- **Navegação:** menus responsivos, sugestões de outros fabricantes, tratamento de dados opcionais, página inexistente e falhas de carregamento.
- **Contatos:** botão para copiar e-mails cadastrados.

## Estrutura simplificada

```text
portfolio-support/
├── index.html
├── section.html
├── vendor.html
├── 404.html                     # Compatibilidade com URLs antigas no GitHub Pages
├── assets/
│   ├── JSON/
│   │   └── vendors.json         # Única fonte de dados do catálogo
│   ├── CSS/
│   │   ├── all.css              # Identidade visual compartilhada
│   │   └── bootstrap.min.css
│   ├── JS/
│   │   ├── common.js            # Funções e renderização compartilhadas
│   │   ├── app.js               # Home
│   │   ├── section.js           # Catálogo e filtros
│   │   ├── vendor.js            # Perfis e produtos
│   │   └── bootstrap.bundle.min.js
│   └── IMG/
│       ├── logos/               # Logos oficiais dos fabricantes
│       ├── products/            # Mini-logos e imagens das soluções
│       ├── heroes/              # Imagens de destaque preservadas
│       └── icons/               # Ícones compartilhados
├── tests/
│   ├── test_integracao.py       # JSON e comportamento da interface
│   └── test_redirects.py        # Simulação de URLs históricas
├── LISTA_FABRICANTES.md
└── RELATORIO_MIGRACAO.md
```

**Não há mais `pages/`, páginas HTML individuais de fabricante nem CSS individuais.** As imagens antes usadas em `pages/vendors/` foram copiadas para `assets/IMG/products/` e `assets/IMG/heroes/`, e os caminhos foram alterados no JSON. A árvore histórica `legacy-source/`, as pastas duplicadas `assets/css/`, `assets/js/`, `assets/images/` e as versões de Bootstrap não utilizadas também foram retiradas do site publicado.

As três páginas carregam **o mesmo `all.css`** e o mesmo Bootstrap. Os JavaScripts de cada página são separados apenas por responsabilidade funcional.

## Executar localmente

No diretório raiz, use um servidor HTTP:

```bash
python -m http.server 8000
```

Abra http://localhost:8000/. Não use `file://` para abrir o HTML, pois o navegador pode bloquear o `fetch()` do JSON.

### URLs principais

| Página | URL relativa |
|---|---|
| Home | `index.html` |
| Security | `section.html?type=security` |
| Data Center | `section.html?type=datacenter` |
| Fortinet | `vendor.html?type=security&name=fortinet` |
| EverPure | `vendor.html?type=datacenter&name=pure` |
| OneTrust | `vendor.html?type=security&name=1trust` |

Os slugs `pure`, `sentinel`, `1trust` e outros identificadores históricos foram mantidos para não alterar links dinâmicos existentes.

## Manter o catálogo

Edite apenas `assets/JSON/vendors.json` para atualizar conteúdo. A estrutura ativa contém exatamente as chaves `security` e `datacenter`.

Campos mais usados por fabricante:

| Campo | Significado |
|---|---|
| `name`, `slug` | Nome e identificador fixo para URLs |
| `logo` | Logo do fabricante em `assets/IMG/logos/` |
| `summary`, `description`, `tags` | Textos e filtros |
| `products` | Lista com `title`, `description`, `logo` (mini-logo do produto) |
| `heroImage`, `productMedia` | Imagens opcionais de destaque |
| `competitors`, `profile`, `contacts` | Informações comerciais quando disponíveis |
| `aliases`, `sourceUrl`, `dataStatus` | Dados opcionais de compatibilidade e referência |

Exemplo de mini-logo:

```json
{
  "title": "Exemplo de solução",
  "description": "Descrição ilustrativa.",
  "logo": "assets/IMG/products/fabricante/icone-produto.png"
}
```

**Para imagens:** use arquivos reais em `assets/IMG/` e o caminho relativo a partir da raiz do projeto. A existência da imagem é verificada pelos testes. Para fornecedores sem ícones específicos, o JSON pode apontar para o logo oficial do fabricante.

**Não mude os slugs sem planejamento.** Eles definem os links dos perfis e a compatibilidade com URLs antigas. O JSON é público no GitHub Pages: não inclua credenciais nem dados que não devam ser publicados.

## Compatibilidade com URLs antigas

O diretório `pages/` foi removido intencionalmente. No **GitHub Pages**, o arquivo `404.html` reconhece caminhos antigos como:

- `pages/sections/alliances.html` → `section.html?type=security`
- `pages/vendors/checkmarx/checkmarx.html` → `vendor.html?type=security&name=checkmarx`
- `pages/vendors/pure/pure.html` → `vendor.html?type=datacenter&name=pure`

Para fabricantes ativos, o `404.html` consulta o JSON e redireciona o navegador. Fabricantes removidos não são redirecionados para perfis inexistentes.

**Limitação importante:** esse recurso é um **redirecionamento JavaScript executado após uma resposta HTTP 404**, e não um redirecionamento HTTP 301/302. Exige JavaScript e que a hospedagem sirva `404.html` como página personalizada de erro, como ocorre no GitHub Pages. O servidor Python padrão não usa esse 404 personalizado; nele, navegue diretamente pelas novas URLs. Para SEO ou compatibilidade HTTP estrita, seria necessário manter arquivos de redirecionamento ou configurar um serviço de hospedagem com regras de redirecionamento.

## Testes

```bash
python -m pip install beautifulsoup4 playwright
python -m playwright install chromium
python tests/test_integracao.py
python tests/test_redirects.py
```

O segundo teste também exige **Node.js**. O primeiro valida os 37 perfis, os produtos, as imagens, filtros, contatos, aliases e layouts via documentos isolados no Chromium; o segundo executa, de forma simulada, a lógica de redirecionamento do `404.html` para as URLs históricas.

**Limite de validação:** o navegador de testes do ambiente onde esta reorganização foi feita bloqueava requisições HTTP locais. Portanto, não foi possível comprovar os redirecionamentos em um servidor real ou no GitHub Pages publicado. Valide-os novamente após a implantação.

## Publicar no GitHub Pages

1. Faça backup ou crie uma branch no repositório `portfolio-support`.
2. **Remova do repositório as pastas antigas** `pages/`, `legacy-source/`, `assets/css/`, `assets/js/` e `assets/images/`. Remova também os demais arquivos obsoletos que não estão no novo pacote. Apenas extrair o ZIP sobre os arquivos anteriores **não remove arquivos antigos**.
3. Coloque o conteúdo do ZIP limpo na raiz de publicação, incluindo `404.html`, `assets/`, `.nojekyll` e os testes/documentos que desejar manter no Git.
4. Revise `git status`, depois execute `git add -A`, `git commit` e `git push`.
5. Confira a Home, os dois catálogos, os logos e as URLs antigas após a implantação.

Consulte [`RELATORIO_MIGRACAO.md`](RELATORIO_MIGRACAO.md) para a lista das mudanças e os limites da validação.
