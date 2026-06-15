l,r = map(int,input().split())

ans = []
for i in range(l,r+1):
    if i%2!=0:
        ans.append(i)
print(*ans)