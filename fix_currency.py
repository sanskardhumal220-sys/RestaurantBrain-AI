import glob, os; files=glob.glob('frontend/src/**/*.jsx', recursive=True); c=0;
for f in files:
    with open(f, 'r', encoding='utf-8') as file:
        content = file.read()
    if '?{' in content:
        content = content.replace('?{', '${')
        with open(f, 'w', encoding='utf-8') as file:
            file.write(content)
        c+=1
        print('Fixed ' + f)
print('Total fixed: ' + str(c))
