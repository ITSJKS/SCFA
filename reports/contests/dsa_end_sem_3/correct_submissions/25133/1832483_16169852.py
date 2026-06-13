# Your code here
s=input()
x="aeiou"
count=0
for i in range(len(s)):
    if s[i] not in x:
        count+=1
print(count)