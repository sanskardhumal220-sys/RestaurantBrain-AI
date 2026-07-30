import os

path = r"c:\Users\win-11\Desktop\RestaurantBrain-AI\RestaurantBrain-AI\frontend\src\components\Navbar\Navbar.jsx"
with open(path, "r", encoding="utf-8") as f:
    content = f.read()

# Make all dark text fully white in Navbar
content = content.replace("dark:text-slate-300", "dark:text-white")
content = content.replace("dark:text-slate-200", "dark:text-white")
content = content.replace("dark:text-slate-400", "dark:text-slate-200")

# If there are any stray slate-500 without dark counterpart, let's just make the whole navbar icons whiter
# But we already added dark:text-slate-300 earlier which now becomes dark:text-white!

with open(path, "w", encoding="utf-8") as f:
    f.write(content)

print("Navbar updated")
