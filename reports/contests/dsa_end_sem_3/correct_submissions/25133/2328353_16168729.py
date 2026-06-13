# Your code here
s = input()
vow = "aeiou"
count=0
for i in s:
    if i in vow:
        count+=1

print(len(s)-count)