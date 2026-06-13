s1 = input()
l1 = ['a','e','i','o','u']
count = 0
for i in s1:
    if i not in l1:
        count += 1
print(count)