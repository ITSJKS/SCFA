# Your code here
l,r=map(int,input().split())
a=[]
for i in range(l,r+1):
    if i%2!=0:
        a.append(i)
for i in a:
    print(i,end=" ")