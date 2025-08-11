#!/bin/bash

# Script de démarrage rapide pour Oracle Database avec Docker

echo "🚀 Démarrage d'Oracle Database avec Docker..."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier si docker-compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez installer Docker Compose d'abord."
    exit 1
fi

# Se placer dans le bon répertoire
cd "$(dirname "$0")"

echo "📦 Démarrage du conteneur Oracle..."
docker-compose up -d

echo "⏳ Attente du démarrage d'Oracle Database..."
sleep 30

# Vérifier que le conteneur fonctionne
if docker-compose ps | grep -q "Up"; then
    echo "✅ Oracle Database est démarré et fonctionne!"
    echo "🔗 URL de connexion: localhost:1521"
    echo "👤 Utilisateur: leaveapp_user"
    echo "🔑 Mot de passe: leaveapp_password"
    echo "📊 SID: ORCLCDB"
    echo ""
    echo "📋 Pour vous connecter avec SQL Developer:"
    echo "   - Hostname: localhost"
    echo "   - Port: 1521"
    echo "   - SID: ORCLCDB"
    echo "   - Username: leaveapp_user"
    echo "   - Password: leaveapp_password"
    echo ""
    echo "🚀 Pour démarrer l'application Spring Boot:"
    echo "   mvn spring-boot:run -Dspring.profiles.active=dev"
else
    echo "❌ Erreur lors du démarrage d'Oracle Database"
    echo "📋 Vérifiez les logs avec: docker-compose logs oracle"
    exit 1
fi 