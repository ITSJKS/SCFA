# Your code here
l,r=map(int,input().split())
x=[]
for i in range(l,r+1):
    if i%2!=0:
        x.append(i)
print(*x)