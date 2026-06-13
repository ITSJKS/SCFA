# Your code here
s = input()
li = ["a","e","i","o","u"]
count = 0
for i in s:
    if i not in li:
        count+=1
print(count)