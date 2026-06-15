# Your code here
s=input()
x=0
for i in s:
    if i not in ("a","e","i","o","u"):
        x+=1
print(x)