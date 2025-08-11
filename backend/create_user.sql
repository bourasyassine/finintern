-- Script pour créer l'utilisateur leaveapp_user
-- À exécuter en tant qu'administrateur (system)

-- Créer l'utilisateur
CREATE USER leaveapp_user IDENTIFIED BY leaveapp_password;

-- Attribuer les privilèges nécessaires
GRANT CONNECT, RESOURCE, CREATE SESSION, CREATE TABLE, CREATE SEQUENCE TO leaveapp_user;
GRANT UNLIMITED TABLESPACE TO leaveapp_user;
GRANT CREATE VIEW TO leaveapp_user;
GRANT CREATE PROCEDURE TO leaveapp_user;

-- Vérifier que l'utilisateur a été créé
SELECT username, account_status FROM dba_users WHERE username = 'LEAVEAPP_USER';

-- Valider les changements
COMMIT;

-- Message de confirmation
PROMPT Utilisateur leaveapp_user créé avec succès !
PROMPT Vous pouvez maintenant vous connecter avec cet utilisateur dans SQL Developer.
