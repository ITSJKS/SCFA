# Your code here
n = input()
count = 0
v = "aeiou"
for i in range(len(n)):
    if n[i] not in v:
        count+=1
print(count)