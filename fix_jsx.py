import os

base_dir = r"c:\Users\win-11\Desktop\RestaurantBrain-AI\RestaurantBrain-AI\frontend\src\pages"
files_to_fix = ["StaffDashboard.jsx", "RestaurantDashboard.jsx", "CustomerDashboard.jsx"]

for file_name in files_to_fix:
    path = os.path.join(base_dir, file_name)
    with open(path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Replace \` with `
    content = content.replace("\\`", "`")
    # Replace \${ with ${
    content = content.replace("\\${", "${")
    
    with open(path, "w", encoding="utf-8") as f:
        f.write(content)

print("Files fixed.")
