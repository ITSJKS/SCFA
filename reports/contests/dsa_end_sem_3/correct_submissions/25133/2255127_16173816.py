# Your code here
arr=input()

c=["a","e","i","o","u"]
count=0

for i in arr:
    if i not in c:
        count+=1
print(count)