import os

def process_file(path):
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()

    original_content = content

    # Maximize text contrast globally
    content = content.replace("dark:text-slate-300", "dark:text-white")
    content = content.replace("dark:text-slate-200", "dark:text-white")
    
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
print("Max contrast replacement complete.")
