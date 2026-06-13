L,R = map(int,input().split())
arr = []
for i in range(L,R+1):
    if i%2!=0:
        arr.append(i)
print(*arr)