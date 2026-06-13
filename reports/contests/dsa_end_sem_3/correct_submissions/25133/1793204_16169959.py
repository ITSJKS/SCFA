s = input()
vov = "aeiou"
count = 0
for ch in s:
    if ch not in vov:
        count += 1
    else:
        continue
print(count)