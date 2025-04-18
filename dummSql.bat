@echo off
set BIN_PATH="C:\Program Files\PostgreSQL\17\bin"
set BACKUP_PATH=D:\backup\mobiapp_backup.sql
set DB_NAME=Mobiapp
set PGUSER=postgres
set PGPASSWORD=root

%BIN_PATH%\pg_dump.exe -U %PGUSER% -h localhost -p 5432 -F p -f "%BACKUP_PATH%" %DB_NAME%
echo Backup complete.
pause
