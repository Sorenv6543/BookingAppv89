Add-Type -AssemblyName System.Windows.Forms

# Function to simulate mouse click
function Click-Position {
    param(
        [int]$X,
        [int]$Y
    )
    
    # Set cursor position
    [System.Windows.Forms.Cursor]::Position = New-Object System.Drawing.Point($X, $Y)
    
    # Simulate left mouse click
    Add-Type -TypeDefinition @"
        using System;
        using System.Runtime.InteropServices;
        public class MouseControl {
            [DllImport("user32.dll")]
            public static extern void mouse_event(uint dwFlags, uint dx, uint dy, uint dwData, UIntPtr dwExtraInfo);
            public const uint LEFTDOWN = 0x02;
            public const uint LEFTUP = 0x04;
        }
"@
    
    [MouseControl]::mouse_event([MouseControl]::LEFTDOWN, 0, 0, 0, 0)
    Start-Sleep -Milliseconds 50
    [MouseControl]::mouse_event([MouseControl]::LEFTUP, 0, 0, 0, 0)
    
    Write-Host "Clicked at position: $X, $Y"
}

# Click the Demos button (approximate coordinates from screenshot)
Click-Position -X 1134 -Y 675