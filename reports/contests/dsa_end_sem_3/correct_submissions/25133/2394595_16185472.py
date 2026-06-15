s = input()

count = 0
for i in s:
    if i not in "a,e,i,o,u":
        count+=1
print(count)