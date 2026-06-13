l=["a","e","i","o","u"]
s=input()
count=0
for i in s:
    if i in l:
        continue
    else:
        count+=1
print(count)