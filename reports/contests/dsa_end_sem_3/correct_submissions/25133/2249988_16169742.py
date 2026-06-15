# Your code here\
s = input()
cons = "aeiou"
count = 0
for i in s:
    if i in cons:
        count += 1


print(len(s)-count)