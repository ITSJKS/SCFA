s=input()
ct=0
for i in s:
    if i not in "a,e,i,o,u":
        ct+=1
print(ct)