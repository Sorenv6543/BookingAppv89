Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Define mouse click functions
Add-Type -TypeDefinition @"
    using System;
    using System.Runtime.InteropServices;
    public class Mouse {
        [DllImport("user32.dll")]
        public static extern bool SetCursorPos(int x, int y);
        
        [DllImport("user32.dll")]
        public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, uint dwExtraInfo);
        
        public const uint MOUSEEVENTF_LEFTDOWN = 0x02;
        public const uint MOUSEEVENTF_LEFTUP = 0x04;
    }
"@

# Function to click at position
function ClickAt($x, $y) {
    [Mouse]::SetCursorPos($x, $y)
    Start-Sleep -Milliseconds 200
    [Mouse]::mouse_event([Mouse]::MOUSEEVENTF_LEFTDOWN, 0, 0, 0, 0)
    Start-Sleep -Milliseconds 100
    [Mouse]::mouse_event([Mouse]::MOUSEEVENTF_LEFTUP, 0, 0, 0, 0)
    Write-Host "Clicked at ($x, $y)"
}

# Try clicking the Demos button at the bottom of the login dialog
# Based on the screenshot, it should be around here
ClickAt 1135 671