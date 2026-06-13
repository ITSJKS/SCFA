# Your code here
n = input()
count = 0
s = "aeiou"
for i in n:
    if i not in s:
        count+=1
print(count)