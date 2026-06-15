s=input()
vowel = "aeiou"
count =0
for ch in s:
    if ch not in vowel:
        count+=1
    
print(count)