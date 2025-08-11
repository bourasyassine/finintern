-- Script pour vérifier le conteneur et créer l'utilisateur
-- À exécuter en tant qu'administrateur (system)

-- Vérifier le conteneur actuel
SELECT name, con_id, cdb FROM v$database;

-- Vérifier les PDB disponibles
SELECT name, open_mode FROM v$pdbs;

-- Se connecter au PDB XEPDB1 (PDB par défaut d'Oracle XE)
ALTER SESSION SET CONTAINER = XEPDB1;

-- Vérifier que nous sommes dans le bon conteneur
SELECT SYS_CONTEXT('USERENV', 'CON_NAME') as current_container FROM dual;

-- Créer l'utilisateur dans le PDB
CREATE USER leaveapp_user IDENTIFIED BY leaveapp_password;

-- Attribuer les privilèges
GRANT CONNECT, RESOURCE, CREATE SESSION, CREATE TABLE, CREATE SEQUENCE TO leaveapp_user;
GRANT UNLIMITED TABLESPACE TO leaveapp_user;
GRANT CREATE VIEW TO leaveapp_user;
GRANT CREATE PROCEDURE TO leaveapp_user;

-- Vérifier que l'utilisateur a été créé
SELECT username, account_status FROM dba_users WHERE username = 'LEAVEAPP_USER';

-- Valider les changements
COMMIT;

-- Message de confirmation
PROMPT Utilisateur leaveapp_user créé avec succès dans le PDB XEPDB1 !
PROMPT Pour vous connecter dans SQL Developer, utilisez Service Name: XEPDB1
