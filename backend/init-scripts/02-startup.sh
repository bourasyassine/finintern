#!/bin/bash

# Script de démarrage pour Oracle Docker
# Ce script sera exécuté après que la base de données soit prête

echo "Attente de la disponibilité d'Oracle Database..."

# Attendre que Oracle soit prêt
while ! sqlplus -s sys/oracle_password@//localhost:1521/ORCLCDB as sysdba <<< "SELECT 1 FROM dual;" > /dev/null 2>&1; do
    echo "En attente d'Oracle Database..."
    sleep 30
done

echo "Oracle Database est prêt!"

# Exécuter le script d'initialisation
sqlplus sys/oracle_password@//localhost:1521/ORCLCDB as sysdba @/opt/oracle/scripts/startup/01-init-user.sql

echo "Initialisation terminée!" 