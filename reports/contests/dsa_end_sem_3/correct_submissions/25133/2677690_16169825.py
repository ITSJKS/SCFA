s = input()
count = 0
for ch in s:
    if ch!='a' and ch!='e' and ch!='i' and ch!='o' and ch!='u':
        count += 1

print(count)