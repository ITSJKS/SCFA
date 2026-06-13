n = input()
cons = "aeiou"
count = 0

for x in n:
    if x not in cons:
        count += 1

print(count)