n = input()
c = 0
for i in n:
    if i not in 'aeiou':
        c+=1
print(c)