# Your code here
a=input()
count=0
for i in a:
    if i not in "aeiou":
        count+=1
print(count)