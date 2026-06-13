n = input()
count = 0
for i in n:
    if i not in "aeiou":
        count+=1

print(count)