l,r = map(int,input().split())
l1 = []
for i in range(l,r+1):
    if i%2 != 0:
        l1.append(i)
print(*l1)