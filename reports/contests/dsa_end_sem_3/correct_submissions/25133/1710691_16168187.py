# Your code here
R = input()
V = "aeiou"
count = 0
for i in R:
    if i not in V:
        count+=1
print(count)