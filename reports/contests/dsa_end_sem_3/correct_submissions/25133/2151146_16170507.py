# Your code here
s = input()
op = ["a","e","i","o","u"]
count = 0
for i in s:
    if i not in op:
        count +=1
print(count)