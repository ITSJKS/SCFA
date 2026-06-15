# Your code here
s=input()
count=0
for i in s:
    if i not in ("aeiou"):
        count+=1
print(count)