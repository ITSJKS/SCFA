# Your code here
s = input()
ans = 0
for i in s:
    if i not in "aeiou":
        ans += 1

print(ans)