a=input()
c=0
for i in a:
    if i not in 'aeiou':
        c+=1
print(c)