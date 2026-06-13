vow = 'aeiou'
s = input()
cnt = 0

for i in range(len(s)):
    if s[i] not in vow:
        cnt += 1

print(cnt)