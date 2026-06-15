a=input()
ans="aeiou"
c=0
for i in a:
    if i not in ans:
        c+=1
print(c)