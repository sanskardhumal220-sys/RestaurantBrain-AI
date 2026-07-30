import os

def process_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content

    # Make dark mode text more readable
    content = content.replace("dark:text-slate-500", "dark:text-slate-300")
    content = content.replace("dark:text-slate-400", "dark:text-slate-200")

    # Make dark mode backgrounds more opaque
    content = content.replace("dark:bg-slate-800/60", "dark:bg-slate-800")
    content = content.replace("dark:bg-slate-800/50", "dark:bg-slate-800")
    content = content.replace("dark:bg-slate-800/40", "dark:bg-slate-800")
    
    # specifically for mobile menu backgrounds often using these
    content = content.replace("dark:bg-slate-900/90", "dark:bg-slate-900")
    content = content.replace("dark:bg-slate-900/95", "dark:bg-slate-900")

    # Improve border contrast
    content = content.replace("dark:border-slate-700/50", "dark:border-slate-600")

    if content != original_content:
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated: {path}")

def process_dir(directory):
    for root, dirs, files in os.walk(directory):
        for file in files:
            if file.endswith(".jsx"):
                process_file(os.path.join(root, file))

process_dir(r"c:\Users\win-11\Desktop\RestaurantBrain-AI\RestaurantBrain-AI\frontend\src")
print("Global replacement complete.")
