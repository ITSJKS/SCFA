S=input()
x="aeiou"
count=0
for i in S:
    if i  not in x:
        count+=1
print(count)