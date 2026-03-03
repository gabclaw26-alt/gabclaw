@echo off
:: Set the extensions you want to delete (space-separated)
set "EXTENSIONS=*.DBG *.PRT *.INI* *.INSPEC *.GRID *.EGRID *.X* *.h5 *.RSSPEC *.S* *.dbprtx *.session *.F* *.MSG *.RSM *.RTELOG *.ECLEND *.UN* convert_* *.lock* *.RTEMSG *.CFE *.CFG *.h5"
"

:: Loop through each extension and delete files in the current directory and subdirectories
for %%E in (%EXTENSIONS%) do (
    echo Deleting files with extension: %%E
    del /s /q "%%E"
)

echo Cleanup complete.
exit