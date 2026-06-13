a=input()
c=0
for i in a:
    if i in"aeiou":
        continue
    else:
        c+=1
print(c)