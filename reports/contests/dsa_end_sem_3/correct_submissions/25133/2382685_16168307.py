s=input()
d="aeiou"
c=0
for i in s:
    if i not in d:
        c+=1
print(c)