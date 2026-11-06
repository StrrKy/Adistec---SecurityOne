# Adistec Brasil — Portfólio integrado (JSON)

Versão unificada do portfólio de fabricantes da Adistec Brasil, com **identidade visual azul**, layout responsivo e dados centralizados em `assets/JSON/vendors.json`. O conteúdo foi migrado do projeto `portfolio-support-main.zip` fornecido, mantendo **35 fabricantes**, **171 produtos/soluções**, **135 contatos de equipe** e **363 termos tecnológicos distintos**.

## Abrir localmente

Requer apenas um servidor HTTP local (o site é estático; não precisa de Node, npm ou build):

```bash
python -m http.server 8000
```

Acesse http://localhost:8000/. **Não abra `index.html` como `file://`**: navegadores limitam requisições `fetch()` a JSON local nesse protocolo.

## Publicar no GitHub Pages

1. Faça backup do repositório antes de substituir arquivos.
2. Copie **todo o conteúdo desta pasta** (inclusive `.nojekyll`, `assets/`, `pages/`, `section.html`, `vendor.html`) para a **raiz da branch/pasta publicada** em `brlizkin.github.io/portfolio-support/`.
3. Faça commit e aguarde a publicação pelo GitHub Pages. Nenhuma alteração foi enviada automaticamente ao GitHub.
4. Confira as rotas `index.html`, `section.html?type=security`, `section.html?type=alliances`, `section.html?type=datacenter`, e `vendor.html?type=datacenter&name=pure` no site publicado.

Os caminhos são **relativos**, então funcionam também quando o site está publicado abaixo de `/portfolio-support/`, e os URLs antigos de fabricantes/categorias redirecionam para o catálogo JSON.

## Arquitetura

| Arquivo | Finalidade |
| --- | --- |
| `index.html` | Página inicial, métricas derivadas do JSON e vitrines das três áreas |
| `section.html?type=security\|alliances\|datacenter` | Catálogo por unidade, pesquisa e filtros de tags |
| `vendor.html?type=security&name=forcepoint` | Perfil unificado de fabricante, sem HTML por marca |
| `assets/JSON/vendors.json` | Fonte única da verdade: **12 Segurança, 13 Alliances e 10 Data Center** |
| `assets/JS/common.js` | Busca/carregamento do JSON, links por slug, componentes compartilhados |
| `assets/JS/app.js` | Home e indicadores |
| `assets/JS/section.js` | Filtros, busca por marca/descrição/produto e tags |
| `assets/JS/vendor.js` | Produtos, imagens, palavras-chave, concorrentes, perfil e contatos |
| `assets/CSS/all.css` | Estilos próprios, tema azul; Bootstrap mantido sem customização direta |
| `pages/vendors/{slug}/{slug}.html` | Compatibilidade com URLs antigas: **redirecionamentos**, não dados paralelos |
| `pages/sections/{tipo}.html` | Compatibilidade com URLs antigas de categoria |
| `legacy-source/` | Cópias dos HTML/CSS/JS originais antes da migração, para consulta |
| `tools/import_legacy.py` | Script de migração a partir do *projeto original em HTML* |
| `tools/make_redirects.py` | Geração inicial dos links legados (não executar novamente sem as fontes originais) |
| `tests/test_integracao.py` | Testes de integridade dos dados e interações no navegador |

## Atualizar um fabricante

Edite `assets/JSON/vendors.json` e mantenha o fabricante na seção correta. Cada entrada aceita:

```json
{
  "name": "Nome apresentado",
  "slug": "identificador-estavel",
  "logo": "assets/IMG/logos/nome.png",
  "summary": "Resumo mostrado nos cartões",
  "description": "Descrição completa mostrada no perfil",
  "tagline": "Frase principal do fabricante",
  "heroSubtitle": "Resumo exibido na abertura do perfil",
  "tags": ["Tecnologia", "Especialidade"],
  "link": "vendor.html?type=security&name=identificador-estavel",
  "products": [{"title": "Solução", "description": "Detalhes", "logo": ""}],
  "competitors": ["Outro fabricante"],
  "profile": {"segments": ["Tecnologia"], "sizes": ["Enterprise"], "roles": ["CISO"]},
  "contacts": [{"name": "Pessoa", "role": "Especialista", "email": "contato@exemplo.com"}],
  "productSectionTitle": "Principais produtos",
  "productSectionSubtitle": "",
  "productSectionNote": "",
  "productMedia": "",
  "heroImage": ""
}
```

**Importante:** mantenha o `slug` ao renomear o fabricante. Os URLs funcionam por `type` + `slug`; por exemplo, o nome **EverPure** usa o identificador `pure`, e **One Trust** usa `1trust`.

## Dados da origem e pontos para revisão editorial

O conteúdo textual (incluindo nomes, e-mails, produtos e descrições) foi transcrito das páginas fornecidas, sem auditoria externa de veracidade/atualização. Alguns pontos da **fonte** merecem revisão antes de publicação:

- Na página original de **Elastic**, o texto introdutório dos produtos menciona **Checkmarx** (aparente cópia de conteúdo). Ele foi preservado no JSON em `productSectionNote`, sem alterar a origem silenciosamente.
- O e-mail visível no original de **VMware** para um dos contatos difere do valor no atributo `data-email`. O JSON conserva o **valor utilizado pelo botão de cópia** (`data-email`); confira com o time antes de compartilhar.
- O original de **Claroty** usa extensão não padrão `.iix` em ícones de produtos; a versão integrada não tenta exibir um ícone inválido, mantendo o nome e a descrição de todas as soluções. O logo principal do fabricante funciona.