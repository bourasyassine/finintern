# Guide de Configuration Oracle Database pour le Système de Gestion des Congés

## Prérequis

1. **Oracle Database** installé sur votre machine
2. **SQL Developer** installé
3. **Java 17** installé
4. **Maven** installé

## Étapes de Configuration

### 1. Configuration d'Oracle Database

#### A. Installation d'Oracle Database Express Edition (XE)
- Téléchargez Oracle Database XE depuis le site officiel d'Oracle
- Installez avec les paramètres par défaut
- Port par défaut : 1521
- SID par défaut : XE

#### B. Création de l'utilisateur de base de données

Connectez-vous à SQL Developer en tant que SYSDBA et exécutez :

```sql
-- Création de l'utilisateur
CREATE USER leaveapp_user IDENTIFIED BY leaveapp_password;

-- Attribution des privilèges
GRANT CONNECT, RESOURCE, CREATE SESSION, CREATE TABLE, CREATE SEQUENCE TO leaveapp_user;
GRANT UNLIMITED TABLESPACE TO leaveapp_user;

-- Vérification
CONNECT leaveapp_user/leaveapp_password
```

### 2. Initialisation de la Base de Données

#### A. Dans SQL Developer
1. Ouvrez SQL Developer
2. Créez une nouvelle connexion avec les paramètres :
   - Nom de connexion : LeaveApp
   - Nom d'utilisateur : leaveapp_user
   - Mot de passe : leaveapp_password
   - Hostname : localhost
   - Port : 1521
   - SID : XE

#### B. Exécution du script d'initialisation
1. Ouvrez le fichier `src/main/resources/init-oracle-db.sql`
2. Exécutez le script dans SQL Developer
3. Vérifiez que les tables sont créées

### 3. Configuration de l'Application

#### A. Variables d'environnement (optionnel)
Créez un fichier `.env` dans le dossier `backend/` :

```bash
DB_USERNAME=leaveapp_user
DB_PASSWORD=leaveapp_password
DB_URL=jdbc:oracle:thin:@localhost:1521:XE
```

#### B. Lancement de l'application
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### 4. Vérification

1. **Test de connexion** : L'application doit démarrer sans erreur
2. **Test des endpoints** : Utilisez Postman ou curl pour tester les API
3. **Vérification dans SQL Developer** : Vérifiez que les données sont bien enregistrées

## Dépannage

### Problèmes courants

1. **Erreur de connexion** :
   - Vérifiez que Oracle Database est démarré
   - Vérifiez les paramètres de connexion dans `application.yml`
   - Vérifiez que l'utilisateur `leaveapp_user` existe

2. **Erreur de driver** :
   - Vérifiez que le driver Oracle est dans le classpath
   - Vérifiez le fichier `pom.xml`

3. **Erreur de dialecte** :
   - Vérifiez que `OracleDialect` est bien configuré
   - Vérifiez la version d'Hibernate

### Commandes utiles

```bash
# Vérifier la version de Java
java -version

# Vérifier la version de Maven
mvn -version

# Nettoyer et recompiler
mvn clean compile

# Lancer avec le profil de développement
mvn spring-boot:run -Dspring.profiles.active=dev
```

## Structure de la Base de Données

### Tables principales

1. **users** : Utilisateurs du système
2. **leave_requests** : Demandes de congés

### Relations

- `leave_requests.employee_id` → `users.id`
- `leave_requests.approved_by` → `users.id`

## Sécurité

- Changez les mots de passe par défaut
- Utilisez des variables d'environnement pour les secrets
- Configurez un pare-feu approprié
- Limitez les privilèges de l'utilisateur de base de données 