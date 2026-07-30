import os

path = r"c:\Users\win-11\Desktop\RestaurantBrain-AI\RestaurantBrain-AI\frontend\src\pages\Settings.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Make dark mode text more readable
content = content.replace("dark:text-slate-500", "dark:text-slate-300")
content = content.replace("dark:text-slate-400", "dark:text-slate-200")

# Make dark mode backgrounds more opaque
content = content.replace("dark:bg-slate-800/60", "dark:bg-slate-800")
content = content.replace("dark:bg-slate-800/40", "dark:bg-slate-800")

# Improve border contrast
content = content.replace("dark:border-slate-700/50", "dark:border-slate-600")

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Settings.jsx updated successfully!")
