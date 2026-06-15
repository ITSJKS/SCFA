n = input()
vowel = "aieou"

count = 0

for i in n:
    if i not in vowel:
        count += 1

print(count)