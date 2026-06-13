# Your code here
s = input()
count = 0

for i in s:
    if i == "a" or i == "e" or i == "i" or i =="o" or i == "u":
        continue
    else:
        count += 1
print(count)