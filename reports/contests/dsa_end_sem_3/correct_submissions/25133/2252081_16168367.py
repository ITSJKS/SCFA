s = input()
count = 0
for i in s:
    if i=="a" or i=="e" or i=="i" or i=="u" or i=="o":
        count+=1
print(len(s)-count)