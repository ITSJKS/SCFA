s = input()
v = ['a', 'e', 'i', 'o', 'u']
c = 0
for i in s:
    if i not in v:
        c += 1
print(c)