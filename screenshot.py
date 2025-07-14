import os
import sys

try:
    from PIL import ImageGrab
    
    # Take screenshot
    screenshot = ImageGrab.grab()
    screenshot.save('calendar_screenshot.png')
    print("Screenshot saved as calendar_screenshot.png")
    print(f"Screenshot size: {screenshot.size}")
    
except ImportError:
    print("PIL (Pillow) not installed. Installing...")
    os.system("pip install Pillow")
    
    # Try again after installation
    from PIL import ImageGrab
    screenshot = ImageGrab.grab()
    screenshot.save('calendar_screenshot.png')
    print("Screenshot saved as calendar_screenshot.png")
    print(f"Screenshot size: {screenshot.size}")
    
except Exception as e:
    print(f"Error taking screenshot: {e}")