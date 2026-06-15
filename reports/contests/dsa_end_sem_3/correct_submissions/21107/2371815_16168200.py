# Your code here
l,r=map(int,input().split())
arr=[]
for i in range(l,r+1):
    if(i%2==1):
        arr.append(i)
print(*arr)