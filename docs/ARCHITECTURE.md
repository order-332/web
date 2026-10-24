# Architecture

Static site. Built ahead of time, served as plain files.

## System

```mermaid
flowchart LR
  visitor([Visitor])
  crew([Crew])

  subgraph gh [GitHub · order-332]
    repo[(web)]
    ci[["CI: build + checks"]]
  end

  host[("Static host")]

  crew -- "pull request" --> repo
  repo -- "merge to main" --> ci
  ci -- "deploy dist/" --> host
  visitor -- "HTTPS" --> host
```

## Pages

```mermaid
flowchart TD
  home["/"]
  home --> zine["/zine"] --> issue["/zine/0x01"] --> article["/zine/0x01/slug"]
  home --> crew["/crew"] --> member["/crew/handle"]
  home --> projects["/projects"] --> project["/projects/slug"]
  home --> about["/about"]
```

## Content

```mermaid
erDiagram
  ISSUE ||--|{ ARTICLE : contains
  MEMBER ||--o{ ARTICLE : writes
  MEMBER }o--o{ PROJECT : works_on

  ISSUE {
    string number "0x01"
    string title
    date released
  }
  ARTICLE {
    string slug
    string title
    string[] authors
  }
  MEMBER {
    string handle
    string role
  }
  PROJECT {
    string slug
    string name
    string status
  }
```

## Release

```mermaid
sequenceDiagram
  actor Dev as Crew
  participant PR as Pull request
  participant CI
  participant Host as Static host

  Dev->>PR: open
  PR->>CI: install · typecheck · build
  CI-->>PR: pass / fail
  PR->>CI: merge to main
  CI->>Host: deploy dist/
```

## Open decisions

- **Framework:** Astro on Bun, or Bun's HTML bundler.
- **Host:** Cloudflare Pages or Netlify.
- **Domain:** to be decided.
