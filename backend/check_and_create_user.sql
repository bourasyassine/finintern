-- Script pour vérifier et créer l'utilisateur leaveapp_user
-- À exécuter en tant qu'administrateur (system)

-- Vérifier si l'utilisateur existe déjà
SELECT username, account_status FROM dba_users WHERE username = 'LEAVEAPP_USER';

-- Si l'utilisateur n'existe pas, le créer
BEGIN
  IF NOT EXISTS (SELECT 1 FROM dba_users WHERE username = 'LEAVEAPP_USER') THEN
    EXECUTE IMMEDIATE 'CREATE USER leaveapp_user IDENTIFIED BY leaveapp_password';
    EXECUTE IMMEDIATE 'GRANT CONNECT, RESOURCE, CREATE SESSION, CREATE TABLE, CREATE SEQUENCE TO leaveapp_user';
    EXECUTE IMMEDIATE 'GRANT UNLIMITED TABLESPACE TO leaveapp_user';
    EXECUTE IMMEDIATE 'GRANT CREATE VIEW TO leaveapp_user';
    EXECUTE IMMEDIATE 'GRANT CREATE PROCEDURE TO leaveapp_user';
    DBMS_OUTPUT.PUT_LINE('Utilisateur leaveapp_user créé avec succès !');
  ELSE
    DBMS_OUTPUT.PUT_LINE('Utilisateur leaveapp_user existe déjà.');
  END IF;
END;
/

-- Vérifier à nouveau l'utilisateur
SELECT username, account_status FROM dba_users WHERE username = 'LEAVEAPP_USER';

-- Valider les changements
COMMIT;

-- Message de confirmation
PROMPT Script terminé. Vérifiez le statut de l'utilisateur ci-dessus.
