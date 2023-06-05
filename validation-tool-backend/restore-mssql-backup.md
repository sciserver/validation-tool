# Restore database

```sh

# Original guide: https://learn.microsoft.com/pt-br/sql/linux/tutorial-restore-backup-in-sql-server-container?view=sql-server-ver16

# run mssql container
docker run -e ACCEPT_EULA=Y -e MSSQL_SA_PASSWORD=ValidationToolV3 --name sql -p 1433:1433 -v c:/dev/coleridge/sql-server-backup:/var/opt/mssql/backup -d mcr.microsoft.com/mssql/server:2022-latest

# Move data.bak file to folder "c:/dev/coleridge/sql-server-backup", which is mapped as volume inside container

# Inspect data.bak to list which data can be restored
docker exec -it sql /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P ValidationToolV3 -Q "RESTORE FILELISTONLY FROM DISK = '/var/opt/mssql/backup/data.bak'" | tr -s ' ' | cut -d ' ' -f 1-2

# Restore data from data.bak (use output from previous command to get file names)
docker exec -it sql /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P ValidationToolV3 -Q "RESTORE DATABASE WideWorldImporters FROM DISK = '/var/opt/mssql/backup/data.bak' WITH MOVE 'ShowUStheData_v3' TO '/var/opt/mssql/data/ShowUStheData_v3.mdf', MOVE 'ShowUStheData_v3_log' TO '/var/opt/mssql/data/ShowUStheData_v3_log.ldf'"

# Check if database was indeed restored 
docker exec -it sql /opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P ValidationToolV3 -Q "SELECT Name FROM sys.Databases"

```

# Web Client to query database

```sh

# get IP from sql server container (in my case, it was 172.17.0.2)

docker run -d --name sqlpad -p 5000:3000 -e SQLPAD_ADMIN=admin -e SQLPAD_ADMIN_PASSWORD=admin -e SQLPAD_CONNECTIONS__db__driver=sqlserver -e SQLPAD_CONNECTIONS__db__host=172.17.0.2 -e SQLPAD_CONNECTIONS__db__database=WideWorldImporters -e SQLPAD_CONNECTIONS__db__username=SA -e SQLPAD_CONNECTIONS__db__password=ValidationToolV3 -e SQLPAD_CONNECTIONS__db__name=ValidationToolV3 sqlpad/sqlpad:latest

# Open browser at http://localhost:5000
# Log in as admin/admin

``` 

# Git Patch

1. Stage all changes that are relevant to the patch (no need to commit)
2. Run command to create patch: `git diff --staged > d:\dropbox\validation-tool.patch`