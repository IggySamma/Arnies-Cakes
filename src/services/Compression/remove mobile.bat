@echo off
for %%F in (*-mobile.*) do (
    echo Deleting "%%F"
    del "%%F"
)