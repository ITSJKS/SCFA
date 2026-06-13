s = input()
x = "aeiou"
c= 0
for i in s:
    if i not in x:
        c+=1
print(c)