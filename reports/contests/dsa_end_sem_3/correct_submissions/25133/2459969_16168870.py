# Your code here'
a="aeiou"
l=input()
c=0
for i in l:
    if i not in a:
        c+=1
print(c)