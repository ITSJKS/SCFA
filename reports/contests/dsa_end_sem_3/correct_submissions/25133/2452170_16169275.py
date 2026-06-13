s = input()
l = len(s)
count = 0
for ch in s:
    if ch=="a" or ch=="e" or ch=="i" or ch=="o" or ch=="u" :
        count+=1
print(l-count)