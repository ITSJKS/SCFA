s = input()

v = "aeiou"

c = 0

for i in s:
    if i not in v:
        c += 1
print(c)