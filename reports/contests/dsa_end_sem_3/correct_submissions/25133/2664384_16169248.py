# Your code here
s=input()
c=0
for i in s:
    if i not in "aeiou":
        c=c+1
print(c)