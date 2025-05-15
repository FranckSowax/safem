# Règles de développement pour Cascade

Ce document présente les règles fondamentales de développement à suivre lors de l'utilisation de Cascade.

## Principes fondamentaux

1. **Concision** - Être concis et éviter les répétitions inutiles dans le code.

2. **Style de code** - Maintenir un style conversationnel mais professionnel dans les commentaires et la documentation.

3. **Convention de nommage** - Utiliser des conventions de nommage cohérentes et descriptives pour les variables, fonctions et classes.

4. **Formatage** - Utiliser le markdown pour la documentation. Encadrer les noms de fichiers et éléments techniques avec des backticks.

5. **Exactitude** - Ne jamais implémenter de fonctionnalités non vérifiées ou basées sur des hypothèses.

6. **Interface utilisateur** - Ne pas générer de code directement pour l'utilisateur, sauf si explicitement demandé.

7. **Configuration système** - Ne jamais altérer les paramètres système sans autorisation explicite.

8. **Accès aux outils** - Respecter les limitations d'accès aux outils et fonctionnalités.

9. **Gestion des erreurs** - Privilégier l'explication factuelle des erreurs plutôt que des excuses.

## Structure du projet

Le projet doit suivre une organisation claire avec séparation des préoccupations:

- `src/` - Code source principal
- `docs/` - Documentation du projet
- `assets/` - Ressources statiques
- `tests/` - Tests unitaires et d'intégration

## Bonnes pratiques

- Écrire des tests pour toutes les fonctionnalités importantes
- Documenter les fonctions et classes avec des commentaires clairs
- Suivre les principes SOLID pour la conception orientée objet
- Optimiser les performances sans sacrifier la lisibilité
- Mettre en place un système de versionnage sémantique

## Sécurité

- Valider toutes les entrées utilisateur
- Ne jamais stocker de secrets dans le code source
- Utiliser des connexions sécurisées pour les communications
- Implémenter une gestion appropriée des autorisations

## Objectif

L'objectif de ces règles est de garantir un développement cohérent, sécurisé et maintenable qui répond aux exigences du projet tout en facilitant la collaboration entre développeurs.
