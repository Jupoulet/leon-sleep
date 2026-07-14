# Plan — Leon Sleep

Dashboard de suivi du sommeil de mon fils (3 ans et demi). Objectif : remplacer
l'approximation par des stats et des moyennes dans le temps.

## Architecture

- Front statique **Vite + React + Recharts**
- Base **Supabase** (Postgres), appelée directement depuis le navigateur (clé anon publique)
- Hébergement **GitHub Pages**, repo **public**, déploiement via **GitHub Actions**
- Config via secrets Actions : `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`
- Base path Vite = `/<repo>/` (sinon assets 404 sur GH Pages)

## Auth

- Login Supabase email / mot de passe, 2 comptes (moi + ma femme)
- **RLS partagée** : tout compte authentifié peut lire / écrire / modifier toutes les
  lignes (pas d'isolement par utilisateur — on suit le même enfant)
- `created_by` reste purement informatif

## Données — table `sleep_nights`

| colonne         | type          | note                                  |
| --------------- | ------------- | ------------------------------------- |
| `night_date`    | DATE          | jour du soir, **unique** (upsert)     |
| `bedtime`       | TIME          | heure locale Paris                    |
| `wake_time`     | TIME          | heure locale Paris                    |
| `night_wakings` | integer       | nombre de réveils dans la nuit        |
| `note`          | text nullable | contexte (dents, malade, sieste…)     |
| `created_by`    | auto          | informatif (compte connecté)          |

- `sleep_duration` **non stocké**, calculé en JS = `wake_time − bedtime`
  (si résultat < 0 → +24 h). Ne soustrait pas les réveils.
- Tout en heure locale **Europe/Paris**, aucune conversion UTC.

## Dashboard

- 4 courbes : heure de réveil, heure de coucher (axe Y = heure de la journée),
  nombre de réveils, **durée de sommeil**
- Jours manquants = **trou visible** (ligne coupée), jamais un 0 trompeur
- Moyennes : ligne pointillés + chiffre par courbe, calculées sur la période filtrée
- Encart **dernière nuit** (`night_date` le plus récent) : durée de dodo, nb réveils,
  heure de réveil, heure de coucher, note, **delta vs moyenne** (rouge/vert)
- Filtres de période : semaine / mois / 3 mois / range custom
  → **filtrage côté client** (on charge toutes les nuits une fois, filtrage en JS)

## Saisie

- Formulaire : date (défaut = hier soir), pré-remplissage si la nuit existe déjà, **upsert**
- **Tableau historique** sous le dashboard (repérer les trous + éditer une nuit passée)

## Conventions

- Textes affichés (UI) en **français**
- Code, noms de colonnes, variables en **anglais**
- Pas de sur-ingénierie : pas de notion de « foyer/famille », pas de backend custom
