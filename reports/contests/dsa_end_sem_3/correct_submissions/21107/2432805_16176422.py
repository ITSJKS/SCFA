L,R=map(int,input().split())
ans=[]
for i in range(L,R+1):
    if(i%2!=0):
        ans.append(i)
print(*ans)