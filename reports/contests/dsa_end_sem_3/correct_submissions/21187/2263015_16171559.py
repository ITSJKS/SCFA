# Your code here
n=int(input())
arr=[]
g=[]
for i in range(n):
    g=list(map(int,input().split()))
    arr.append(g)
    g=[]
r=[]
l=[]
for i in range(n):
    for j in range(n-1,-1,-1):
        if(i==j):
            r.append(arr[i][j])
        if(i+j==n-1):
            l.append(arr[i][j])
f=0
for i in range(n-1):
    if(r[i]==r[i+1]):
        continue
    else:
        f=1
k=0
for j in range(n-1):
    if(l[i]==l[i+1]):
        continue
    else:
        k=1
if(f==1 or k==1):
    print("No Harmony")
else:
    print("Double Harmony")