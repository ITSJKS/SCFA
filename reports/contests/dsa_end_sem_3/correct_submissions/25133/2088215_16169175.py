name = input()
l = ["a","e","i","o","u"]
count = 0
for i in name:
    if i not in l:
        count += 1
print(count)