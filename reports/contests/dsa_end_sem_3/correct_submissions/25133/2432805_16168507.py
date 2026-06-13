a=list(input())
vow=["a","e","i","o","u"]
cu=0
for i in a :
    if i not in vow:
        cu+=1
print(cu)