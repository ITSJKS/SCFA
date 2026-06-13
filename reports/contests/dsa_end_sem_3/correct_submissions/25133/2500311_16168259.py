k = ['a','e','i','o','u']
s = input()
c = 0
for i in s:
    if i not in k:c+=1
print(c)