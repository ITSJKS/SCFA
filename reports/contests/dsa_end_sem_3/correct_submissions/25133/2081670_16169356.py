s = input()

v = "aeiou"
count = 0
for i in s:
    if i not in v:
        count += 1
print(count)