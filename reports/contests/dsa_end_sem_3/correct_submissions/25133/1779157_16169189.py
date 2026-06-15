s = input()
vowel = "aeiou"
count =0
for i in s:
    if i not in vowel:
        count+=1
print(count)