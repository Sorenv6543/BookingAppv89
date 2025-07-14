import pyautogui
import time

# Enable fail-safe
pyautogui.FAILSAFE = True

try:
    # Take a screenshot to see current state
    screenshot = pyautogui.screenshot()
    screenshot.save('before_click.png')
    print("Screenshot saved as before_click.png")
    
    # Look for the Demos button (approximately where it should be)
    # Based on the screenshot, the Demos button appears to be around the bottom right of the login dialog
    demos_x = 1134  # Approximate x coordinate of Demos button
    demos_y = 675   # Approximate y coordinate of Demos button
    
    print(f"Clicking Demos button at coordinates: ({demos_x}, {demos_y})")
    
    # Click the Demos button
    pyautogui.click(demos_x, demos_y)
    
    # Wait a moment for the page to load
    time.sleep(2)
    
    # Take another screenshot to see the result
    after_screenshot = pyautogui.screenshot()
    after_screenshot.save('after_demos_click.png')
    print("After-click screenshot saved as after_demos_click.png")
    
except Exception as e:
    print(f"Error: {e}")