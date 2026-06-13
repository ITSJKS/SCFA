s = input()
count = 0
for ch in s:
    if ch not in 'aeiou':
        count += 1
print(count)