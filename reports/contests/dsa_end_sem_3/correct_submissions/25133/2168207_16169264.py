# Your code here
s = input()

arr = ["a","e","i","o","u"]
count = 0

for i in s:
    if i not in arr:
        count +=1

print(count)