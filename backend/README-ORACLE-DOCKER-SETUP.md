# Guide de Configuration Oracle Database avec Docker

## Prérequis

1. **Docker** installé sur votre machine
2. **SQL Developer** installé
3. **Java 17** installé
4. **Maven** installé
5. **Compte Oracle** (pour télécharger l'image Docker)

## Étapes de Configuration

### 1. Configuration d'Oracle Database avec Docker

#### A. Télécharger l'image Oracle Database
```bash
# Se connecter au registre Oracle
docker login container-registry.oracle.com

# Télécharger l'image
docker pull container-registry.oracle.com/database/express:21.3.0-xe
```

#### B. Démarrer Oracle Database
```bash
cd backend
docker compose up -d
```

#### C. Vérifier que le conteneur fonctionne
```bash
docker compose ps
docker compose logs oracle
```

### 2. Configuration de SQL Developer

#### A. Créer une nouvelle connexion dans SQL Developer
1. Ouvrez SQL Developer
2. Clic droit sur "Connections" → "New Connection"
3. Remplissez les paramètres :
   - **Connection Name** : LeaveApp
   - **Username** : leaveapp_user
   - **Password** : leaveapp_password
   - **Hostname** : localhost
   - **Port** : 1521
   - **Service name** : XEPDB1

#### B. Tester la connexion
1. Cliquez sur "Test" pour vérifier la connexion
2. Cliquez sur "Save" puis "Connect"

### 3. Vérification de la Base de Données

#### A. Dans SQL Developer
```sql
-- Vérifier que les tables existent
SELECT table_name FROM user_tables;

-- Vérifier les données de test
SELECT * FROM users;
SELECT * FROM leave_requests;
```

#### B. Vérifier les index
```sql
-- Vérifier les index créés
SELECT index_name, table_name FROM user_indexes;
```

### 4. Configuration de l'Application

#### A. Variables d'environnement (optionnel)
Créez un fichier `.env` dans le dossier `backend/` :
```bash
DB_USERNAME=leaveapp_user
DB_PASSWORD=leaveapp_password
DB_URL=jdbc:oracle:thin:@localhost:1521/XEPDB1
```

#### B. Lancement de l'application
```bash
cd backend
mvn -q -DskipTests package
mvn spring-boot:run -Dspring.profiles.active=dev
```

### 5. Test de Connexion

#### A. Test automatique
```bash
# Exécuter le test de connexion
mvn test -Dtest=DatabaseConnectionTest
```

#### B. Test manuel
1. Lancez l'application
2. Vérifiez les logs pour confirmer la connexion
3. Testez les endpoints avec Postman ou curl

## Commandes Docker Utiles

```bash
# Démarrer Oracle
docker compose up -d

# Arrêter Oracle
docker compose down

# Voir les logs
docker compose logs oracle

# Accéder au conteneur
docker exec -it oracle-db bash

# Vérifier l'état du conteneur
docker compose ps

# Redémarrer Oracle
docker compose restart oracle
```

## Dépannage

### Problèmes courants

1. **Erreur de connexion** :
   ```bash
   # Vérifier que le conteneur fonctionne
   docker compose ps
   
   # Vérifier les logs
   docker compose logs oracle
   
   # Redémarrer si nécessaire
   docker compose restart oracle
   ```

2. **Port déjà utilisé** :
   ```bash
   # Vérifier les ports utilisés
   lsof -i :1521
   
   # Modifier le port dans docker-compose.yml si nécessaire
   ```

3. **Problème d'authentification Oracle** :
   ```bash
   # Se connecter au conteneur
   docker exec -it oracle-db bash
   
   # Se connecter en tant que sysdba
   sqlplus sys/oracle_password@//localhost:1521/XEPDB1 as sysdba
   ```

### Vérifications importantes

1. **Oracle Database est démarré** :
   ```bash
   docker compose ps
   # Doit afficher "Up" pour le service oracle
   ```

2. **Port 1521 est accessible** :
   ```bash
   nc -zv localhost 1521
   # Doit se connecter
   ```

3. **SQL Developer peut se connecter** :
   - Testez la connexion dans SQL Developer
   - Vérifiez que les tables existent

## Structure des Fichiers

```
backend/
├── docker-compose.yml          # Configuration Docker
├── init-scripts/
│   ├── 01-init-user.sql       # Script d'initialisation
│   └── 02-startup.sh          # Script de démarrage
├── src/main/resources/
│   ├── application.yml         # Configuration principale
│   ├── application-dev.yml     # Configuration développement
│   └── application-prod.yml    # Configuration production
└── README-ORACLE-DOCKER-SETUP.md
```

## Sécurité

- Changez les mots de passe par défaut
- Utilisez des variables d'environnement pour les secrets
- Limitez l'accès réseau au conteneur Oracle
- Sauvegardez régulièrement les données

## Sauvegarde et Restauration

```bash
# Sauvegarder les données
docker exec oracle-db expdp leaveapp_user/leaveapp_password@XEPDB1 directory=DATA_PUMP_DIR dumpfile=leaveapp_backup.dmp

# Restaurer les données
docker exec oracle-db impdp leaveapp_user/leaveapp_password@XEPDB1 directory=DATA_PUMP_DIR dumpfile=leaveapp_backup.dmp
``` 