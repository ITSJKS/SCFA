s= input()
x = "aeiou"
count = 0
for i in s:
    if i not in x:
        count += 1
print(count)