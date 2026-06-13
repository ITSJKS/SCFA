s = input()
c=0
for i in s:
    if not i in "aeiou":
        c+=1
print(c)