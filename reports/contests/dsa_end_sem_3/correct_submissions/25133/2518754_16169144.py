s = input()
con = "bcdfghjklmnpqrstvwxyz"
count = 0
for ch in s:
    if ch in con:
        count +=1
print(count)