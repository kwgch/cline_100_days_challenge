param (
    [string]$number
)

# Create the directory
mkdir ".\src\$number"

# Copy the .clinerules file
Copy-Item ".\.clinerules" ".\src\$number"

# Open the directory in VS Code
code ".\src\$number"
