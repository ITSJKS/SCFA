# Your code here

vov = ["a","e","i","o","u"]
a = input()
c=0

for i in range(len(a)):
    if a[i] not in vov:
        c+=1
print(c)