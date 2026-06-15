s = input()
vowels = "aeiou"
count = 0
for i in s:
    if i not in vowels:
        count += 1

print(count)