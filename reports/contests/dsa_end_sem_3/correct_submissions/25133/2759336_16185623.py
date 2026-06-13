s=input()
count=0
R = "aeiou"
for i in range(len(s)):
    if s[i] not in R:
        count+=1
    

print(count)