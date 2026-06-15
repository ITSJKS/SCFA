# Your code here
s = input()
c = 0
for ch in s:
    if ch not in 'aeiou':
        c+= 1

print(c)