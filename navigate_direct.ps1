Add-Type -AssemblyName System.Windows.Forms

# Function to send keyboard input
function Send-Keys($keys) {
    [System.Windows.Forms.SendKeys]::SendWait($keys)
    Start-Sleep -Milliseconds 500
}

# Click on the address bar and navigate directly
[Mouse]::SetCursorPos(1020, 60)  # Address bar location
Start-Sleep -Milliseconds 200

# Click to focus address bar
[Mouse]::mouse_event([Mouse]::MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
Start-Sleep -Milliseconds 50
[Mouse]::mouse_event([Mouse]::MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)

# Wait for focus
Start-Sleep -Milliseconds 300

# Select all and type new URL
Send-Keys "^a"
Send-Keys "localhost:3002/demo"
Send-Keys "{ENTER}"

Write-Host "Navigated to demo route"