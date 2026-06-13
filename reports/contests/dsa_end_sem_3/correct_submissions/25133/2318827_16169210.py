s=input()
hello=["a","e","i","o","u"]
count=0
for i in s:
    if i not in hello:
        count+=1
print(count)