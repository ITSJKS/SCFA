s = input()

cnt = 0
for c in s:
    if c not in "aeiou":
        cnt += 1
    
print(cnt)