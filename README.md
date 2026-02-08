# 📅 Application de Réservation d'Événements

Une application web full-stack permettant de gérer des événements et leurs réservations avec une gestion rigoureuse des rôles et de la sécurité.

## 🎯 Objectif

Centraliser la gestion des événements (formations, ateliers, conférences) et des réservations pour une organisation, en remplaçant les processus manuels (Excel, email) par une solution automatisée et sécurisée.


## ⚙️ Stack Technique

| Layer | Technologies |
|-------|--------------|
| **Frontend** | Next.js 14+, TypeScript, Redux/Context API, React Testing Library |
| **Backend** | NestJS, TypeScript, JWT, class-validator |
| **Database** | PostgreSQL |
| **Testing** | Jest, React Testing Library |
| **Deployment** | Docker, Docker Compose, GitHub Actions |
| **Version Control** | Git, GitHub |

## 📋 Fonctionnalités

### 👤 Participant
- ✅ Consulter les événements publiés
- ✅ Réserver une place sur un événement
- ✅ Gérer ses réservations (consulter, annuler)
- ✅ Télécharger ticket PDF (si confirmée)

### 🔐 Admin
- ✅ Créer/modifier/publier/annuler des événements
- ✅ Gérer les réservations (confirmer, refuser, annuler)
- ✅ Consulter les réservations par événement/participant
- ✅ Voir des indicateurs : taux de remplissage, statuts

## 🚀 Installation

### Prérequis
- Node.js 18+
- Docker & Docker Compose
- Git

### 1️⃣ Clone le projet
```bash
git clone https://github.com/Keltoummalouki/event-booking-app.git
cd event-booking-app
```

## 🔐 Sécurité

- ✅ Authentification JWT sécurisée
- ✅ Hachage des mots de passe (bcrypt)
- ✅ Autorisation basée sur les rôles (RBAC)
- ✅ Validation des entrées (DTO + class-validator)
- ✅ Protection CORS configurée
- ✅ Variables sensibles en .env

## 📚 Documentation Technique

Voir le dossier `/docs` pour :
- Architecture détaillée
- Diagramme de classes UML
- Workflows API
- Guide de contribution

## ⏱️ Chronologie

| Phase | Dates | Durée |
|-------|-------|-------|
| **Lancement** | 02/02/2026 | - |
| **Deadline** | 06/02/2026 | 5 jours |
| **Soutenance** | TBD | 45 min |

## 📋 Livrables

- ✅ Code source (GitHub)
- ✅ Documentation technique (README + /docs)
- ✅ Diagramme de classes
- ✅ Docker Compose fonctionnel
- ✅ Pipeline CI/CD GitHub Actions
- ✅ Tests avec coverage
- ✅ Commits exploitables (conventionnel)

## 🤝 Contribution

1. Créer une branche : `git checkout -b feat/feature-name`
2. Commit avec référence JIRA : `git commit -m "[SC2-15] Ajouter authentification"`
3. Push et créer une PR
4. Attendre validation CI/CD et code review

## 📧 Support & Questions

Pour les problèmes ou clarifications, se référer à la documentation JIRA ou me contacter.

---

**Status** : En développement ⚙️

**Version** : 1.0.0

**Last Updated** : 02/02/2026