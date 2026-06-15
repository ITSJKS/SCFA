con = 'qwrtypsdfghjklzxcvbnm'
n = input()
count = 0
for i in n:
    if i in con:
        count+=1
print(count)