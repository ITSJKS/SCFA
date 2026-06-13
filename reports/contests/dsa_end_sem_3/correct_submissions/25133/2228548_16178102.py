# Your codes = in
s = input()
low = "aeiou"
conso = 0
for i in s:
    if i not in low:
        conso+=1

print(conso)